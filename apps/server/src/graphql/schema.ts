import { makeExecutableSchema } from 'apollo-server-express'

import { resolvers } from './Resolvers'
import { userSchema } from '@/graphql/User'
import { trainingGroupSchema } from '@/graphql/TrainingGroup'

export const schema = makeExecutableSchema({
   typeDefs: [userSchema, trainingGroupSchema],
   resolvers,
})
