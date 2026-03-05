import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PantryPage } from "@/components/pantry";

export default function PantryRoute() {
  return (
    <>
      <main>
        <PantryPage />
      </main>
      <BottomNavigation currentPage="pantry" />
    </>
  );
}
