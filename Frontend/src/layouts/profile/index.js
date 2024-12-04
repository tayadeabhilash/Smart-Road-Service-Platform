import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import Header from "layouts/profile/components/Header";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import MDButton from "components/MDButton";

import truckimg1 from "assets/images/hand-drawn-transport-truck-shipping-illustrated_23-2149149321.jpg";
import truckimg2 from "assets/images/hand-drawn-transport-truck_23-2149167035.jpg";
import truckimg3 from "assets/images/hand-drawn-transport-truck_23-2149166402.jpg";
import truckimg4 from "assets/images/hand-drawn-transport-truck_23-2149145940.jpg";
import { useNavigate } from 'react-router-dom';
import useToken from 'hooks/login_hook';
import { jwtDecode } from "jwt-decode";

const truckImages = [truckimg1, truckimg2, truckimg3, truckimg4];

function Overview() {
  const [profileData, setProfileData] = useState(null);
  const [truckData, setTruckData] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAddTruck, setOpenAddTruck] = useState(false);
  const [newTruck, setNewTruck] = useState({
    name: "",
    latitude: "",
    longitude: "",
    speed: "",
    status: "Idle",
    requested_services: "",
  });
  const { token } = useToken();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (token==null) {
      navigate('/authentication/sign-in');
    }
    setUserName(jwtDecode(token).username);
  }, [token, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/profile/${userName}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, [userName]);

  const fetchTrucks = async () => {
    try {
      const url = profileData.role == "cloud_service_staff"? `http://127.0.0.1:5000/trucks`:`http://127.0.0.1:5000/trucks/${profileData.username}`
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch trucks data");
      const trucks = await response.json();
      setTruckData(trucks);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  useEffect(() => {
    if(profileData)
      fetchTrucks();
  }, [profileData]);

  const handleViewDetails = (truck) => {
    setSelectedTruck(truck);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedTruck(null);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/trucks/${selectedTruck._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTruck),
      });
      if (!response.ok) throw new Error("Failed to update truck data");
      alert("Truck details updated successfully");
      handleCloseDetails();
      fetchTrucks(); // Refresh the truck list after saving changes
    } catch (error) {
      console.error("Error updating truck:", error);
      alert("Failed to update truck details");
    }
  };

  const handleChange = (e) => {
    setSelectedTruck({ ...selectedTruck, [e.target.name]: e.target.value });
  };

  const handleAddTruckOpen = () => {
    setOpenAddTruck(true);
  };

  const handleAddTruckClose = () => {
    setOpenAddTruck(false);
    setNewTruck({
      name: "",
      latitude: "",
      longitude: "",
      speed: "",
      status: "Idle",
      requested_services: "",
    });
  };

  const handleAddTruckChange = (e) => {
    setNewTruck({ ...newTruck, [e.target.name]: e.target.value });
  };

  const handleAddTruckSubmit = async () => {
    try {      
      const response = await fetch(`http://127.0.0.1:5000/trucks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTruck,
          username: profileData.username
        }),
      });
      
      if (!response.ok) throw new Error("Failed to add new truck");
      
      alert("New truck added successfully");
      handleAddTruckClose();
      fetchTrucks(); // Refresh the truck list after adding a new truck
    } catch (error) {
      console.error("Error adding new truck:", error);
      alert("Failed to add new truck");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header profileData={profileData}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {profileData ? (
                <ProfileInfoCard
                  title="Profile Information"
                  description={`Hi, I’m ${profileData.name}.`}
                  info={{
                    username: profileData.username,
                    fullName: profileData.name,
                    mobile: profileData.phone,
                    email: profileData.email,
                    location: profileData.address,
                  }}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={true}
                />
              ) : (
                <MDTypography variant="h6">Loading...</MDTypography>
              )}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Trucks
          </MDTypography>
          <MDBox mb={1}>
            <MDButton variant="contained" color="primary" onClick={handleAddTruckOpen}>
              Add Truck
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={3}>
            {truckData && truckData.map((truck, index) => (
              <Grid item xs={12} md={6} xl={4} key={index}>
                <DefaultProjectCard
                  image={truckImages[index % truckImages.length]} // Cycle through images
                  label={truck.name}
                  title={truck.name}
                  description={`Status: ${truck.status}, Speed: ${truck.speed} km/h`}
                  action={{
                    type: "internal",
                    route: "#",
                    color: "info",
                    label: "View Details",
                    onClick: () => handleViewDetails(truck),
                  }}
                  authors={[
                    { image: "/path/to/author-image.jpg", name: "Service Manager" }, // Replace with actual author info if needed
                  ]}
                />
              </Grid>
            ))}
          </Grid>
        </MDBox>

        {/* Truck Details Modal */}
        {selectedTruck && (
          <Dialog open={openDetails} onClose={handleCloseDetails}>
            <DialogTitle>{selectedTruck.name}</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                name="status"
                label="Status"
                type="text"
                fullWidth
                value={selectedTruck.status}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="speed"
                label="Speed"
                type="number"
                fullWidth
                value={selectedTruck.speed}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="requested_services"
                label="Requested Services"
                type="text"
                fullWidth
                value={selectedTruck.requested_services.join(', ')}
                onChange={(e) =>
                  setSelectedTruck({
                    ...selectedTruck,
                    requested_services: e.target.value.split(',').map(s => s.trim()),
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Add Truck Modal */}
        <Dialog open={openAddTruck} onClose={handleAddTruckClose}>
          <DialogTitle>Add New Truck</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={newTruck.name}
              onChange={handleAddTruckChange}
            />
            <TextField
              margin="dense"
              name="latitude"
              label="Latitude"
              type="text"
              fullWidth
              value={newTruck.latitude}
              onChange={handleAddTruckChange}
            />
            <TextField
              margin="dense"
              name="longitude"
              label="Longitude"
              type="text"
              fullWidth
              value={newTruck.longitude}
              onChange={handleAddTruckChange}
            />
            <TextField
              margin="dense"
              name="speed"
              label="Speed"
              type="number"
              fullWidth
              value={newTruck.speed}
              onChange={handleAddTruckChange}
            />
            <TextField
              margin="dense"
              name="status"
              label="Status"
              type="text"
              fullWidth
              value={newTruck.status}
              onChange={handleAddTruckChange}
            />
            <TextField
              margin="dense"
              name="requested_services"
              label="Requested Services (comma separated)"
              type="text"
              fullWidth
              value={newTruck.requested_services}
              onChange={(e) =>
                setNewTruck({
                  ...newTruck,
                  requested_services:
                    e.target.value.split(',').map((s) => s.trim()),
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddTruckClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddTruckSubmit} color="primary">
             Add Truck 
           </Button> 
         </DialogActions> 
       </Dialog> 
     </Header> 
   </DashboardLayout> 
 ); 
}

export default Overview;
