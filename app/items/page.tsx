import { ItemsPanel } from "@/components/item_view/ItemsPanel";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function ItemsPage() {
  return (
    <>
      <main className="mx-2 max-w-4xl pb-24">
        <ItemsPanel />
      </main>
      <BottomNavigation currentPage="items" />
    </>
  );
}
