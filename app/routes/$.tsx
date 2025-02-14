import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/$";
import { redirect } from "react-router";
import { authorize } from "~/utils/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 - Page Not Found" },
    { name: "Page Not Found", content: "404 Error - Page Not Found!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { role } = await authorize(request);

  if (!role) {
    return redirect("/auth/login");
  }
  return {
    role: role?.toString(),
  };
}

export default function FourZeroFour({ loaderData }: Route.ComponentProps) {
  return (
    <MyAppShell role={loaderData.role}>
      <h1>404 Page Not Found</h1>
    </MyAppShell>
  );
}
