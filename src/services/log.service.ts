import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {createLogger, format, Logger as wLogger, transports} from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

@bind({scope: BindingScope.SINGLETON})
export class LogService {
  private _logger: wLogger;

  get logger(): wLogger {
    return this._logger;
  }

  public constructor(/* Add @inject to inject parameters */) {
    const transportCombined = new transports.DailyRotateFile({
      filename: 'log-combined-%DATE%.log',
      dirname: './logs',
      level: 'info',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });

    const transportError = new transports.DailyRotateFile({
      filename: 'log-error-%DATE%.log',
      dirname: './logs',
      level: 'error',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });

    transportCombined.on('rotate', function (oldFilename, newFilename) {
      console.log(`FileRotated ${oldFilename} to ${newFilename}`);
      // do something fun
    });

    transportError.on('rotate', function (oldFilename, newFilename) {
      console.log(`FileRotated ${oldFilename} to ${newFilename}`);
      // do something fun
    });

    DailyRotateFile.toString();
    //console.log(DailyRotateFile.toString());

    this._logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: {
        service: 'user-service',
        timestamp: new Date().toLocaleString(),
      },
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        transportError,
        transportCombined,
      ],
    });

    this._logger.add(
      new transports.Console({
        format: format.simple(),
      }),
    );
  }
}
