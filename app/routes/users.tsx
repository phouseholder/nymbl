import type { Route } from "./+types/users";
import database from "~/postgrest/database";
import { userFields, type IUser } from "~/models";
import { handleCRUD } from "~/utils/crud";
import { authorize } from "~/utils/auth";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Users" }, { name: "Users", content: "Nymbl Users" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { role } = await authorize(request);

  if (!role) {
    return redirect("/auth/login");
  }
  return {
    role: role?.toString(),
    orders: await database.findAll("user"),
  };
}

export async function action({ request }: Route.ActionArgs) {
  return await handleCRUD(request, userFields, "user");
}
