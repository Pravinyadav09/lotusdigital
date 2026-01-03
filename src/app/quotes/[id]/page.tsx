import { QuoteDetailsClient } from "./QuoteDetailsClient";

export async function generateStaticParams() {
    return [{ id: 'Q-2024-001' }, { id: 'Q-2024-089' }];
}

export default function QuoteDetailsPage({ params }: { params: { id: string } }) {
    return <QuoteDetailsClient id={params.id} />;
}
