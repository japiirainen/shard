import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { Pool, PoolClient, QueryResult } from 'pg'
import { migrate } from 'postgres-migrations'
import { CustomError } from 'ts-custom-error'
import { v4 as uuid } from 'uuid'

import { DATABASE_URL } from './config'
import { ApplicationError } from './error'
import { logger } from './logger'
import { memoize } from './Memoize'

export class DBError extends CustomError implements ApplicationError {
   status = 500
   code = uuid()
   log = true
}

export const cratePgPool = async (): Promise<Pool | null> => {
   const pool = new Pool({ connectionString: DATABASE_URL })

   try {
      const client = await pool.connect()
      try {
         await migrate({ client }, 'sql')
      } finally {
         await client.release()
      }
   } catch (e) {
      logger.error('Failed to connect to db')
      return null
   }
   return pool
}

/**
 * HOF for queries
 */
export const withConnection =
   <T extends any[], R>(pool: Pool, memoizeTtl: O.Option<number>) =>
   (
      fn: (client: PoolClient, ...args: T) => Promise<QueryResult>
   ): ((...args: T) => TE.TaskEither<DBError, R[]>) =>
   (...args): TE.TaskEither<DBError, R[]> => {
      const doQuery = () =>
         pool.connect().then(connection =>
            fn(connection, ...args)
               .then(res => res.rows as R[])
               .finally(() => connection.release())
         )

      const memoizedQuery = O.fold(
         () => doQuery,
         (ttl: number) => {
            return memoize(() => {
               logger.info('Cache is old, fetching from DB')
               return doQuery()
            }, ttl)
         }
      )(memoizeTtl)

      return TE.tryCatch(
         () => memoizedQuery(),
         () => new DBError('db query error')
      )
   }

/**
 * HOF for transactions
 */
export const transaction =
   <T extends any[], R>(pool: Pool) =>
   (
      fn: (client: PoolClient, ...args: T) => Promise<R>
   ): ((...args: T) => TE.TaskEither<DBError, R>) =>
   (...args): TE.TaskEither<DBError, R> => {
      const queryP = pool.connect().then(async connection => {
         await connection.query('BEGIN')
         return fn(connection, ...args)
            .then(async res => {
               await connection.query('COMMIT')
               return res
            })
            .catch(async e => {
               await connection.query('ROLLBACK')
               throw e
            })
            .finally(() => connection.release())
      })

      return TE.tryCatch(
         () => queryP,
         () => new DBError('db transaction error')
      )
   }
