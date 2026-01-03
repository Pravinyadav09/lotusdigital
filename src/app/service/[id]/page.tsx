import { ServiceTicketClient } from "./ServiceTicketClient";

export async function generateStaticParams() {
    return [{ id: 'SR-501' }, { id: 'SR-502' }];
}

export default async function ServiceTicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ServiceTicketClient id={id} />;
}
