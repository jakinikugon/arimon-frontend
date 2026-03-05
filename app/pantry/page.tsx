import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PantryPage } from "@/components/pantry";

export default function PantryRoute() {
  return (
    <>
      <PantryPage />
      <BottomNavigation currentPage="pantry" />
    </>
  );
}
