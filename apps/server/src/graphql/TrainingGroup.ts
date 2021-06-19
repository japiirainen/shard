import {} from '@/infrastructure/fpts'
import gql from 'graphql-tag'

export const trainingGroupSchema = gql`
   extend type Query {
      trainingGroup(id: Int!): TrainingGroup
   }

   type TrainingGroup {
      id: Int!
      name: Int!
      owner: User!
      privacy: PRIVACY!
   }

   enum PRIVACY {
      open
      private
   }
`
