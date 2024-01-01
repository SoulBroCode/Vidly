import "express-async-errors";
import { createLogger, transports, format } from "winston";
//import "winston-mongodb";

const timestampFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    return JSON.stringify({
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
      metadata: info.metadata,
    });
  })
);

export function logUncaughtException() {
  createLogger({
    level: "error",
    format: timestampFormat,
    exceptionHandlers: [
      new transports.File({
        filename: "./logs/uncaughtExceptions.log",
      }),
      // new transports.MongoDB({
      //   db: "mongodb://localhost/vidly",
      //   collection: "uncaughtExceptions.log",
      //   level: "error",
      //   options: {
      //     useUnifiedTopology: true,
      //   },
      // }),
    ],
  });
}

export function logUnhandledRejection() {
  createLogger({
    level: "error",
    format: timestampFormat,
    rejectionHandlers: [
      new transports.File({
        filename: "./logs/unhandledRejection.log",
      }),
      // new transports.MongoDB({
      //   db: "mongodb://localhost/vidly",
      //   collection: "unhandledRejection.log",
      //   level: "error",
      //   options: {
      //     useUnifiedTopology: true,
      //   },
      // }),
    ],
  });
}

export default createLogger({
  level: "info",
  transports: [
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
      colorize: true,
      timestamp: false,
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      filename: "./logs/log.log",
      handleExceptions: true,
      handleRejections: true,
      format: timestampFormat,
    }),
    new transports.File({
      filename: "./logs/error.log",
      level: "error",
      format: timestampFormat,
    }),
    // new transports.MongoDB({
    //   db: "mongodb://localhost/vidly",
    //   collection: "error.log",
    //   level: "error",
    //   options: {
    //     useUnifiedTopology: true,
    //   },
    //   format: timestampFormat,
    // }),
  ],
});

// logger.exceptions.handle(
//   new transports.File({
//     filename: "./logs/uncaughtExceptions.log",
//     handleRejections: false,
//   }),
//   new transports.MongoDB({
//     db: "mongodb://localhost/vidly",
//     collection: "uncaughtExceptions.log",
//     level: "error",
//     options: {
//       useUnifiedTopology: true,
//     },
//   })
// );
