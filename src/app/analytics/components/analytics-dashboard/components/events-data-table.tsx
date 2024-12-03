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
import { format } from "date-fns";
import React from "react";

const events = [
  {
    clientId: 1,
    name: "Remote Meeting",
    description: "Initial meeting to discuss project scope",
    date: "2024-12-24T09:00:00.000Z",
  },
  {
    clientId: 10,
    name: "Remote Meeting",
    description: "Discussion of AI implementation",
    date: "2025-03-27T15:00:00.000Z",
  },
  {
    clientId: 2,
    name: "Physical Meeting",
    description: "Review of technical specifications",
    date: "2024-12-04T14:00:00.000Z",
  },
  {
    clientId: 3,
    name: "Call",
    description: "Review of contract terms",
    date: "2025-01-06T10:00:00.000Z",
  },
  {
    clientId: 4,
    name: "Remote Meeting",
    description: "Product demonstration",
    date: "2024-12-02T15:00:00.000Z",
  },
  {
    clientId: 5,
    name: "Call",
    description: "Marketing strategy discussion",
    date: "2024-12-08T11:00:00.000Z",
  },
  {
    clientId: 6,
    name: "Physical Meeting",
    description: "Quarterly service review",
    date: "2025-02-06T13:00:00.000Z",
  },
  {
    clientId: 7,
    name: "Call",
    description: "Project scope discussion",
    date: "2024-12-04T09:30:00.000Z",
  },
  {
    clientId: 8,
    name: "Physical Meeting",
    description: "Mobile app design review",
    date: "2024-12-01T14:30:00.000Z",
  },
  {
    clientId: 9,
    name: "Remote Meeting",
    description: "Website redesign planning",
    date: "2025-01-12T10:00:00.000Z",
  },
];

const EventsDataTable = () => {
  return (
    <div className="flex flex-1 flex-col gap-2 bg-background p-4">
      <h1 className="text-lg font-bold">Events</h1>
      <Card className="max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={index}>
                <TableCell>{event.clientId}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{format(event.date, "Pp")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default EventsDataTable;
