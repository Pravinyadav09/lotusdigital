import { ServiceTicketClient } from "./ServiceTicketClient";

export async function generateStaticParams() {
    return [{ id: 'SR-501' }, { id: 'SR-502' }];
}

export default function ServiceTicketPage({ params }: { params: { id: string } }) {
    return <ServiceTicketClient id={params.id} />;
}
