import { ApolloError } from 'apollo-server-express'
import { redBright } from 'chalk'

import { TE, E, trace, traceWithValue, flow } from '@/infrastructure/fpts'
import { identity, pipe } from 'fp-ts/lib/function'
import { logger } from './Logger'
import { ApplicationError } from './error'

export const doTE = <T>(task: TE.TaskEither<ApplicationError, T>): Promise<T> =>
   task().then(
      E.fold((err: ApplicationError) => {
         logger.error(err)
         throw new ApolloError(err.code)
      }, identity)
   )

export const withDebug =
   <T>(task: TE.TaskEither<ApplicationError, T>) =>
   (msg: string): TE.TaskEither<ApplicationError, T> =>
      process.env.NODE_ENV === 'development'
         ? pipe(
              TE.of(undefined),
              TE.map(
                 trace(
                    redBright('[DEBUG]') + `-${new Date().toLocaleTimeString()} => ${msg}`
                 )
              ),
              TE.chain(() => task)
           )
         : task

// TODO
export const withDebugValue =
   <T>(task: TE.TaskEither<ApplicationError, T>) =>
   (msg: string) =>
      process.env.NODE_ENV === 'development' ? flow(task, traceWithValue(msg)) : task
