import { Request, Response, NextFunction } from "express";

import client from "prom-client";
const register = new client.Registry();

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Durata delle richieste HTTP in secondi",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5]
});

const httpRequestCount = new client.Counter({
  name: "http_requests_total",
  help: "Numero totale di richieste HTTP",
  labelNames: ["method", "route", "status_code"]
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestCount);
client.collectDefaultMetrics({ register });

 function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const route = req.route?.path || req.originalUrl || "unknown_route";
    httpRequestCount.inc({ method: req.method, route, status_code: res.statusCode });
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
}

 const getMetrics = async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};

export default { metricsMiddleware, getMetrics };