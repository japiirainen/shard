import { Id } from '@/infrastructure/Id'
import { DbUser } from './User'

export type Privacy = 'open' | 'private'

export type DbTrainingGroup = {
   id: Id<DbTrainingGroup>
   name: string
   owner: Id<DbUser>
   privacy: Privacy
   created_at: Date
   updated_at: Date
}

export type PublicTrainingGroup = Omit<DbTrainingGroup, 'created_at' | 'updated_at'>

export const toPublicTrainingGroup = (tg: DbTrainingGroup): PublicTrainingGroup => ({
   id: tg.id,
   name: tg.name,
   owner: tg.owner,
   privacy: tg.privacy,
})
