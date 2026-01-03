import { LeadDetailsClient } from "./LeadDetailsClient";

export async function generateStaticParams() {
    return [
        { id: 'L-101' }, { id: 'L-102' }, { id: 'L-103' },
        { id: 'L-105' }, { id: 'L-108' }, { id: 'L-110' }
    ];
}

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <LeadDetailsClient id={id} />;
}
