import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import PageLayout from "examples/LayoutContainers/PageLayout";

function CoverLayout({ coverHeight, image, children }) {
  return (
    <PageLayout>
      <MDBox
        width="calc(100% - 3rem)"
        minHeight={coverHeight}
        position="relative" // Make the parent relative to position children absolutely
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        pb={28}
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.4),
              rgba(gradients.dark.state, 0.4)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <MDBox
          position="absolute" // Position children absolutely
          top={0} // Align to top
          
          width="100%"
          px={1}
          mt="calc(2.5%)" // Add margin if needed for spacing
        >
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
              {children}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </PageLayout>
  );
}

CoverLayout.defaultProps = {
  coverHeight: "calc(100vh)",
};

CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;