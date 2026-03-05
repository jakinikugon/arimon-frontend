import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PantryPage } from "@/components/pantry";

export default function PantryRoute() {
  return (
    <>
      <main className="pb-24">
        <PantryPage />
      </main>
      <BottomNavigation currentPage="pantry" />
    </>
  );
}
