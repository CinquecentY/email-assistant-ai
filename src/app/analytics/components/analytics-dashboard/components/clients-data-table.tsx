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
import React, { useEffect } from "react";

const ClientsDataTable = () => {
  const [clients, setClients] = React.useState<
    {
      name: string;
      email: string;
      phoneNumber: string;
      city: string;
      status: string;
    }[]
  >([]);
  const {
    data: fetchedClients,
    isLoading,
    error,
  } = api.data.getClients.useQuery();
  useEffect(() => {
    if (fetchedClients) {
      setClients(fetchedClients);
    }
  }, [fetchedClients, setClients]);
  return (
    <div className="flex flex-1 flex-col gap-2 bg-background p-4">
      <h1 className="text-lg font-bold">Clients</h1>
      <Card className="max-h-96 overflow-auto">
        {clients.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground">No data</div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </Card>
    </div>
  );
};

export default ClientsDataTable;
