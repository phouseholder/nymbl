import MyAppShell from "~/layouts/MyAppShell";
import database from "~/postgrest/database";
import type { Route } from "./+types/customers";
import { customerFields, type ICustomer } from "~/models";
import { MyGrid, Panel } from "~/components";
import { Grid } from "@mantine/core";
import { handleCRUD } from "~/utils/crud";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customers" },
    { name: "Customers", content: "Nymbl Customers" },
  ];
}

export async function loader() {
  return { customers: await database.findAll("customer") };
}

export async function action({ request }: Route.ActionArgs) {
  return await handleCRUD(request, customerFields, "customer");
}

export default function Customers({ loaderData }: Route.ComponentProps) {
  return (
    <MyAppShell>
      <Grid p="md">
        <Grid.Col>
          <Panel title="Customers">
            <MyGrid fields={customerFields} rowData={loaderData.customers} />
          </Panel>
        </Grid.Col>
      </Grid>
    </MyAppShell>
  );
}
