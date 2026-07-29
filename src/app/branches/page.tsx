import { BranchesView } from './BranchesView';

/**
 * Nothing to fetch here: the branch list is already loaded by the root layout for
 * the nav and footer, and `BranchesView` reads it from that same context rather
 * than issuing a second identical query.
 */
export const revalidate = 3600;

export default function BranchesPage() {
  return <BranchesView />;
}
