import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/j73zg2s8gewu8ejzhb2b.png";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

function validateFormData(formData) {
  const errors = {};
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!formData.username) errors.username = "Username is required.";
  if (!formData.password) errors.password = "Password is required.";
  if (!formData.email || !emailRegex.test(formData.email)) errors.email = "A valid email is required.";
  if (!formData.name) errors.name = "Name is required.";
  if (!formData.phone) errors.phone = "Phone number is required.";
  if (!formData.address) errors.address = "Address is required.";
  if (!formData.profile_photo) errors.profile_photo = "Profile photo is required.";

  return errors;
}

function Cover() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "truck_owner",
    name: "",
    phone: "",
    address: "",
    profile_photo: "",
  });

  const [errors, setErrors] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageName, setImageName] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name); // Set the image name
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://127.0.0.1:5000/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to submit form");
        }

        console.log("Form submitted successfully");
      } catch (error) {
        setErrorMessage(error.message);
        setDialogOpen(true);
      }
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign Up With Us
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {errors.apiError && (
              <MDTypography variant="caption" color="error">
                {errors.apiError}
              </MDTypography>
            )}
            <MDBox mb={2}>
              <TextField
                label="Username"
                name="username"
                variant="standard"
                fullWidth
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="standard"
                fullWidth
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Name"
                name="name"
                variant="standard"
                fullWidth
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Email"
                name="email"
                variant="standard"
                fullWidth
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Phone Number"
                name="phone"
                variant="standard"
                fullWidth
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Address"
                name="address"
                variant="standard"
                fullWidth
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </MDBox>
            
            {/* Role Selection */}
            <MDBox mb={2}>
              <MDTypography variant="caption" >Select Role</MDTypography>
              <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                  <FormControlLabel value="truck_owner" control={<Radio />} label="Truck Owner" />
                  <FormControlLabel value="cloud_service_staff" control={<Radio />} label="Cloud Service Staff" />
              </RadioGroup>
            </MDBox>

            {/* File Upload */}
            <MDBox mb={2}>
              <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-photo-upload"
                  type="file"
                  onChange={handleFileChange}
              />
              <label htmlFor="profile-photo-upload">
                  <MDButton variant="contained" component="span">
                      Upload Profile Photo
                  </MDButton>
              </label>
              {imageName && (
                  <MDTypography variant="caption" color="text">
                    Selected file: {imageName}
                  </MDTypography>
              )}
              {errors.profile_photo && (
                  <MDTypography variant="caption" color="error">
                    {errors.profile_photo}
                  </MDTypography>
              )}
            </MDBox>

            {/* Terms and Conditions */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                  &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <Link to="#" style={{ textDecoration: 'none' }}>
                  <MDTypography
                      component="span"
                      variant="button"
                      fontWeight="bold"
                      color="info"
                      textGradient
                  >
                      Terms and Conditions
                  </MDTypography>
              </Link>
            </MDBox>

            {/* Submit Button */}
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                  Sign Up
              </MDButton>
            </MDBox>

            {/* Sign In Link */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                  Already have an account?{" "}
                  <Link to="/authentication/sign-in">
                      Sign In
                  </Link>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Error Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>{errorMessage}</DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </Card>
    </CoverLayout>
  );
}

export default Cover;