import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import PieChart from "examples/Charts/PieChart";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { jwtDecode } from "jwt-decode";

// Dashboard components
import Trucks from "layouts/dashboard/components/Trucks";
import SimulationOverview from "layouts/dashboard/components/SimulationOverview";
import { useNavigate } from 'react-router-dom';
import useToken from 'hooks/login_hook';

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const [scheduleCount, setScheduleCount] = useState(0);
  const [trucks, setTrucks] = useState([]);
  const [simulationData, setSimulationData] = useState([]);

  const [requestedServicesCount, setRequestedServicesCount] = useState(0);
  
  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [loadingSimulations, setLoadingSimulations] = useState(true);
  const [loadingRequestedServices, setLoadingRequestedServices] = useState(true);
  
  const [errorTrucks, setErrorTrucks] = useState(null);
  const [errorSchedules, setErrorSchedules] = useState(null);
  const [errorSimulations, setErrorSimulations] = useState(null);
  const [errorRequestedServices, setErrorRequestedServices] = useState(null);

  const { token } = useToken();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token == null) {
      navigate('/authentication/sign-in');
    }
    const decoded = jwtDecode(token);
    setUserName(decoded.username);
    setRole(decoded.role)
  }, [token, navigate]);

  const fetchSchedules = async () => {
    let url = `http://127.0.0.1:5000/schedule`;
    role === 'cloud_service_staff' ? url += "/" + userName : '';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await response.json();
      setScheduleCount(data.length);
      setLoadingSchedules(false);
    } catch (err) {
      setErrorSchedules(err.message);
      setLoadingSchedules(false);
    }
  };

  // Function to fetch trucks data
  const fetchTrucks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/trucks');
      if (!response.ok) {
        throw new Error("Failed to fetch trucks");
      }
      const data = await response.json();
      setTrucks(data);
      setLoadingTrucks(false);
    } catch (err) {
      setErrorTrucks(err.message);
      setLoadingTrucks(false);
    }
  };
  const serviceRequestData = {
    labels: ["Resolved", "Non-Resolved"],
    datasets: 
      {
        data: [20, 5],
        backgroundColors: ["info", "error"],
      },
    
  };

  const processTruckData = (trucks) => {
    const statusCount = trucks.reduce((acc, truck) => {
      acc[truck.status] = (acc[truck.status] || 0) + 1;
      return acc;
    }, {});
  
    const chartData = {
      labels: Object.keys(statusCount),
      datasets: [
        {
          label: "Truck Count",
          data: Object.values(statusCount),
          color: "warning",
        },
      ],
    };
  
    return chartData;
  };

  const [chartData, setChartData] = useState({
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Simulations", data: [0, 0, 0, 0, 0, 0, 0] },
  });

  const fetchSimulations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/simulation');
      if (!response.ok) {
        throw new Error("Failed to fetch simulations");
      }
      const data = await response.json();
      setSimulationData(data);
      const processedData = processSimulationData(data);
      updateChartData(processedData);
      setLoadingSimulations(false);
    } catch (err) {
      setErrorSimulations(err.message);
      setLoadingSimulations(false);
    }
  };

  const processSimulationData = (data) => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return data
      .filter(simulation => new Date(simulation.start_time * 1000).getTime() >= sevenDaysAgo)
      .reduce((acc, simulation) => {
        const date = new Date(simulation.start_time * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  };

  const updateChartData = (processedData) => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = labels.map(label => processedData[label] || 0);

    setChartData({
      labels,
      datasets: { label: "Simulations", data },
    });
  };
  

  // Function to fetch requested services data
  const fetchRequestedServices = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/requested-services');
      if (!response.ok) {
        throw new Error("Failed to fetch requested services");
      }
      const data = await response.json();
      setRequestedServicesCount(data.length);
      setLoadingRequestedServices(false);
    } catch (err) {
      setErrorRequestedServices(err.message);
      setLoadingRequestedServices(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchTrucks();
    fetchSimulations();
    fetchRequestedServices();
  }, [role]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              {loadingTrucks ? (
                <ComplexStatisticsCard
                  color="info"
                  icon="local_shipping"
                  title="Trucks"
                  count="Loading..."
                  percentage={{
                    color: "info",
                    amount: "",
                    label: "",
                  }}
                />
              ) : errorTrucks ? (
                <ComplexStatisticsCard
                  color="error"
                  icon="error"
                  title="Trucks"
                  count="Error"
                  percentage={{
                    color: "error",
                    amount: "",
                    label: errorTrucks,
                  }}
                />
              ) : (
                <ComplexStatisticsCard
                  color="dark"
                  icon="local_shipping"
                  title="Trucks"
                  count={trucks.length}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              {loadingRequestedServices ? (
                <ComplexStatisticsCard
                  icon="request_quote"
                  title="Requested Services"
                  count="Loading..."
                  percentage={{
                    color: "info",
                    amount: "",
                    label: "",
                  }}
                />
              ) : errorRequestedServices ? (
                <ComplexStatisticsCard
                  color="error"
                  icon="error"
                  title="Requested Services"
                  count="Error"
                  percentage={{
                    color: "error",
                    amount: "",
                    label: errorRequestedServices,
                  }}
                />
              ) : (
                <ComplexStatisticsCard
                  icon="request_quote"
                  title="Requested Services"
                  count={requestedServicesCount}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              {loadingSchedules ? (
                <ComplexStatisticsCard
                  color="info"
                  icon="schedule"
                  title="Schedules"
                  count="Loading..."
                  percentage={{
                    color: "info",
                    amount: "",
                    label: "",
                  }}
                />
              ) : errorSchedules ? (
                <ComplexStatisticsCard
                  color="error"
                  icon="error"
                  title="Schedules"
                  count="Error"
                  percentage={{
                    color: "error",
                    amount: "",
                    label: errorSchedules,
                  }}
                />
              ) : (
                <ComplexStatisticsCard
                  color="success"
                  icon="schedule"
                  title="Schedules"
                  count={scheduleCount}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              {loadingSimulations ? (
                <ComplexStatisticsCard
                  color="info"
                  icon="science"
                  title="Simulations"
                  count="Loading..."
                  percentage={{
                    color: "info",
                    amount: "",
                    label: "",
                  }}
                />
              ) : errorSimulations ? (
                <ComplexStatisticsCard
                  color="error"
                  icon="error"
                  title="Simulations"
                  count="Error"
                  percentage={{
                    color: "error",
                    amount: "",
                    label: errorSimulations,
                  }}
                />
              ) : (
                <ComplexStatisticsCard
                  color="primary"
                  icon="science"
                  title="Simulations"
                  count={simulationData.length}
                   percentage={{
                     color: "success",
                     amount: "",
                     label: "Just updated",
                   }}
                 />
               )}
             </MDBox>
           </Grid>
         </Grid>
         <MDBox mt={4.5}>
           <Grid container spacing={3}>
             <Grid item xs={12} md={6} lg={4}>
               <MDBox mb={3}>
               <ReportsBarChart color="info" title="Simulations in Last Week" description="Number of simulations per day" chart={chartData} />
               </MDBox>
             </Grid>
             <Grid item xs={12} md={6} lg={4}>
               <MDBox mb={3}>
               <VerticalBarChart
                  icon={{ component: "local_shipping", color: "secondary" }}
                  title="Truck Status Overview"
                  description="Count of trucks by status"
                  height="15rem"
                  chart={processTruckData(trucks)}
                />
               </MDBox>
             </Grid>
             <Grid item xs={12} md={6} lg={4}>
               <MDBox mb={3}>
               <PieChart
                icon={{ component: "pie_chart", color: "primary" }}
                title="Service Requests Status"
                description="Distribution of service requests"
                height="15rem"
                chart={serviceRequestData}
              />
               </MDBox>
             </Grid>
           </Grid>
         </MDBox>
         <MDBox>
           <Grid container spacing={3}>
             <Grid item xs={12} md={6} lg={8}>
              <Trucks trucksData={trucks} loading={loadingTrucks} error={errorTrucks} />
             </Grid>
             <Grid item xs={12} md={6} lg={4}>
             <SimulationOverview
                simulationData={simulationData}
                loading={loadingSimulations}
                error={errorSimulations}
              />
             </Grid>
           </Grid>
         </MDBox>
       </MDBox>
     </DashboardLayout>
   );
 }

 export default Dashboard;