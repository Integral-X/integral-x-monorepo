/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

let sdk: NodeSDK | null = null;

export function initTracing(
  serviceName: string,
  jaegerHost: string,
  jaegerPort: number,
) {
  if (sdk) return; // Prevent double init

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
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
