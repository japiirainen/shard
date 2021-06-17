import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'

import { Pool } from 'pg'

import { DBError, withConnection } from '@/infrastructure/Db'
import { Id } from '@/infrastructure/Id'
import { Profile, User } from '@/domain/User'

export const findUserById = (
   id: Id<User>,
   pool: Pool
): TE.TaskEither<DBError, O.Option<User>> =>
   withConnection(pool, conn =>
      conn
         .query('SELECT * FROM people WHERE id = $1 LIMIT 1', [id])
         .then(res => A.head(res.rows))
   )

export const findAllUsers = (pool: Pool): TE.TaskEither<DBError, O.Option<Array<User>>> =>
   withConnection(pool, conn =>
      conn.query('SELECT * FROM people;').then(res => O.fromNullable(res.rows))
   )

export const findProfileWithId = (
   id: Id<User>,
   pool: Pool
): TE.TaskEither<DBError, O.Option<Profile>> =>
   withConnection(pool, conn =>
      conn
         .query('SELECT * FROM user_profile WHERE profile_owner = $1 LIMIT 1', [id])
         .then(res => A.head(res.rows))
   )
