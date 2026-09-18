import { redirect } from "next/navigation";

// Visit is a section of the home page now. Kept as a route so older links,
// bookmarks and anything already indexed still land in the right place.
export default function VisitPage() {
  redirect("/#visit");
}
