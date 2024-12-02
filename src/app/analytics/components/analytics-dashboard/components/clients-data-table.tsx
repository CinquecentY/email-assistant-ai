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
import React from "react";

const clients = [
  {
    name: "Julian from TechCorp Solutions",
    email: "contact@techcorp.com",
    phoneNumber: "+1-555-0123",
    city: "New York",
    status: "client",
  },
  {
    name: "Sun from AI Research Lab",
    email: "sun@ailab.jp",
    phoneNumber: "+81-3-1234-5678",
    city: "Tokyo",
    status: "client",
  },
  {
    name: "Mark from Green Energy Ltd",
    email: "mark@greenenergy.co.uk",
    phoneNumber: "+44-20-7123-4567",
    city: "London",
    status: "lead",
  },
  {
    name: "Denk from SmartHome Systems",
    email: "denking@smarthome.de",
    phoneNumber: "+49-303-123456",
    city: "Berlin",
    status: "lead",
  },
  {
    name: "Baptiste from Digital Marketing Pro",
    email: "hello@digipro.fr",
    phoneNumber: "+33-1-2345-6789",
    city: "Paris",
    status: "client",
  },
  {
    name: "Clara from Cloud Services Inc",
    email: "clara@cloudserv.com",
    phoneNumber: "+1-555-9876",
    city: "San Francisco",
    status: "not interested",
  },
  {
    name: "Juli from Data Analytics Ltd",
    email: "ju@datalytics.ca",
    phoneNumber: "+1-416-555-0190",
    city: "Toronto",
    status: "client",
  },
  {
    name: "Santiago from Mobile Apps Co",
    email: "jsantiago@mobileapps.es",
    phoneNumber: "+34-91-234-5678",
    city: "Madrid",
    status: "client",
  },
  {
    name: "Chris from Security Solutions",
    email: "chris.f@securesol.com",
    phoneNumber: "+1-555-4567",
    city: "Chicago",
    status: "lead",
  },
  {
    name: "Enzo from Web Design Studio",
    email: "enzo3@webdesign.it",
    phoneNumber: "+39-02-1234567",
    city: "Milan",
    status: "lead",
  },
];

const ClientsDataTable = () => {
  return (
    <div className="flex flex-1 flex-col gap-2 bg-background p-4">
      <h1 className="text-lg font-bold">Clients</h1>
      <Card className="max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow key={index}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>{client.city}</TableCell>
                <TableCell>{client.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ClientsDataTable;
