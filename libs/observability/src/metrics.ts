import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export function getMetrics(): Promise<string> {
  return client.register.metrics();
} 