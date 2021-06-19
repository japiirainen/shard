import * as i from 'io-ts'
import { Maybe, TE, pipe, A } from '@/infrastructure/fpts'

import { Pool } from 'pg'

import { DbTrainingGroup } from '@/domain/TrainingGroup'
import { DBError, withConnection } from '@/infrastructure/Db'
import { Id } from '@/infrastructure/Id'

export const NewTrainingGroup = i.type({
   name: i.string,
   owner: i.number,
   privacy: i.union([i.literal('private'), i.literal('open')]),
})

export type NewTrainingGroup = i.TypeOf<typeof NewTrainingGroup>

const trainingGroupTable = 'training_group'

export const insertTrainingGroup = (
   newTg: NewTrainingGroup,
   pool: Pool
): TE.TaskEither<DBError, Maybe<Id<DbTrainingGroup>>> =>
   withConnection(pool, conn =>
      conn
         .query(
            `
        INSERT INTO ${trainingGroupTable} (name, owner, privary)
        VALUES ($1, $2, $3) RETURNING id;
   `,
            [newTg.name, newTg.owner, newTg.privacy]
         )
         .then(res =>
            pipe(
               res.rows,
               A.map((o: { id: number }) => o.id),
               A.head
            )
         )
   )

export const findTrainingGroupbyId = (
   id: Id<DbTrainingGroup>,
   pool: Pool
): TE.TaskEither<DBError, Maybe<DbTrainingGroup>> =>
   withConnection(pool, conn =>
      conn
         .query(`SELECT * FROM ${trainingGroupTable} WHERE id = $1 LIMIT 1;`, [id])
         .then(res => A.head(res.rows))
   )
