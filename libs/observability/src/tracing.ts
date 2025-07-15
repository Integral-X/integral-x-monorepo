import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

let sdk: NodeSDK | null = null;

export function initTracing() {
  if (sdk) return; // Prevent double init
  const serviceName = process.env.OTEL_SERVICE_NAME || 'integral-x-api-gateway';
  const jaegerHost = process.env.JAEGER_HOST || 'localhost';
  const jaegerPort = process.env.JAEGER_PORT || 6832;

  sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    traceExporter: new JaegerExporter({
      host: jaegerHost,
      port: jaegerPort,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });
  sdk.start();
} 