import { redirect } from "next/navigation";

// Our craft is a section of the home page now. Kept as a route so older links,
// bookmarks and anything already indexed still land in the right place.
export default function StoryPage() {
  redirect("/#story");
}
