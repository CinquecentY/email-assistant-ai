import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAurinkoAuthorizationUrl } from "@/lib/aurinko";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitch({ isCollapsed }: AccountSwitcherProps) {
  const { data } = api.mail.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  return (
    <div
      className={cn("flex w-full items-center gap-2", isCollapsed && "h-full")}
    >
      {!data ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">No data</div>
        </div>
      ) : (
        <Select
          defaultValue={accountId}
          value={accountId}
          onValueChange={setAccountId}
        >
          <SelectTrigger
            className={cn(
              "flex w-full flex-1 items-center gap-2 bg-background/50 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
              isCollapsed &&
                "flex h-full w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
            )}
            aria-label="Select account"
          >
            <SelectValue
              className={cn(
                isCollapsed && "hover:bg-accent hover:text-accent-foreground",
              )}
              placeholder="Select an account"
              data-testid="account-switch"
            >
              <span
                className={cn({ hidden: !isCollapsed }, "font-bold uppercase")}
              >
                {data.find((account) => account.id === accountId)?.email[0]}
              </span>
              <span
                className={cn("ml-2", isCollapsed && "hidden")}
                data-testid="account-switch"
              >
                {data.find((account) => account.id === accountId)?.email}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {data.map((account) => (
              <SelectItem
                key={account.id}
                value={account.id}
                data-testid="account-item"
              >
                {account.email}
              </SelectItem>
            ))}
            <div
              onClick={async () => {
                try {
                  const url = await getAurinkoAuthorizationUrl("Google");
                  window.location.href = url;
                } catch (error) {
                  toast.error((error as Error).message);
                }
              }}
              className="relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-50 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Plus className="mr-1 size-4" />
              Add account
            </div>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
