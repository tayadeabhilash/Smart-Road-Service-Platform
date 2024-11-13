import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Billing page components
import ActiveSimulation from "layouts/simulation/components/ActiveSimulation";
import BillingInformation from "./components/SimulationHistory";

function Simulation() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <Grid item xs={12}>
          <ActiveSimulation />
        </Grid>
      </MDBox>
      <MDBox mt={4}>
        <BillingInformation />
      </MDBox>
    </DashboardLayout>
  );
}

export default Simulation;
