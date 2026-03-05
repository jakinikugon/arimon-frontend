import { ItemsPanel } from "@/components/item_view/ItemsPanel";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function ItemsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-2 max-w-4xl">
        <ItemsPanel />
      </div>
      <BottomNavigation currentPage="items" />
    </div>
  );
}
