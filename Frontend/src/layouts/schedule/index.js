import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from 'react-router-dom';
import useToken from 'hooks/login_hook';

function Schedule() {
  const [scheduleData, setScheduleData] = useState({ columns: [], rows: [] });
  const [formData, setFormData] = useState({
    truckId: "",
    serviceType: "",
    route: "",
    startTime: "",
    endTime: "",
    requestedBy: ""
  });
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing or adding
  const [selectedScheduleId, setSelectedScheduleId] = useState(null); // Track selected schedule for actions
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu

  const open = Boolean(anchorEl);

  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token==null) {
      navigate('/authentication/sign-in');
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/schedule", {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();

      // Transform data into format suitable for DataTable
      const transformedData = {
        columns: [
          { Header: "Truck ID", accessor: "truckId" },
          { Header: "Service Type", accessor: "serviceType" },
          { Header: "Route", accessor: "route" },
          { Header: "Start Time", accessor: "startTime" },
          { Header: "End Time", accessor: "endTime" },
          { Header: "Status", accessor: "status" },
          { Header: "Requested By", accessor: "requestedBy" },
          { Header: "Actions", accessor: "action" } // New Action column
        ],
        rows: data.map((item) => ({
          _id: item._id, // Keep _id for internal usage (not displayed)
          truckId: item.truckId,
          serviceType: item.serviceType,
          route: item.route,
          startTime: new Date(item.startTime).toLocaleString(), // Format date if needed
          endTime: new Date(item.endTime).toLocaleString(),     // Format date if needed
          status: item.status,
          requestedBy: item.requestedBy,
          action: (
            <MDBox display="flex" justifyContent="center">
              <IconButton onClick={(event) => handleMenuClick(event, item._id)}>
                <MoreVertIcon />
              </IconButton>
            </MDBox>
          ),
        })),
      };

      setScheduleData(transformedData);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  // Handle Menu Click for Actions Dropdown (only open menu)
  const handleMenuClick = (event, scheduleId) => {
    setAnchorEl(event.currentTarget); // Open dropdown menu
    setSelectedScheduleId(scheduleId); // Track which schedule is selected for actions
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close dropdown menu
    
  };

  // Handle Delete Action
  const handleDelete = async () => {
    handleMenuClose(); // Close menu before proceeding

    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/schedule/${selectedScheduleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove deleted schedule from state (update rows)
          setScheduleData((prevState) => ({
            ...prevState,
            rows: prevState.rows.filter((row) => row._id !== selectedScheduleId), // Remove deleted row
          }));
          alert("Schedule deleted successfully");
        } else {
          alert("Failed to delete schedule");
        }
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  // Handle Edit Action (trigger edit mode and pre-fill form)
  const handleEdit = async () => {
    handleMenuClose(); // Close menu before proceeding

    try {
      const response = await fetch(`http://127.0.0.1:5000/schedule/${selectedScheduleId}`);
      if (response.ok) {
        const schedule = await response.json();
        setFormData({
          truckId: schedule.truckId,
          serviceType: schedule.serviceType,
          route: schedule.route,
          startTime: new Date(schedule.startTime).toISOString().slice(0, -1), // Convert to ISO format for input fields
          endTime: new Date(schedule.endTime).toISOString().slice(0, -1),
          requestedBy: schedule.requestedBy,
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching schedule details:", error);
    }
  };

  // Handle Form Submit (for both Add and Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isEditing && selectedScheduleId) {
      // PATCH request for updating an existing schedule
      try {
        const response = await fetch(`http://127.0.0.1:5000/schedule/${selectedScheduleId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          alert("Schedule updated successfully");
          fetchScheduleData(); // Re-fetch data after update
          clearForm();
        } else {
          alert("Failed to update schedule");
        }
      } catch (error) {
        console.error("Error updating schedule:", error);
      }
    } else {
      // POST request for adding a new schedule
      try {
        const response = await fetch(`http://127.0.0.1:5000/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          alert("Schedule added successfully");
          fetchScheduleData(); // Re-fetch data after adding a new schedule
          clearForm();
        } else {
          alert("Failed to add schedule");
        }
      } catch (error) {
        console.error("Error adding schedule:", error);
      }
    }
  };

  // Clear form after submission or cancellation
  const clearForm = () => {
    setFormData({
      truckId: "",
      serviceType: "",
      route: "",
      startTime: "",
      endTime: "",
      requestedBy: ""
    });
    setIsEditing(false);
    setSelectedScheduleId(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Schedule Form */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6">
                  {isEditing ? "Edit Schedule" : "Add Schedule"}
                </MDTypography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Truck ID"
                        fullWidth
                        value={formData.truckId}
                        onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Service Type"
                        fullWidth
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Route"
                        fullWidth
                        value={formData.route}
                        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                        required
                      />
                    </Grid>
                    {/* Fixing overlapping text in datetime-local inputs */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Start Time"
                        type="datetime-local"
                        fullWidth
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="End Time"
                        type="datetime-local"
                        fullWidth
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Requested By"
                        fullWidth
                        value={formData.requestedBy}
                        onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                  {/* Buttons */}
                  <MDBox mt={3}>
                    {/* Ensure button text is white */}
                    <Button type="submit" variant="contained" style={{ backgroundColor: '#1976d2', color: 'white' }}>
                      {isEditing ? 'Update Schedule' : 'Add Schedule'}
                    </Button>
                    {isEditing && (
                      <Button onClick={() => clearForm()} variant='outlined' style={{ color: 'white', backgroundColor: '#f44336', marginLeft: '10px' }}>
                        Cancel Edit
                      </Button>
                    )}
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>

          {/* Schedule Table */}
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  Schedule History
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable table={scheduleData} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dropdown Menu for Actions */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit()}>
          <EditIcon fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete()}>
          <DeleteIcon fontSize="small" /> Delete
        </MenuItem>
      </Menu>
    </DashboardLayout>
  );
}

export default Schedule;