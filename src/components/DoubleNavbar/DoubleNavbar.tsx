import { Title, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import React from "react";
import classes from "./DoubleNavbar.module.css";

const mainLinksMockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  { icon: IconCalendarStats, label: "Releases" },
  { icon: IconUser, label: "Account" },
  { icon: IconFingerprint, label: "Security" },
  { icon: IconSettings, label: "Settings" },
];

const linksMockdata = [
  "Security",
  "Settings",
  "Dashboard",
  "Releases",
  "Account",
  "Orders",
  "Clients",
  "Databases",
  "Pull Requests",
  "Open Issues",
  "Wiki pages",
];

export function DoubleNavbar() {
  const [active, setActive] = React.useState("Releases");
  const [activeLink, setActiveLink] = React.useState("Settings");

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={classes.mainLink}
        data-active={link.label === active || undefined}
      >
        <link.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const links = linksMockdata.map((link) => (
    <a
      className={classes.link}
      data-active={activeLink === link || undefined}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setActiveLink(link);
      }}
      key={link}
    >
      {link}
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <MantineLogo type="mark" size={30} />
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>

          {links}
        </div>
      </div>
    </nav>
  );
}
