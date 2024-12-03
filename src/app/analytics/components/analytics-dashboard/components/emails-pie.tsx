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
import React, { useEffect, useState } from "react";
import { Pie, Label, PieChart } from "recharts";

const EmailsPie = () => {
  const { threads, isFetching } = useThreads();
  const [chartData, setChartData] = useState<
    { name: string; emails: number; fill: string }[]
  >([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    names: { label: "Names" },
  });
  useEffect(() => {
    if (threads) {
      const emails = threads
        .flatMap((thread) => thread.emails)
        .map((email) => email.from.name)
        .reduce(
          (acc, name) => {
            acc[name!] = (acc[name!] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
      const topFive = Object.entries(emails)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      let level = 1;
      const data = topFive.map(([name, emails]) => {
        return {
          name,
          emails,
          fill: `hsl(var(--chart-${level++}))`,
        };
      });
      setChartData(data);
      //@ts-expect-error
      setChartConfig((prevConfig) => ({
        ...prevConfig,
        names: {
          ...prevConfig.names,
          dataKey: "name",
        } satisfies ChartConfig,
      }));
    }
  }, [threads]);
  return (
    <Card className="flex flex-1 flex-col">
      {chartData.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">No data</div>
        </div>
      ) : (
        <>
          <CardHeader className="items-center pb-0">
            <CardTitle>Most Prominent Senders</CardTitle>
            <CardDescription>
              Top five most email addresses received
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="emails"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold dark:fill-white/95"
                            >
                              {threads?.length}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Emails
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default EmailsPie;
