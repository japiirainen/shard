import { Monoid, concatAll } from 'fp-ts/lib/Monoid'

import { userResolvers } from '@/graphql/User'
import { trainingGroupResolvers } from '@/graphql/TrainingGroup'

export type Resolver = {
   Query: object
   Mutation: object
}

const ResolverSemiGroup: Monoid<Resolver> = {
   concat: (r1, r2) => ({
      ...r1,
      ...r2,
   }),
   empty: { Mutation: {}, Query: {} },
}

export const resolvers = concatAll(ResolverSemiGroup)([
   userResolvers,
   trainingGroupResolvers,
])
