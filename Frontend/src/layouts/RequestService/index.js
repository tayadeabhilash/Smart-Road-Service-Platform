import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function ServiceRequests() {
  const [scheduleData, setScheduleData] = useState({ columns: [], rows: [] });
  const [formData, setFormData] = useState({
    truckId: "",
    serviceCategory: "",
    specificServices: [],
    requestedBy: "",
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  // Service Categories and Options
  const serviceCategories = {
    "Routine Maintenance": [
      "Oil changes",
      "Tire rotations and replacements",
      "Brake inspections and replacements",
      "Fluid checks and top-ups",
    ],
    "Emergency Repairs": [
      "Towing services",
      "Engine repairs",
      "Transmission and drivetrain repairs",
      "Electrical system troubleshooting",
    ],
    "Specialized Repairs": [
      "Suspension and axle repairs",
      "HVAC system servicing",
      "Exhaust system maintenance",
      "Bodywork and paint repairs",
    ],
    // Add more categories as needed...
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/services", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      const transformedData = {
        columns: [
          { Header: "Truck ID", accessor: "truckId" },
          { Header: "Service Category", accessor: "serviceCategory" },
          { Header: "Specific Services", accessor: "specificServices" },
          { Header: "Requested By", accessor: "requestedBy" },
          { Header: "Notes", accessor: "notes" },
          { Header: "Actions", accessor: "action" },
        ],
        rows: data.map((item) => ({
          _id: item._id,
          truckId: item.truckId,
          serviceCategory: item.serviceCategory,
          specificServices: item.specificServices.join(", "), // Join array for display
          requestedBy: item.requestedBy,
          notes: item.notes,
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
      console.error("Error fetching service data:", error);
    }
  };

  const handleMenuClick = (event, scheduleId) => {
    setAnchorEl(event.currentTarget);
    setSelectedScheduleId(scheduleId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleMenuClose();

    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/services/${selectedScheduleId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setScheduleData((prevState) => ({
            ...prevState,
            rows: prevState.rows.filter((row) => row._id !== selectedScheduleId),
          }));
          alert("Service request deleted successfully");
        } else {
          alert("Failed to delete service request");
        }
      } catch (error) {
        console.error("Error deleting service request:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && selectedScheduleId) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/services/${selectedScheduleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Service request updated successfully");
          fetchScheduleData();
          clearForm();
        } else {
          alert("Failed to update service request");
        }
      } catch (error) {
        console.error("Error updating service request:", error);
      }
    } else {
      try {
        const response = await fetch("http://127.0.0.1:5000/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Service request added successfully");
          fetchScheduleData();
          clearForm();
        } else {
          alert("Failed to add service request");
        }
      } catch (error) {
        console.error("Error adding service request:", error);
      }
    }
  };

  const clearForm = () => {
    setFormData({
      truckId: "",
      serviceCategory: "",
      specificServices: [],
      requestedBy: "",
      notes: "",
    });
    setIsEditing(false);
    setSelectedScheduleId(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={10}>
                <MDTypography variant="h6">
                  {isEditing ? "Edit Service Request" : "Add Service Request"}
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
                      <FormControl fullWidth>
                        <InputLabel>Service Category</InputLabel>
                        <Select
                          value={formData.serviceCategory}
                          onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                          required
                        >
                          {Object.keys(serviceCategories).map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Specific Services</InputLabel>
                        <Select
                          multiple
                          value={formData.specificServices}
                          onChange={(e) =>
                            setFormData({ ...formData, specificServices: e.target.value })
                          }
                        >
                          {(serviceCategories[formData.serviceCategory] || []).map((service) => (
                            <MenuItem key={service} value={service}>
                              {service}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Requested By"
                        fullWidth
                        value={formData.requestedBy}
                        onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Notes"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                  <MDBox mt={3}>
                    <Button type="submit" variant="contained" style={{ backgroundColor: "#1976d2", color: "white" }}>
                      {isEditing ? "Update Request" : "Add Request"}
                    </Button>
                    {isEditing && (
                      <Button
                        onClick={clearForm}
                        variant="outlined"
                        style={{ color: "white", backgroundColor: "#f44336", marginLeft: "10px" }}
                      >
                        Cancel
                      </Button>
                    )}
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  Service Requests History
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={scheduleData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" /> Delete
        </MenuItem>
      </Menu>
    </DashboardLayout>
  );
}

export default ServiceRequests;
