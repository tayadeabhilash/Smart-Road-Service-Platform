import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useEffect } from "react";

// Billing page components
import ActiveSimulation from "layouts/simulation/components/ActiveSimulation";
import BillingInformation from "./components/SimulationHistory";
import { useNavigate } from 'react-router-dom';
import useToken from 'hooks/login_hook';

function Simulation() {
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token==null) {
      navigate('/authentication/sign-in');
    }
  }, [token, navigate]);

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
