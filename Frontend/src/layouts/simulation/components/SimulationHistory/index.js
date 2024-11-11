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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import SimHistoryCard from "layouts/simulation/components/SimHistoryCard";

function SimulationHistory() {
  return (
    <Card id="simulation-history">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Simulation History
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <SimHistoryCard name="Simulation 1" map="TOWN01" weather="Cloudy" />
          <SimHistoryCard name="Simulation 2" map="TOWN02" weather="Clear" />
          <SimHistoryCard name="Simulation 3" map="TOWN03" weather="Rainy" />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default SimulationHistory;
