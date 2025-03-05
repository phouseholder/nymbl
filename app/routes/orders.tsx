import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/orders";
import database from "~/postgrest/database";
import { orderFields, type IOrder } from "~/models";
import { Grid } from "@mantine/core";
import { Panel, MyGrid } from "~/components";
import { handleCRUD } from "~/utils/crud";
import { authorize } from "~/utils/auth";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Orders" }, { name: "Orders", content: "Nymbl Orders" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { role } = await authorize(request);

  if (!role) {
    return redirect("/auth/login");
  }
  return {
    role: role?.toString(),
    orders: await database.findAll("order", undefined, orderFields),
  };
}

export async function action({ request }: Route.ActionArgs) {
  return await handleCRUD(request, orderFields, "order");
}

export default function Orders({ loaderData }: Route.ComponentProps) {
  return (
    <MyAppShell role={loaderData.role}>
      <Grid p="md">
        <Grid.Col>
          <Panel title="Orders">
            <MyGrid fields={orderFields} rowData={loaderData.orders} />
          </Panel>
        </Grid.Col>
      </Grid>
    </MyAppShell>
  );
}
