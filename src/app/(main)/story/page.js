import { StoryBlock } from "../_features/story-block";

export const metadata = { title: "Our craft" };

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <StoryBlock />
    </div>
  );
}
