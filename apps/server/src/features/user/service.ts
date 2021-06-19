import { TE, pipe } from '@/infrastructure/fpts'

import { Pool } from 'pg'

import { Id } from '@/infrastructure/Id'
import { findAllUsers, findProfileWithId, findUserById } from '@/features/user/repo'
import {
   PublicProfile,
   PublicUser,
   toPublicProfile,
   toPublicUser,
   DbUser,
} from '@/domain/User'
import { ApplicationError } from '@/infrastructure/error'
import { CustomError } from 'ts-custom-error'
import { DBError } from '@/infrastructure/db'

export const getPublicUser = (
   id: Id<DbUser>,
   pool: Pool
): TE.TaskEither<NoUserFound | DBError, PublicUser> =>
   pipe(
      findUserById(id, pool),
      TE.chain(maybeUser =>
         pipe(
            maybeUser,
            TE.fromOption(() => new NoUserFound())
         )
      ),
      TE.map(toPublicUser)
   )

export const allUsers = (
   pool: Pool
): TE.TaskEither<NoUsersFound | DBError, PublicUser[]> =>
   pipe(
      findAllUsers(pool),
      TE.chain(maybeUsers =>
         pipe(
            maybeUsers,
            TE.fromOption(() => new NoUsersFound())
         )
      ),
      TE.map(users => users.map(toPublicUser))
   )

export const getPublicProfile = (
   id: Id<DbUser>,
   pool: Pool
): TE.TaskEither<NoProfileFound | DBError, PublicProfile> =>
   pipe(
      findProfileWithId(id, pool),
      TE.chain(maybeProfile =>
         pipe(
            maybeProfile,
            TE.fromOption(() => new NoProfileFound())
         )
      ),
      TE.map(toPublicProfile)
   )

export class NoUserFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoUserFound'
   log = true
}
export class NoUsersFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoUsersFound'
   log = true
}
export class NoProfileFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoProfileFound'
   log = true
}
