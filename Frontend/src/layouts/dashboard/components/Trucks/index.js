import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

function Trucks({ trucksData, loading, error }) {
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Status", accessor: "status" },
    { Header: "Requested Services", accessor: "requested_services", Cell: ({ value }) => value.join(', ') },
  ];

  const rows = trucksData.map((truck) => ({
    name: truck.name,
    status: truck.status,
    requested_services: truck.requested_services,
  }));

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6">Trucks</MDTypography>
      </MDBox>
      <MDBox>
        {loading ? (
          <MDTypography>Loading...</MDTypography>
        ) : error ? (
          <MDTypography color="error">Error: {error}</MDTypography>
        ) : (
          <DataTable
            table={{ columns, rows }}
            showTotalEntries
            isSorted
            noEndBorder
            entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15] }}
            pagination
          />
        )}
      </MDBox>
    </Card>
  );
}

Trucks.propTypes = {
  trucksData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      requested_services: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default Trucks;