import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { BuyerProfile } from "@/components/me/BuyerProfile";

export default function MePage() {
  return (
    <>
      <main className="pb-24">
        <BuyerProfile />
      </main>
      <BottomNavigation currentPage="profile" />
    </>
  );
}
