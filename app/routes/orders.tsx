import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/orders";
import database from "~/postgrest/database";
import { orderFields, type IOrder } from "~/models";
import { Grid } from "@mantine/core";
import { Panel, MyGrid } from "~/components";
import { handleCRUD } from "~/utils/crud";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Orders" }, { name: "Orders", content: "Nymbl Orders" }];
}

export async function loader() {
  return { orders: await database.findAll("order") };
}

export async function action({ request }: Route.ActionArgs) {
  return await handleCRUD(request, orderFields, "order");
}

export default function Orders({ loaderData }: Route.ComponentProps) {
  return (
    <MyAppShell>
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
