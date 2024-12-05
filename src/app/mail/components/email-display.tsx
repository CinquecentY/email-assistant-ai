"use client";

import { cn } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import useThreads from "../use-threads";
import Avatar from "react-avatar";
import { Letter } from "react-letter";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  email: RouterOutputs["mail"]["getThreads"][number]["emails"][number];
};

const EmailDisplay = ({ email }: Props) => {
  const { account } = useThreads();
  const letterRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (letterRef.current) {
      const gmailQuote = letterRef.current.querySelector(
        'div[class*="_gmail_quote"]',
      );
      if (gmailQuote) {
        gmailQuote.innerHTML = "";
      }
    }
  }, [email]);

  const isMe = account?.email === email.from.address;

  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full cursor-pointer rounded-md border p-2 transition-all hover:translate-x-2 md:p-4",
        {
          "border-l-4 border-l-gray-900": isMe,
        },
      )}
      ref={letterRef}
    >
      <div className="mb-4 flex w-full items-center justify-between gap-2">
        <span className="inline-flex max-w-[55%] gap-2">
          <Avatar
            name={email.from.name ?? email.from.address}
            email={email.from.address}
            size={"35"}
            textSizeRatio={2}
            round={true}
          />
          <span className="max-w-full">
            <div className="truncate font-medium">
              {isMe ? "Me" : email.from.name}
            </div>
            <div className="truncate font-medium">{email.from.address}</div>
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(email.sentAt ?? new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <Separator />
      <section className="w-full overflow-auto">
        <Letter
          data-testid="letter"
          className="rounded-md bg-white p-2 text-black"
          html={email?.body ?? ""}
        />
      </section>
    </div>
  );
};

export default EmailDisplay;
