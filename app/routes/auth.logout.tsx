import type { Route } from "./+types/auth.logout";
import { logout } from "session.server";

export async function loader({ request }: Route.LoaderArgs) {
  return await logout(request);
}
