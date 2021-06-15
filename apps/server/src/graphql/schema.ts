import gql from 'graphql-tag'

import { makeExecutableSchema } from 'apollo-server-express'

import { resolvers } from './resolvers'

const typeDefs = gql`
   type Query {
      info: String!
   }
`

export const schema = makeExecutableSchema({ typeDefs, resolvers })
