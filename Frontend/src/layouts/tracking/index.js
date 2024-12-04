import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { jwtDecode } from "jwt-decode";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from 'react-router-dom';
import useToken from 'hooks/login_hook';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Component to programmatically move and zoom the map
function SetViewOnSearch({ filteredTrucks }) {
    const map = useMap();
    useEffect(() => {
        if (filteredTrucks.length > 0) {
            const { latitude, longitude } = filteredTrucks[0];
            map.setView([latitude, longitude], 15);
        }
    }, [filteredTrucks, map]);
    return null;
}

SetViewOnSearch.propTypes = {
    filteredTrucks: PropTypes.arrayOf(
        PropTypes.shape({
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        })
    ).isRequired,
};

function Tracking() {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [truckNumbers, setTruckNumbers] = useState(""); // Comma-separated numbers
    const [filteredTrucks, setFilteredTrucks] = useState([]); // Multiple trucks
    const [serviceTrucks, setServiceTrucks] = useState([]); // Trucks with requested services
    const [showServiceTrucks, setShowServiceTrucks] = useState(false); // Toggle visibility
    const { token } = useToken();
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
      if (token==null) {
        navigate('/authentication/sign-in');
      }
      const decoded = jwtDecode(token);
        setUserName(decoded.username);
        setRole(decoded.role)
    }, [token, navigate]);

    useEffect(() => {
        const url = role === 'truck_owner' ? `http://127.0.0.1:5000/trucks/${userName}` : `http://127.0.0.1:5000/trucks`;
        axios
            .get(url)
            .then((response) => {
                setTrucks(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching trucks:", error);
                setLoading(false);
            });
    }, [role]);

    const handleTruckSearch = () => {
        const truckNames = truckNumbers.split(",").map((num) => `Truck ${num.trim()}`);
        const foundTrucks = trucks.filter((truck) => truckNames.includes(truck.name));
        if (foundTrucks.length > 0) {
            setFilteredTrucks(foundTrucks);
        } else {
            alert("No trucks found. Try again.");
            setFilteredTrucks([]);
        }
    };

    const toggleServiceTrucks = () => {
        if (!showServiceTrucks) {
            const filtered = trucks.filter(
                (truck) => truck.requested_services && truck.requested_services.length > 0
            );
            setServiceTrucks(filtered);
        } else {
            setServiceTrucks([]);
        }
        setShowServiceTrucks(!showServiceTrucks); // Toggle visibility
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={2}>
                <MDBox mb={3}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={12}>
                            <Card
                                sx={{
                                    p: 2,
                                    gap: 2,
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            placeholder="Enter numbers (e.g., 1, 2, 3)"
                                            value={truckNumbers}
                                            onChange={(e) => setTruckNumbers(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Button fullWidth variant="contained" color="success" onClick={handleTruckSearch}>
                                            Search Trucks
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color={showServiceTrucks ? "error" : "warning"}
                                            onClick={toggleServiceTrucks}
                                        >
                                            {showServiceTrucks ? "Hide Services" : "Show Services"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            {/* Map and Truck Search Section */}
                            <Box
                                sx={{
                                    height: "60vh",
                                    position: "relative",
                                    border: 1,
                                    borderColor: "grey.300",
                                    borderRadius: 2,
                                }}
                            >
                                {loading ? (
                                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                                        Loading map and truck data...
                                    </Typography>
                                ) : (
                                    <>
                                        <MapContainer
                                            center={[37.7749, -122.4194]}
                                            zoom={9}
                                            style={{
                                                height: "100%",
                                                width: "100%"
                                            }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                                            />
                                            {trucks.map((truck) => (
                                                <Marker key={truck.id} position={[truck.latitude, truck.longitude]}>
                                                    <Popup>
                                                        <strong>{truck.name}</strong>
                                                        <br />
                                                        Latitude: {truck.latitude}
                                                        <br />
                                                        Longitude: {truck.longitude}
                                                        <br />
                                                        Speed: {truck.speed} mph
                                                        <br />
                                                        Status: {truck.status}
                                                        <br />
                                                        Services:{" "}
                                                        {truck.requested_services.length > 0
                                                            ? truck.requested_services.join(", ")
                                                            : "None"}
                                                    </Popup>
                                                </Marker>
                                            ))}
                                            <SetViewOnSearch filteredTrucks={filteredTrucks} />
                                        </MapContainer>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default Tracking;