import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/$";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 - Page Not Found" },
    { name: "Page Not Found", content: "404 Error - Page Not Found!" },
  ];
}

export default function FourZeroFour() {
  return (
    <MyAppShell>
      <h1>404 Page Not Found</h1>
    </MyAppShell>
  );
}
