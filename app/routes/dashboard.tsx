import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/dashboard";
import { StatsGrid, Panel } from "~/components";
import { LineChart, BarChart } from "@mantine/charts";
import { SimpleGrid } from "@mantine/core";
import { authorize } from "~/utils/auth";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "Dashboard", content: "Nymbl Dashboard" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { role } = await authorize(request);

  if (!role) {
    return redirect("/auth/login");
  }

  return { role: role?.toString() };
}
1;

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <MyAppShell role={loaderData.role}>
      <StatsGrid />
      <SimpleGrid p="md" cols={{ base: 1, md: 2 }}>
        <Panel title="Line Chart">
          <LineChart
            h={300}
            dataKey="date"
            data={monthlySpending}
            lineProps={{ isAnimationActive: true }}
            withLegend
            tickLine="y"
            series={series}
            curveType="natural"
          />
        </Panel>
        <Panel title="Bar Chart">
          <BarChart
            h={300}
            data={monthlySpending}
            dataKey="date"
            withLegend
            series={series}
            tickLine="y"
            barProps={{ isAnimationActive: true }}
          />
        </Panel>
      </SimpleGrid>
    </MyAppShell>
  );
}

export const monthlySpending = [
  { date: "Jan", Microsoft: 1837.52, Apple: 1138.35, Amazon: 594.27 },
  { date: "Feb", Microsoft: 2052.01, Apple: 842.14, Amazon: 383.67 },
  { date: "Mar", Microsoft: 3646.41, Apple: 3940.18, Amazon: 872.86 },
  { date: "Apr", Microsoft: 1696.02, Apple: 2638.06, Amazon: 787.11 },
  { date: "May", Microsoft: 2576.3, Apple: 1476.82, Amazon: 508.48 },
  { date: "Jun", Microsoft: 1803.35, Apple: 2406.28, Amazon: 474.13 },
  { date: "Jul", Microsoft: 1510.89, Apple: 2220.96, Amazon: 812.83 },
  { date: "Aug", Microsoft: 2538.34, Apple: 1106.96, Amazon: 397.38 },
  { date: "Sep", Microsoft: 1577.03, Apple: 3079.96, Amazon: 818.48 },
];

export const series = [
  { name: "Microsoft", color: "red" },
  { name: "Apple", color: "blue" },
  { name: "Amazon", color: "yellow" },
];
