import { pipe, TE, A, withDebug } from '@/infrastructure/fpts'
import {
   NewTrainingGroup,
   findTrainingGroupbyId,
   insertTrainingGroup,
   allTrainingGroups,
} from '@/features/trainingGroup/repo'
import { Id } from '@/infrastructure/Id'
import {
   DbTrainingGroup,
   PublicTrainingGroup,
   toPublicTrainingGroup,
} from '@/domain/TrainingGroup'
import { Pool } from 'pg'
import { ApplicationError } from '@/infrastructure/error'
import { CustomError } from 'ts-custom-error'
import { DBError } from '@/infrastructure/Db'

export const getPublicTrainingGroup = (
   id: Id<DbTrainingGroup>,
   pool: Pool
): TE.TaskEither<DBError | NoTrainingGroupFound, PublicTrainingGroup> =>
   pipe(
      withDebug(findTrainingGroupbyId(id, pool))(`Getting training group with id: ${id}`),
      TE.chain(maybeTg =>
         pipe(
            maybeTg,
            TE.fromOption(() => new NoTrainingGroupFound())
         )
      ),
      TE.map(toPublicTrainingGroup)
   )

export const createTrainingGroup = (
   newTg: NewTrainingGroup,
   pool: Pool
): TE.TaskEither<DBError, Id<DbTrainingGroup>> =>
   pipe(
      NewTrainingGroup.decode(newTg),
      TE.fromEither,
      TE.mapLeft(() => new TrainingGroupDecodeError()),
      TE.chain(tg =>
         withDebug(insertTrainingGroup(tg, pool))(
            `Inserting training group: ${JSON.stringify(tg)}`
         )
      ),
      TE.chain(maybeId =>
         pipe(
            maybeId,
            TE.fromOption(() => new DBError())
         )
      )
   )

export const findAllTrainingGroups = (
   pool: Pool
): TE.TaskEither<DBError | NoTrainingGroupsFound, Array<PublicTrainingGroup>> =>
   pipe(
      allTrainingGroups(pool),
      TE.chain(maybeGroups =>
         pipe(
            maybeGroups,
            TE.fromOption(() => new NoTrainingGroupsFound())
         )
      ),
      TE.map(A.map(toPublicTrainingGroup))
   )

export class NoTrainingGroupFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoTrainingGroupFound'
   log = true
}

export class NoTrainingGroupsFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoTrainingGroupsFound'
   log = true
}

export class TrainingGroupDecodeError extends CustomError implements ApplicationError {
   status = 404
   code = 'TrainingGroupDecodeError'
   log = true
}
