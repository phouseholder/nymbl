import { NavLink } from "@mantine/core";
import type { ILink } from "./links";
import classes from "./Nvbar.module.css";
import { useLocation } from "react-router";

interface INavbar {
  links: ILink[];
}

export default function Navbar({ links }: INavbar) {
  const location = useLocation();

  return (
    <>
      {links.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          href={to}
          label={label}
          leftSection={<Icon size="1.5rem" stroke={1.5} />}
          data-active={to === location.pathname || undefined}
          variant="subtle"
          className={classes.navLink}
        />
      ))}
    </>
  );
}
