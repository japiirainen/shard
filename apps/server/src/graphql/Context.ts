import { Response, Request } from 'express'
import { Pool } from 'pg'
import { Logger } from 'pino'

export type MyContext = {
   req: Request
   res: Response
   repo: Pool
   logger: Logger
}
