import { CustomError } from 'ts-custom-error'
import { v4 as uuid } from 'uuid'

import { logger } from '@/infrastructure/Logger'

export interface ApplicationError extends Error {
   /** What HTTP status code to respond with */
   status: number
   /**
    * Error code to return in the response,
    * used to conceal implementation details (error messages, stack traces)
    * while still providing a code that can be traced to specific logs
    * */
   code: string
   /** Whether the error should be logged, true for unexpected errors, false for bussiness logic errors */
   log: boolean
}

export const processError = (err: ApplicationError): ApplicationError => {
   if (!err.code && !err.status) {
      err = new UnexpectedError(err.message)
   }
   if (err.log) {
      logger.error(err)
   }
   return err
}

class UnexpectedError extends CustomError implements ApplicationError {
   status = 500
   code = uuid()
   log = true
}

export class InvalidRequest extends CustomError implements ApplicationError {
   status = 500
   code = 'InvalidRequest'
   log = false
}

export class ValidationFailed extends CustomError implements ApplicationError {
   status = 500
   code = 'ValidationFailed'
   log = false
}
