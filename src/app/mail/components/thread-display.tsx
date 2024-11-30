import React from "react";
import { useThread } from "../use-thread";
import useThreads from "../use-threads";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Archive,
  ArchiveX,
  Calendar,
  ChevronLeft,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addHours, addDays, nextSaturday, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmailDisplay from "./email-display";
import ReplyBox from "./reply-box";
import { useAtom } from "jotai";
import { isSearchingAtom } from "./search-bar";
import SearchDisplay from "./search-display";
import { cn } from "@/lib/utils";

function ThreadDisplay() {
  const [threadId, setThreadId] = useThread();
  const { threads, isFetching } = useThreads();

  const _thread = threads?.find((t) => t.id === threadId);

  const [accountId] = useLocalStorage("accountId", "");

  const { data: foundThread } = api.mail.getThreadById.useQuery(
    {
      accountId: accountId,
      threadId: threadId ?? "",
    },
    { enabled: !!!_thread && !!threadId },
  );
  const thread = _thread ?? foundThread;

  const today = new Date();

  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex min-h-11 items-center p-2">
        <Button className={"h-7 md:hidden"} variant={"secondary"}>
          <ChevronLeft />
        </Button>
      </div>
      <Separator />
      {isSearching ? (
        <SearchDisplay />
      ) : (
        <>
          {thread ? (
            <div className="flex h-full max-h-full flex-col overflow-auto bg-background">
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <Avatar>
                    <AvatarImage alt={"avatarImage"} />
                    <AvatarFallback>
                      {thread?.emails[0]?.from?.name
                        ?.split(" ")
                        .map((chunk) => chunk[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">
                      {thread.emails[0]?.from?.name}
                    </div>
                    <div className="line-clamp-1 text-xs">
                      {thread.emails[0]?.subject}
                    </div>
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Reply-To:</span>{" "}
                      {thread.emails[0]?.from?.address}
                    </div>
                  </div>
                </div>
                {thread.emails[0]?.sentAt && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(thread.emails[0].sentAt), "PPpp")}
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex flex-col overflow-auto">
                <div className="flex flex-col gap-4 p-6">
                  {thread.emails.map((email) => {
                    return <EmailDisplay key={email.id} email={email} />;
                  })}
                </div>
              </div>
              <Separator />
              <ReplyBox />
            </div>
          ) : (
            <>
              <div className="flex-1 bg-background p-8 text-center text-muted-foreground">
                No message selected {threadId}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ThreadDisplay;
