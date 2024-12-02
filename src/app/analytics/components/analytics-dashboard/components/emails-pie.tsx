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
import React from "react";
import { Pie, Label, PieChart } from "recharts";

const chartData = [
  { name: "LinkedIn", emails: 12, fill: "var(--color-first)" },
  { name: "Proton", emails: 10, fill: "var(--color-second)" },
  { name: "Google", emails: 9, fill: "var(--color-third)" },
  { name: "Yassine Annagrebah", emails: 8, fill: "var(--color-fourth)" },
  { name: "Braintrust", emails: 6, fill: "var(--color-fifth)" },
];

const chartConfig = {
  names: {
    label: "Names",
  },
  first: {
    label: "LinkedIn",
    color: "hsl(var(--chart-1))",
  },
  second: {
    label: "Proton",
    color: "hsl(var(--chart-2))",
  },
  third: {
    label: "Google",
    color: "hsl(var(--chart-3))",
  },
  fourth: {
    label: "Yassine Annagrebah",
    color: "hsl(var(--chart-4))",
  },
  fifth: {
    label: "Braintrust",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const EmailsPie = () => {
  return (
    <Card className="flex flex-1 flex-col">
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
                          46
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
    </Card>
  );
};

export default EmailsPie;
