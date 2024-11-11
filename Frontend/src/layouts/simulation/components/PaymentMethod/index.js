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
import React, { useState } from 'react';
import Card from "@mui/material/Card";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Icon from "@mui/material/Icon";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function PaymentMethod() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [open, setOpen] = React.useState(false);
  const [map, setMap] = useState('');
  const [weather, setWeather] = useState('');

  const handleMapChange = (event) => {
    setMap(event.target.value);
  };

  const handleWeatherChange = (event) => {
    setWeather(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      map: map,
      weather: weather,
    };

    console.log('Form Data:', formData);

    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      console.log('API Response:', result);

      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <Card id="active-simulation">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Active Simulation
        </MDTypography>
        <MDButton variant="gradient" color="dark" onClick={handleClickOpen}>
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;Create new simulation
        </MDButton>
      </MDBox>
      <MDBox
        component="img"
        src="https://www.avl.com/sites/default/files/styles/landscape_full/public/2023-01/gl-ast_image-web-vehicle-simulation_01-23.png.webp"
        alt="CARLA Simulation"
        width="80%"
        pb={2}
        pt={2}
        sx={{ display: 'block', margin: 'auto' }}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Simulation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter desired configuration for the new simulation
            </DialogContentText>

            {/* Use Box to stack inputs vertically */}
            <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Map Selection */}
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel id="map-label">Map</InputLabel>
                <Select
                  labelId="map-label"
                  id="map-select"
                  value={map}
                  onChange={handleMapChange}
                  label="Map"
                  required
                >
                  <MenuItem value={"town01"}>Town 1</MenuItem>
                  <MenuItem value={"town02"}>Town 2</MenuItem>
                  <MenuItem value={"town03"}>Town 3</MenuItem>
                </Select>
              </FormControl>

              {/* Weather Selection */}
              <FormControl mt={2} variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel id="weather-label">Weather</InputLabel>
                <Select
                  labelId="weather-label"
                  id="weather-select"
                  value={weather}
                  onChange={handleWeatherChange}
                  label="Weather"
                  required
                >
                  <MenuItem value={"sunny"}>Sunny</MenuItem>
                  <MenuItem value={"rainy"}>Rainy</MenuItem>
                  <MenuItem value={"cloudy"}>Cloudy</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
}

export default PaymentMethod;
