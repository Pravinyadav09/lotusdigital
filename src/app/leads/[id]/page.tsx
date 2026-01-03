import { LeadDetailsClient } from "./LeadDetailsClient";

export async function generateStaticParams() {
    return [{ id: 'L-101' }, { id: 'L-102' }];
}

export default function LeadDetailsPage({ params }: { params: { id: string } }) {
    return <LeadDetailsClient id={params.id} />;
}
