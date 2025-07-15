import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'integral-x' },
  transports: [
    new transports.Console(),
  ],
});

export function logInfo(message: string, meta?: any) {
  logger.info(message, meta);
}

export function logError(message: string, meta?: any) {
  logger.error(message, meta);
} 