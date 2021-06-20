import { Monoid, concatAll } from 'fp-ts/lib/Monoid'

import { userResolvers } from '@/graphql/User'
import { trainingGroupResolvers } from '@/graphql/TrainingGroup'

export type Resolver = {
   Query: object
   Mutation: object
}

const ResolverSemiGroup: Monoid<Resolver> = {
   concat: (r1, r2) => ({
      Query: {
         ...r1.Query,
         ...r2.Query,
      },
      Mutation: {
         ...r1.Mutation,
         ...r2.Mutation,
      },
   }),
   empty: { Mutation: {}, Query: {} },
}

export const resolvers = concatAll(ResolverSemiGroup)([
   userResolvers,
   trainingGroupResolvers,
])
