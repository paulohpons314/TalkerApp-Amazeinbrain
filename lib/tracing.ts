/**
 * OpenTelemetry Tracing Setup for TalkerApp
 * Instruments OpenAI SDK (Whisper) and Anthropic SDK (Claude)
 * Sends traces to AI Toolkit at http://localhost:4318
 * 
 * NOTA: Desabilitado temporariamente devido a incompatibilidade de versões.
 * Para reabilitar, atualize as dependências OpenTelemetry para versões compatíveis.
 */

// import { Resource } from "@opentelemetry/resources";
// import {
//   NodeTracerProvider,
//   SimpleSpanProcessor,
// } from "@opentelemetry/sdk-trace-node";
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
// import { registerInstrumentations } from "@opentelemetry/instrumentation";
// import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

let isTracingInitialized = false;

export function initTracing() {
  if (isTracingInitialized) {
    return; // Avoid double initialization
  }

  // Tracing desabilitado - remova os comentários abaixo para reabilitar
  // após corrigir as versões das dependências
  
  // const exporter = new OTLPTraceExporter({
  //   url: "http://localhost:4318/v1/traces",
  // });

  // const provider = new NodeTracerProvider({
  //   resource: new Resource({
  //     "service.name": "talker-app-web",
  //   }),
  //   spanProcessors: [new SimpleSpanProcessor(exporter)],
  // });

  // provider.register();

  // registerInstrumentations({
  //   instrumentations: [
  //     new OpenAIInstrumentation({
  //       // Capture request/response bodies for debugging
  //       traceContent: true,
  //     }),
  //   ],
  // });

  isTracingInitialized = true;
  console.log("⚠️  OpenTelemetry tracing desabilitado (versões incompatíveis)");
}
