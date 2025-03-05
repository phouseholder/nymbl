import MyAppShell from "~/layouts/MyAppShell";
import type { Route } from "./+types/$";
import { redirect } from "react-router";
import { authorize } from "~/utils/auth";
import { Grid, Title, Text, Button, Center, Stack } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { Panel } from "~/components";

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
      <Grid p="md">
        <Grid.Col>
          <Panel title="404 - Page Not Found">
            <Center>
              <Stack align="center" gap="lg">
                <Title order={2}>Oops! This page doesn't exist.</Title>
                <Text size="lg">
                  The page you're looking for could not be found.
                </Text>
                <Button
                  component="a"
                  href="/"
                  variant="light"
                  color="blue"
                  leftSection={<IconHome size={16} />}
                >
                  Return Home
                </Button>
              </Stack>
            </Center>
          </Panel>
        </Grid.Col>
      </Grid>
    </MyAppShell>
  );
}
