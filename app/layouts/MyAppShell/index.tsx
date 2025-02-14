import {
  AppShell,
  Flex,
  Stack,
  Group,
  Image,
  ActionIcon,
  Burger,
} from "@mantine/core";
import Navbar from "./Navbar";
import { links, footerLinks } from "./Navbar/links";
import classes from "./MyAppShell.module.css";
import Configuration from "./Configuration";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import logo from "~/assets/img/logo.png";

interface IMyAppShell {
  children: React.ReactNode;
  role?: string;
}

export default function MyAppShell({ children, role }: IMyAppShell) {
  const [opened, { toggle }] = useDisclosure();
  const [nav, { toggle: toggleNav }] = useDisclosure();

  const isTablet = useMediaQuery("(max-width: 48em)");

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{
        width: nav ? 50 : 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header className={classes.header}>
        <Flex justify="space-between" h="100%" pl="md" pr="md">
          <Stack justify="center">
            <Group>
              <Image src={logo} w={75} />
              {!isTablet && (
                <ActionIcon
                  onClick={toggleNav}
                  className={classes.navbarToggle}
                  variant="transparent"
                  color="gray"
                  size={30}
                >
                  {nav ? <IconChevronRight /> : <IconChevronLeft />}
                </ActionIcon>
              )}
            </Group>
          </Stack>
          <Stack justify="center">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            {!isTablet && role === "admin" && <Configuration />}
          </Stack>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbar}>
        <AppShell.Section grow>
          <Navbar links={links} />
        </AppShell.Section>
        <AppShell.Section>
          <Navbar links={footerLinks} />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
