import React, { useState } from "react";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

function SimHistoryCard({ name, map, weather, vehicleData, simulationId, onDelete }) {
  const [open, setOpen] = useState(false);

  const handleViewResults = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/simulation/${simulationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(simulationId); // Call parent function to remove the deleted item from state
      } else {
        console.error("Failed to delete simulation");
      }
    } catch (error) {
      console.error("Error deleting simulation:", error);
    }
  };

  return (
    <>
      <MDBox
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={"grey-100"}
        borderRadius="lg"
        p={3}
        mb={1}
        mt={2}
      >
        <MDBox width="100%" display="flex" flexDirection="column">
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            mb={2}
          >
            <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
              {name}
            </MDTypography>

            <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
              <MDButton variant="text" color="error" onClick={handleDelete}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
              <MDButton variant="text" color={"dark"} onClick={handleViewResults}>
                <Icon>pageview</Icon>&nbsp;view results
              </MDButton>
            </MDBox>
          </MDBox>

          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Map:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {map}
              </MDTypography>
            </MDTypography>
          </MDBox>

          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Weather:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {weather}
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Dialog for displaying vehicle data */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Vehicle Data for {name}</DialogTitle>
        <DialogContent dividers>
          {vehicleData && vehicleData.length > 0 ? (
            vehicleData.map((dataPoint, index) => (
              <div key={index}>
                <p><strong>Timestamp:</strong> {new Date(dataPoint.timestamp * 1000).toLocaleString()}</p>
                <p><strong>Location:</strong> x: {dataPoint.location.x}, y: {dataPoint.location.y}, z: {dataPoint.location.z}</p>
                <p><strong>Rotation:</strong> pitch: {dataPoint.rotation.pitch}, yaw: {dataPoint.rotation.yaw}, roll: {dataPoint.rotation.roll}</p>
                <p><strong>Velocity:</strong> x: {dataPoint.velocity.x}, y: {dataPoint.velocity.y}, z: {dataPoint.velocity.z}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No vehicle data available</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

SimHistoryCard.propTypes = {
  name: PropTypes.string.isRequired,
  map: PropTypes.string.isRequired,
  weather: PropTypes.string.isRequired,
  vehicleData: PropTypes.array.isRequired,
  simulationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SimHistoryCard;