import { getUserId } from "session.server";
import type { Route } from "./+types/_index";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserId(request);
  if (user) {
    return redirect("/Dashboard");
  }

  return redirect("/auth/login");
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return;
}
