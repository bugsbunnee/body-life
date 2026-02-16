import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSS' }),
      winston.format.printf((info) => `[${info.timestamp}]:[${info.level}]:[${info.message}]`)
   ),
   defaultMeta: { service: 'ecommerce-log-service' },
   handleExceptions: true,
   transports: [],
});

if (process.env.NODE_ENV === 'vps') {
   const rotateTransport = new winston.transports.DailyRotateFile({
      level: 'info',
      filename: 'src/logs/dulux-ecommerce-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
   });

   logger.add(rotateTransport);
} else {
   const consoleTransport = new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.json()),
   });

   logger.add(consoleTransport);
}

process.on('unhandledRejection', (ex) => {
   throw ex;
});

export default logger;
