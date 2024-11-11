/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Billing page components
import PaymentMethod from "layouts/simulation/components/PaymentMethod";
import BillingInformation from "./components/SimulationHistory";

function Simulation() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <Grid item xs={12}>
          <PaymentMethod />
        </Grid>
      </MDBox>
      <MDBox mt={4}>
        <BillingInformation />
      </MDBox>
    </DashboardLayout>
  );
}

export default Simulation;
