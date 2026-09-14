import { permanentRedirect } from "next/navigation";

// The menu is the landing page now. This route stays so anything already
// pointing at /menu still arrives somewhere sensible.
export default function MenuRedirect() {
  permanentRedirect("/");
}
