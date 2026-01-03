import { QuoteDetailsClient } from "./QuoteDetailsClient";

export async function generateStaticParams() {
    return [{ id: 'Q-2024-001' }, { id: 'Q-2024-089' }];
}

export default async function QuoteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <QuoteDetailsClient id={id} />;
}
