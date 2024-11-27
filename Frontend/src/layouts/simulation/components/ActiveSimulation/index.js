import React, { useState } from 'react';
import Card from "@mui/material/Card";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function ActiveSimulation() {
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState('');
  const [weather, setWeather] = useState('');

  const handleMapChange = (event) => setMap(event.target.value);
  
  const handleWeatherChange = (event) => setWeather(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = { map, weather };

    try {
      const response = await fetch('http://127.0.0.1:5000/run_simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      console.log('Simulation Response:', result);

      handleClose(); // Close dialog after starting simulation

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClickOpen = () => setOpen(true);
  
  const handleClose = () => setOpen(false);

  return (
    <Card id="active-simulation">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Active Simulation
        </MDTypography>
        <MDButton variant="gradient" color="dark" onClick={handleClickOpen}>
          Create new simulation
        </MDButton>
      </MDBox>

      {/* Live Camera Stream or Placeholder */}
      <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MDBox
          component="img"
          src="http://127.0.0.1:5000/camera_stream"
          alt="CARLA Simulation Camera Stream"
          width="80%"
          pb={2}
          pt={2}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop if placeholder fails too
            e.target.src = "https://www.avl.com/sites/default/files/styles/landscape_full/public/2023-01/gl-ast_image-web-vehicle-simulation_01-23.png.webp"; // Placeholder image
          }}
        />
      </MDBox>

      {/* Simulation Creation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Simulation</DialogTitle>
          <DialogContent>
            <DialogContentText>Select configuration for the new simulation.</DialogContentText>

            {/* Map and Weather Selection */}
            <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Map Selection with Descriptions */}
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel id="map-label">Map</InputLabel>
                <Select labelId="map-label" id="map-select" value={map} onChange={handleMapChange} required>
                  {/* Add all towns here */}
                  <MenuItem value={"Town01"}>Town 1 - Small town with river and bridges</MenuItem>
                  <MenuItem value={"Town02"}>Town 2 - Residential & Commercial buildings</MenuItem>
                  <MenuItem value={"Town03"}>Town 3 - Urban map with roundabout and junctions</MenuItem>
                  <MenuItem value={"Town04"}>Town 4 - Mountain town with figure-8 highway</MenuItem>
                  <MenuItem value={"Town05"}>Town 5 - Grid town with multiple lanes and a bridge</MenuItem>
                  <MenuItem value={"Town06"}>Town 6 - Long highways with many exits</MenuItem>
                  <MenuItem value={"Town07"}>Town 7 - Rural environment with narrow roads</MenuItem>
                </Select>
              </FormControl>

              {/* Weather Selection */}
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel id="weather-label">Weather</InputLabel>
                <Select labelId="weather-label" id="weather-select" value={weather} onChange={handleWeatherChange} required>
                  {/* Add weather options */}
                  {["clear", "cloudy", "rainy", "stormy"].map((condition, index) => (
                    <MenuItem key={index} value={condition}>{condition}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

          </DialogContent>

          {/* Actions */}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>

        </form>
      </Dialog>
    </Card>
  );
}

export default ActiveSimulation;