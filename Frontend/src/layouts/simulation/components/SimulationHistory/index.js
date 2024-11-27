import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SimHistoryCard from "layouts/simulation/components/SimHistoryCard";

function SimulationHistory() {
  const [simulations, setSimulations] = useState([]);

  // Fetch simulation history from the API
  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/simulation"); // Adjust API URL if needed
        if (!response.ok) throw new Error("Failed to fetch simulations");
        const data = await response.json();
        setSimulations(data);
      } catch (error) {
        console.error("Error fetching simulation history:", error);
      }
    };

    fetchSimulations();
  }, []);

  // Function to handle deletion of a simulation
  const handleDelete = (simulationId) => {
    setSimulations((prevSimulations) =>
      prevSimulations.filter((sim) => sim._id !== simulationId)
    );
  };

  return (
    <Card id="simulation-history">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Simulation History
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {simulations.length > 0 ? (
            simulations.map((simulation) => (
              <SimHistoryCard
                key={simulation._id}
                name={`Simulation ${simulation.simulation_id}`}
                map={simulation.map}
                weather={simulation.weather}
                vehicleData={simulation.vehicle_data}
                simulationId={simulation._id} // Pass MongoDB ObjectID for deletion
                onDelete={handleDelete} // Pass deletion handler
              />
            ))
          ) : (
            <MDTypography>No simulations found</MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default SimulationHistory;