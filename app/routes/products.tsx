import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/products";
import database from "~/postgrest/database";
import { productFields } from "~/models";
import { Grid } from "@mantine/core";
import { Panel, MyGrid } from "~/components";
import { handleCRUD } from "~/utils/crud";
import { authorize } from "~/utils/auth";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Products" },
    { name: "Products", content: "Nymbl Products" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { role } = await authorize(request);

  if (!role) {
    return redirect("/auth/login");
  }
  return {
    role: role?.toString(),
    products: await database.findAll("product"),
  };
}

export async function action({ request }: Route.ActionArgs) {
  return await handleCRUD(request, productFields, "product");
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return (
    <MyAppShell role={loaderData.role}>
      <Grid p="md">
        <Grid.Col>
          <Panel title="Products">
            <MyGrid fields={productFields} rowData={loaderData.products} />
          </Panel>
        </Grid.Col>
      </Grid>
    </MyAppShell>
  );
}
