/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import client from "prom-client";

// Only collect default metrics once to avoid registration conflicts
if (!client.register.getSingleMetric("process_cpu_user_seconds_total")) {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();
}

export const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

export function getMetrics(): Promise<string> {
  return client.register.metrics();
}
