"use client";
import React from "react";
import useThreads from "../use-threads";
import { format } from "date-fns";

function ThreadList() {
  const { threads, isFetching } = useThreads();

  const groupedThreads = threads?.reduce(
    (acc, thread) => {
      const date = format(thread.lastMessageDate ?? new Date(), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(thread);
      return acc;
    },
    {} as Record<string, typeof threads>,
  );
  return (
    <div className="max-h-[calc(100vh-120px)] max-w-full overflow-y-scroll">
      <div className="flex flex-col gap-2 p-4 pt-0" /*ref={parent}*/>
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => (
          <React.Fragment key={date}>
            <div className="mt-4 text-xs font-medium text-muted-foreground first:mt-0">
              {format(new Date(date), "MMMM d, yyyy")}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ThreadList;
