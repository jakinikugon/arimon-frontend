import type { UserName } from "@/types/domain";

interface AccountFieldProps {
  userName: UserName | null;
}

export function AccountField({ userName }: AccountFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">
        {userName ?? "名無し"} さん
      </span>
    </div>
  );
}
