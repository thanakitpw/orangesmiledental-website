import { getServices } from '@/lib/site-content';
import { ServicesView } from './ServicesView';

export const revalidate = 3600;

export default async function ServicesPage() {
  const { page, perks, serviceSteps } = await getServices();
  return <ServicesView services={page} perks={perks} steps={serviceSteps} />;
}
