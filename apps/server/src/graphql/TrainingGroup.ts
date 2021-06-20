import {} from '@/infrastructure/fpts'
import gql from 'graphql-tag'
import { Resolver } from './Resolvers'

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

export const trainingGroupResolvers: Resolver = {
   Query: {
      trainingGroup: () => void 1,
      trainingGroups: () => void 1,
   },

   Mutation: {
      createGroup: () => void 1,
   },
}
