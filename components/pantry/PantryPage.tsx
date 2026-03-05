import { ChatField } from "./ChatField";
import { PantryField } from "./PantryField";

export function PantryPage() {
  return (
    <div className="mx-auto flex w-full max-w-135 flex-col gap-4 p-4 pb-28 sm:p-6">
      <PantryField />
      <ChatField />
    </div>
  );
}
