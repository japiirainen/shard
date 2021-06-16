import { ApolloError } from 'apollo-server-express'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

import { identity } from 'fp-ts/lib/function'
import { logger } from './Logger'
import { ApplicationError } from './error'

export const doTE = <T>(task: TE.TaskEither<ApplicationError, T>): Promise<T> =>
   task().then(
      E.fold((err: ApplicationError) => {
         logger.error(err)
         throw new ApolloError(err.code)
      }, identity)
   )
