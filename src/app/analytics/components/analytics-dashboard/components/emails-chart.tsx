import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";

const chartData = [
  { date: "2024-11-28", emails: 10 },
  { date: "2024-11-29", emails: 8 },
  { date: "2024-11-30", emails: 6 },
  { date: "2024-12-01", emails: 5 },
  { date: "2024-12-02", emails: 5 },
];
const chartConfig = {
  views: {
    label: "Page Views",
  },
  emails: {
    label: "emails",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const EmailsChart = () => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Emails Received</CardTitle>
          <CardDescription>
            Showing total emails received for the last 5 days
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="emails" fill={`var(--color-emails)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EmailsChart;
