import { pipe, TE } from '@/infrastructure/fpts'
import {
   NewTrainingGroup,
   findTrainingGroupbyId,
   insertTrainingGroup,
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
      findTrainingGroupbyId(id, pool),
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
      TE.chain(tg => insertTrainingGroup(tg, pool)),
      TE.chain(maybeId =>
         pipe(
            maybeId,
            TE.fromOption(() => new DBError())
         )
      )
   )

export class NoTrainingGroupFound extends CustomError implements ApplicationError {
   status = 404
   code = 'NoTrainingGroupFound'
   log = true
}

export class TrainingGroupDecodeError extends CustomError implements ApplicationError {
   status = 404
   code = 'TrainingGroupDecodeError'
   log = true
}
