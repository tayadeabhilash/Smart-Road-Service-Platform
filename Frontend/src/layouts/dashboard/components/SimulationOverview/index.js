import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Pagination from "@mui/material/Pagination";

function SimulationOverview({ simulationData, loading, error }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (event, value) => {
    setPage(value);
  };

  const paginatedData = simulationData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Simulation Overview
        </MDTypography>
        {loading ? (
          <MDTypography>Loading...</MDTypography>
        ) : error ? (
          <MDTypography color="error">Error: {error}</MDTypography>
        ) : (
          <>
            <MDBox mt={2}>
              {paginatedData.map((simulation, index) => (
                <MDBox key={index} mb={2}>
                  <MDTypography variant="button" fontWeight="bold">
                    Simulation ID: {simulation.simulation_id.split("-")[0]}
                  </MDTypography>
                  <MDTypography variant="caption" component="div" color="textSecondary">
                    Map: {simulation.map} &nbsp; | &nbsp;
                    Weather: {simulation.weather} &nbsp; | &nbsp;
                    Start Time: {new Date(simulation.start_time * 1000).toLocaleString()} &nbsp; | &nbsp;
                    Vehicle Data Count: {simulation.vehicle_data.length}
                  </MDTypography>
                </MDBox>
              ))}
            </MDBox>
            <Pagination
              count={Math.ceil(simulationData.length / itemsPerPage)}
              page={page}
              onChange={handleChange}
              color="info"
              sx={{ mt: 2 }}
            />
          </>
        )}
      </MDBox>
    </Card>
  );
}

SimulationOverview.propTypes = {
  simulationData: PropTypes.arrayOf(
    PropTypes.shape({
      simulation_id: PropTypes.string.isRequired,
      map: PropTypes.string.isRequired,
      weather: PropTypes.string.isRequired,
      start_time: PropTypes.number.isRequired,
      vehicle_data: PropTypes.array.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default SimulationOverview;