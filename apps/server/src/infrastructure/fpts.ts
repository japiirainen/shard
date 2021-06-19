import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import { flow, pipe } from 'fp-ts/lib/function'

export type Maybe<T> = O.Option<T>

export { TE, E, A, NEA, flow, pipe, O as M }
