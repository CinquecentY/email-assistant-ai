"use client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import React, { useEffect } from "react";

const EventsDataTable = () => {
  const {
    data: fetchedEvents,
    isLoading,
    error,
  } = api.data.getEvents.useQuery();
  const [events, setEvents] = React.useState<
    {
      Client: { name: string };
      name: string;
      description: string;
      startingAt: Date;
    }[]
  >([]);
  useEffect(() => {
    if (fetchedEvents) {
      setEvents(fetchedEvents);
    }
  }, [fetchedEvents]);
  return (
    <div className="flex flex-1 flex-col gap-2 bg-background p-4">
      <h1 className="text-lg font-bold">Events</h1>
      <Card className="max-h-96 overflow-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground">Error</div>
          </div>
        ) : (
          <>
            {events.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-muted-foreground">No data</div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Starting At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell>{event.Client.name}</TableCell>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>
                          {format(event.startingAt, "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default EventsDataTable;
