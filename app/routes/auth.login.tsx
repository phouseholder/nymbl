import { createUserSession, getUserId } from "session.server";
import { Form, redirect } from "react-router";
import type { Route } from "./+types/auth.login";
import {
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Paper,
  Group,
  Flex,
  Stack,
  Image,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import logo from "~/assets/img/logo.png";
import { useDisclosure } from "@mantine/hooks";
import { MyModal, MyForm } from "~/components";
import database from "~/postgrest/database";
import { checkPassword } from "~/utils/auth";
import { userFields } from "~/models";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
}

export async function action({ request }: Route.ActionArgs) {
  let response: Response;

  try {
    const formData = await request.formData();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!username) {
      throw new Error("Username is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    if (typeof password !== "string") {
      throw new Error("Invalid password");
    }

    const user = await database.findOne("user", { username });
    if (!user) {
      throw new Error("Invalid username");
    }

    if (!user.password) {
      throw new Error("Invalid password");
    }

    // Check the user's password
    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Create a session
    response = await createUserSession({
      request,
      userId: user.username,
      remember: true,
    });

    if (!response) {
      throw new Error("An error occurred while creating the session");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }

  return response;
}

export default function Auth({ actionData }: Route.ComponentProps) {
  const [opened, { open, close }] = useDisclosure();

  const errorIcon = <IconInfoCircle />;

  return (
    <Flex justify="center" h={"100vh"}>
      <Stack justify="center">
        <Group justify="center">
          <Image src={logo} w={200} />
        </Group>
        <Paper withBorder p="md" radius="md" w={500}>
          {actionData?.error && (
            <Alert
              mb="md"
              variant="light"
              color="red"
              title="ERROR"
              icon={errorIcon}
            >
              {actionData.error}
            </Alert>
          )}
          <Form method="POST">
            <TextInput
              name="username"
              label="Username"
              placeholder="Username"
              required
            />
            <PasswordInput
              mt="md"
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              required
            />
            <Group justify="justify-between" grow>
              <Button mt="md" variant="subtle" onClick={open}>
                Need an Account?
              </Button>
              <Button mt="md" type="submit">
                Log In
              </Button>
            </Group>
          </Form>
        </Paper>
      </Stack>
      <MyModal title="Create Title" opened={opened} close={close}>
        <MyForm
          fields={userFields}
          method="POST"
          onSubmit={close}
          onCancel={close}
          color="green"
          submitText="Create"
          action="/Users"
        />
      </MyModal>
    </Flex>
  );
}
