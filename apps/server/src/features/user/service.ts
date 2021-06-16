import * as TE from 'fp-ts/lib/TaskEither'

import { pipe } from 'fp-ts/lib/function'
import { Pool } from 'pg'

import { Id } from '@/infrastructure/Id'
import { findAllUsers, findUserById } from '@/features/user/repo'
import { PublicUser, toPublicUser, User } from '@/domain/User'
import { ApplicationError } from '@/infrastructure/error'
import { CustomError } from 'ts-custom-error'
import { DBError } from '@/infrastructure/db'

export const getPublicUser = (
   pool: Pool,
   id: Id<User>
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

class NoUserFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoUserFound'
   log = true
}
class NoUsersFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoUsersFound'
   log = true
}
