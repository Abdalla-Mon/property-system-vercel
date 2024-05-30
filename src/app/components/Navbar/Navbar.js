"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Hidden,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HouseIcon from "@mui/icons-material/House";

import ApartmentIcon from "@mui/icons-material/Apartment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BuildIcon from "@mui/icons-material/Build";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import GroupIcon from "@mui/icons-material/Group";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

const navItems = [
  { href: "/", Icon: HomeIcon, text: "الرئيسيه" },
  // { href: "/properties", Icon: HouseIcon, text: "العقارات" },
  { href: "/units", Icon: ApartmentIcon, text: "الوحدات" },
  { href: "/rent", Icon: PaymentIcon, text: "عقود الايجار" },
  { href: "/invoices", Icon: ReceiptIcon, text: "الفواتير" },
  { href: "/maintenance", Icon: BuildIcon, text: "الصيانه" },
  // { href: "/owners", Icon: PeopleIcon, text: "الملاك" },
  // { href: "/renters", Icon: GroupIcon, text: "المستأجرين" },
  { href: "/settings", Icon: SettingsIcon, text: "الاعدادات" },
];

export default function DashboardNav({ children }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <List>
      {navItems.map((item) => (
        <Link href={item.href} passHref key={item.href}>
          <ListItem
            sx={{
              backgroundColor: pathname === item.href ? "#efefef" : "inherit",
            }}
          >
            <ListItemIcon>
              <item.Icon />
            </ListItemIcon>
            {(open || mobileOpen) && <ListItemText primary={item.text} />}
          </ListItem>
        </Link>
      ))}
    </List>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
      }}
    >
      <Hidden lgUp>
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            width: "100%",
            justifyContent: "between",
            padding: 1,
            px: 2,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Hidden>
      <Hidden lgUp>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : 60,
            flexShrink: 0,
            transition: "width 0.3s",
            position: "relative",
            [`& .MuiDrawer-paper`]: {
              width: open ? drawerWidth : 60,
              transition: "width 0.3s",
              boxSizing: "border-box",
              overflowX: "hidden",
            },
          }}
          open={open}
        >
          <Hidden lgDown>
            <Box
              sx={{
                position: open ? "fixed" : "fixed",
                top: 16,
                zIndex: 1300,
                left: open ? drawerWidth + 10 : 75,
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          </Hidden>
          {drawerContent}
        </Drawer>
      </Hidden>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s",
          ml: { lg: open ? `60px` : "60px", xs: "0px" },
          width: { lg: open ? `calc(100% - 300px)` : "100%" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
