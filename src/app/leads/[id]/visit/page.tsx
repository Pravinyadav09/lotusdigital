import { VisitPlanningClient } from "./VisitPlanningClient";

export async function generateStaticParams() {
    return [{ id: 'L-101' }, { id: 'L-102' }];
}

export default function VisitPlanningPage({ params }: { params: { id: string } }) {
    return <VisitPlanningClient id={params.id} />;
}
