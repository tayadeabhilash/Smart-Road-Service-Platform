import Dashboard from "layouts/dashboard";
import Service from "layouts/service";
import Simulation from "layouts/simulation";
import Schedule from "layouts/schedule";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import Tracking from "layouts/tracking";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Tracking",
    key: "tracking",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tracking",
    component: <Tracking />,
  },
  {
    type: "collapse",
    name: "Request Service",
    key: "service",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/service",
    component: <Service />,
  },
  {
    type: "collapse",
    name: "Simulation",
    key: "sim",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/simulation",
    component: <Simulation />,
  },
  {
    type: "collapse",
    name: "Schedule",
    key: "schedule",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/schedule",
    component: <Schedule />,
  },
  {
    type: "collapse",
    name: "Request Service",
    key: "RequestService",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/RequestService",
    component: <RequestService />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "hide",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "hide",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
