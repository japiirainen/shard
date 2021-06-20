import { TE, Maybe, A, M } from '@/infrastructure/fpts'

import { Pool } from 'pg'

import { DBError, withConnection } from '@/infrastructure/Db'
import { Id } from '@/infrastructure/Id'
import { DbProfile, DbUser } from '@/domain/User'

export const findUserById =
   (pool: Pool) =>
   (id: Id<DbUser>): TE.TaskEither<DBError, Maybe<DbUser>> =>
      withConnection(pool, conn =>
         conn
            .query('SELECT * FROM people WHERE id = $1 LIMIT 1', [id])
            .then(res => A.head(res.rows))
      )

export const findAllUsers = (pool: Pool): TE.TaskEither<DBError, Maybe<Array<DbUser>>> =>
   withConnection(pool, conn =>
      conn.query('SELECT * FROM people;').then(res => M.fromNullable(res.rows))
   )

export const findProfileWithId = (
   id: Id<DbUser>,
   pool: Pool
): TE.TaskEither<DBError, Maybe<DbProfile>> =>
   withConnection(pool, conn =>
      conn
         .query('SELECT * FROM user_profile WHERE profile_owner = $1 LIMIT 1', [id])
         .then(res => A.head(res.rows))
   )
