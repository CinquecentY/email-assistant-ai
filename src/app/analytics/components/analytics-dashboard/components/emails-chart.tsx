import useThreads from "@/app/mail/use-threads";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";

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
  const { threads, isFetching, error } = useThreads();
  const [chartData, setChartData] = React.useState<
    { date: string; emails: number }[]
  >([]);
  useEffect(() => {
    if (threads) {
      const emails = threads.reduce(
        (acc, thread) => {
          const date = new Date(
            thread.emails.at(-1)?.sentAt ?? new Date(),
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const existingDate = acc.find((item) => item.date === date);
          if (existingDate) {
            existingDate.emails++;
          } else {
            acc.push({ date, emails: 1 });
          }
          return acc;
        },
        [] as { date: string; emails: number }[],
      );
      setChartData(emails);
    }
  }, [threads]);
  return (
    <Card className="flex-1">
      {isFetching ? (
        <div className="flex h-full flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">Error</div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">No data</div>
        </div>
      ) : (
        <>
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
                    const date = new Date(value as string);
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
                        return new Date(value as string).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        );
                      }}
                    />
                  }
                />
                <Bar dataKey="emails" fill={`var(--color-emails)`} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default EmailsChart;
