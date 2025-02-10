import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "Dashboard", content: "Nymbl Dashboard" },
  ];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <MyAppShell>Dashboard</MyAppShell>;
}
