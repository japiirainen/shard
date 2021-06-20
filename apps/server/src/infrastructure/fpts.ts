import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import { flow, pipe } from 'fp-ts/lib/function'
import { trace, traceWithValue } from 'fp-ts-std/Debug'

import { doTE, withDebug, withDebugValue } from '@/infrastructure/Helpers'

export type Maybe<T> = O.Option<T>

export {
   TE,
   E,
   A,
   NEA,
   flow,
   pipe,
   O as M,
   trace,
   traceWithValue,
   doTE,
   withDebug,
   withDebugValue,
}
