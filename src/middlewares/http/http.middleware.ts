import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { blue, blueBright, green, red, cyan, yellow } from 'chalk';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = uuidv4();
    const now = new Date();
    now.toLocaleTimeString();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    const { method, path } = req;
    const start = process.hrtime();
    const idText = blue(`[${id}]`);
    const timeStampText = cyan(`[${timestamp}]`);
    console.log(`${yellow("[HTTP]")} ${green("↘️")} ${idText} ${timeStampText} ${yellow(method)} ${blueBright(path)}`);

    res.once('finish', () => {
      const end = process.hrtime(start);
      const endText = blue(`${getProcessingTimeInMS(end)}`);
      const statusCode = res.statusCode == 200 ? green(`${res.statusCode}`) : red(`${res.statusCode}`);
      console.log(`${yellow("[HTTP]")} ${green("↗️")} ${idText} ${timeStampText} ${yellow(method)} ${blueBright(path)} ${statusCode} ${endText}`);
    });
    const oldJSON = res.json;
    res.json = (data) => {
      var ip = (req.headers['x-forwarded-for'] || req.ip) as String;
      if (ip.substring(0, 7) == "::ffff:") {
        ip = ip.toString().replace('::ffff:', '');
      }
      res.json = oldJSON;
      data._request = { id: id, api_version: "v1", endpoint: path, type: method, ip: ip };
      return oldJSON.call(res, data);
    };
    next();
  }
}

const getProcessingTimeInMS = (time: [number, number]): string => {
  const duration = (time[0] * 1000 + time[1] / 1e6) / 1000;
  return `${duration.toFixed(2)}${duration >= 1 ? 's' : 'ms'}`;
}

