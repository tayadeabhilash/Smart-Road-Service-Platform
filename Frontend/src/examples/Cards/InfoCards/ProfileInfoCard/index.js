import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import profilecardimg from "assets/images/20945306.jpg"

function ProfileInfoCard({ title, info, action, shadow }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(info);
  const { size } = typography;

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/profile/${info.username}`, formData);
      if (response.data.message === "Profile updated successfully") {
        alert("Profile updated successfully");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Render the card info items
  const renderItems = Object.keys(formData).map((label) => (
    <MDBox key={label} display="flex" py={1} pr={2}>
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </MDTypography>
      {editMode && label !== 'username' ? (
        <TextField
          variant="outlined"
          name={label}
          value={formData[label]}
          onChange={handleChange}
          size="small"
          fullWidth
        />
      ) : (
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{formData[label]}
        </MDTypography>
      )}
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", width: "100%", boxShadow: shadow ? undefined : "none" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
            <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              {title}
            </MDTypography>
            {editMode ? (
              <Tooltip title="Save changes" placement="top">
                <Icon onClick={handleSaveClick}>save</Icon>
              </Tooltip>
            ) : (
              <Tooltip title={action.tooltip} placement="top">
                <Icon onClick={handleEditClick}>edit</Icon>
              </Tooltip>
            )}
          </MDBox>
          <MDBox p={2} display="flex" justifyContent="center" alignItems="center">
            <MDBox opacity={0.3}>
              <Divider />
            </MDBox>
            <MDBox>{renderItems}</MDBox>
          </MDBox>
          
        </Grid>
        
        <Grid item xs={12} md={6}>
          <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
            <Avatar
              alt="Profile Image"
              src={profilecardimg}
              sx={{ width: 400, height: 300 }}
            />
          </MDBox>
        </Grid>
      </Grid>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  shadow: true,
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;