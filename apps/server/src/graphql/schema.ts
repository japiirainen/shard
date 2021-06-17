import { makeExecutableSchema } from 'apollo-server-express'

import { resolvers } from './Resolvers'
import { userSchema } from './User'

export const schema = makeExecutableSchema({
   typeDefs: [userSchema],
   resolvers,
})
