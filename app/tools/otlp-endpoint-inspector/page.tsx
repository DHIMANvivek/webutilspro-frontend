import OtlpEndpointInspector from '@/components/tools/OtlpEndpointInspector';

export const metadata = {
    title: 'OTLP Endpoint Inspector | WebUtilsPro',
    description: 'Capture and inspect OpenTelemetry OTLP HTTP exports with decoded spans, attributes, resources, and headers.',
};

export default function OtlpEndpointInspectorPage() {
    return <OtlpEndpointInspector />;
}
