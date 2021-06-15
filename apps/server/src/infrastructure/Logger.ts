import pino from 'pino'
import httpPino from 'pino-http'

export const logger = pino({ prettyPrint: true })
export const httpLogger = httpPino({ prettyPrint: true })
