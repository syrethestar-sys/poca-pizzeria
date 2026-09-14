import { VisitDetails } from "../_features/visit-details";

export const metadata = { title: "Visit" };

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <VisitDetails />
    </div>
  );
}
