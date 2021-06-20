import gql from 'graphql-tag'

import { pipe, TE } from '@/infrastructure/fpts'
import {
   getPublicTrainingGroup,
   createTrainingGroup,
   findAllTrainingGroups,
} from '@/features/trainingGroup/service'
import { NewTrainingGroup } from '@/features/trainingGroup/repo'
import { MyContext } from './Context'
import { Resolver } from './Resolvers'
import { doTE } from '@/infrastructure/Helpers'
import { Id } from '@/infrastructure/Id'
import { DbTrainingGroup } from '@/domain/TrainingGroup'
import { Pool } from 'pg'
import { getPublicUser } from '@/features/user/service'

export const trainingGroupSchema = gql`
   extend type Query {
      trainingGroup(id: Int!): TrainingGroup!
      trainingGroups: [TrainingGroup!]!
   }

   type Mutation {
      createGroup(input: NewGroup!): Int!
   }

   input NewGroup {
      name: String!
      owner: Int!
      privacy: PRIVACY!
   }

   type TrainingGroup {
      id: Int!
      name: String!
      owner: User!
      privacy: PRIVACY!
   }

   enum PRIVACY {
      open
      private
   }
`

type CreateGroupInput = {
   input: NewTrainingGroup
}

type TrainingGroupInput = {
   id: Id<DbTrainingGroup>
}

export const trainingGroupResolvers: Resolver = {
   Query: {
      trainingGroup: (_: any, { id }: TrainingGroupInput, { pool }: MyContext) =>
         doTE(trainingGroupResolver(id, pool)),
      trainingGroups: (_: any, __: any, { pool }: MyContext) =>
         doTE(trainingGroupsResolver(pool)),
   },

   Mutation: {
      createGroup: (_: any, { input }: CreateGroupInput, { pool }: MyContext) =>
         doTE(createTrainingGroup(input, pool)),
   },
}

const trainingGroupResolver = (id: Id<DbTrainingGroup>, pool: Pool) =>
   pipe(
      TE.bindTo('group')(getPublicTrainingGroup(id, pool)),
      TE.bind('owner', ({ group }) => getPublicUser(group.owner, pool)),
      TE.map(({ group, owner }) => ({
         id: group.id,
         name: group.name,
         owner,
         privacy: group.privacy,
      }))
   )

const trainingGroupsResolver = (pool: Pool) =>
   pipe(
      TE.bindTo('groups')(findAllTrainingGroups(pool)),
      // TODO find owners for each group
      TE.bind('users', ({ groups }) => TE.of('foo'))
   )
