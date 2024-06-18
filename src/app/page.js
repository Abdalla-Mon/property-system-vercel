"use client";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Container,
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const theme = useTheme();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [rentedUnits, setRentedUnits] = useState([]);
  const [nonRentedUnits, setNonRentedUnits] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingIncome, setLoadingIncome] = useState(true);
  const [loadingRentedUnits, setLoadingRentedUnits] = useState(true);
  const [loadingNonRentedUnits, setLoadingNonRentedUnits] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/fast-handler?id=properties");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
    }

    fetchProperties();
  }, []);

  useEffect(() => {
    async function fetchExpenses() {
      setLoadingExpenses(true);
      try {
        const propertyParam = selectedProperty
          ? `&propertyId=${selectedProperty}`
          : "";
        const res = await fetch(`/api/main/home/expenses?${propertyParam}`);
        const data = await res.json();
        setExpenses(data.data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      }
      setLoadingExpenses(false);
    }

    fetchExpenses();
  }, [selectedProperty]);

  useEffect(() => {
    async function fetchIncome() {
      setLoadingIncome(true);
      try {
        const propertyParam = selectedProperty
          ? `&propertyId=${selectedProperty}`
          : "";
        const res = await fetch(`/api/main/home/income?${propertyParam}`);
        const data = await res.json();
        setIncome(data.data);
      } catch (error) {
        console.error("Failed to fetch income", error);
      }
      setLoadingIncome(false);
    }

    fetchIncome();
  }, [selectedProperty]);

  useEffect(() => {
    async function fetchRentedUnits() {
      setLoadingRentedUnits(true);
      try {
        const propertyParam = selectedProperty
          ? `&propertyId=${selectedProperty}`
          : "";
        const res = await fetch(`/api/main/home/rentedUnits?${propertyParam}`);
        const data = await res.json();
        setRentedUnits(data.data);
      } catch (error) {
        console.error("Failed to fetch rented units", error);
      }
      setLoadingRentedUnits(false);
    }

    fetchRentedUnits();
  }, [selectedProperty]);

  useEffect(() => {
    async function fetchNonRentedUnits() {
      setLoadingNonRentedUnits(true);
      try {
        const propertyParam = selectedProperty
          ? `&propertyId=${selectedProperty}`
          : "";
        const res = await fetch(
          `/api/main/home/nonRentedUnits?${propertyParam}`,
        );
        const data = await res.json();
        setNonRentedUnits(data.data);
      } catch (error) {
        console.error("Failed to fetch non-rented units", error);
      }
      setLoadingNonRentedUnits(false);
    }

    fetchNonRentedUnits();
  }, [selectedProperty]);

  useEffect(() => {
    async function fetchPayments() {
      setLoadingPayments(true);
      try {
        const propertyParam = selectedProperty
          ? `&propertyId=${selectedProperty}`
          : "";
        const res = await fetch(`/api/main/home/payments?${propertyParam}`);
        const data = await res.json();
        setPayments(data.data);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      }
      setLoadingPayments(false);
    }

    fetchPayments();
  }, [selectedProperty]);

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
  };

  const renderBarChart = (data, title, backgroundColor) => (
    <Bar
      style={{ height: "100%", width: "100%" }}
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: title,
            data: data.map((d) => d.value),
            backgroundColor: backgroundColor,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      }}
    />
  );

  const renderDoughnutChart = (data, title) => (
    <Doughnut
      data={{
        labels: ["في الوقت", "متأخر", "غير مدفوع"],
        datasets: [
          {
            label: title,
            data: [
              data
                .filter((payment) => payment.status === "PAID")
                .reduce((sum, payment) => sum + payment.amount, 0),
              data
                .filter((payment) => payment.status === "OVERDUE")
                .reduce((sum, payment) => sum + payment.amount, 0),
              data
                .filter((payment) => payment.status === "PENDING")
                .reduce((sum, payment) => sum + payment.amount, 0),
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 206, 86, 0.6)",
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        cutout: "70%",
      }}
    />
  );

  const renderCard = (title, content, backgroundColor) => (
    <Card
      sx={{
        minHeight: 350,
        minWidth: 250,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor || theme.palette.background.paper,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        }
        sx={{
          width: "100%",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          textAlign: "center",
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {content}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Box
        sx={{
          p: {
            xs: 1,
            md: 3,
          },
        }}
      >
        <Typography variant="h4" gutterBottom>
          لوحة الموقع
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <Card
              sx={{
                minHeight: 350,
                minWidth: 250,
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel>اختر العقار</InputLabel>
                  <Select
                    value={selectedProperty}
                    onChange={handlePropertyChange}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>جميع العقارات</em>
                    </MenuItem>
                    {properties?.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            {renderCard(
              "المصاريف",
              loadingExpenses ? (
                <CircularProgress />
              ) : (
                renderBarChart(
                  expenses?.map((expense) => ({
                    label: new Date(expense.date).toLocaleDateString("ar-AE"),
                    value: expense.amount,
                  })),
                  "المصاريف",
                  "rgba(255, 99, 132, 0.6)",
                )
              ),
            )}
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            {renderCard(
              "الدخل",
              loadingIncome ? (
                <CircularProgress />
              ) : (
                renderBarChart(
                  income.map((inc) => ({
                    label: new Date(inc.date).toLocaleDateString("ar-AE"),
                    value: inc.amount,
                  })),
                  "الدخل",
                  "rgba(75, 192, 192, 0.6)",
                )
              ),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {renderCard(
              "الوحدات المؤجرة والشاغرة",
              loadingRentedUnits || loadingNonRentedUnits ? (
                <CircularProgress />
              ) : (
                <Bar
                  data={{
                    labels: ["الوحدات المؤجرة", "الوحدات الشاغرة"],
                    datasets: [
                      {
                        label: "الوحدات",
                        data: [rentedUnits?.length, nonRentedUnits?.length],
                        backgroundColor: [
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(255, 99, 132, 0.6)",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              ),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {renderCard(
              "مدفوعات الإيجار",
              loadingPayments ? (
                <CircularProgress />
              ) : (
                renderDoughnutChart(
                  payments?.filter((payment) => payment.paymentType === "RENT"),
                  "مدفوعات الإيجار",
                )
              ),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {renderCard(
              "مدفوعات الصيانة",
              loadingPayments ? (
                <CircularProgress />
              ) : (
                renderDoughnutChart(
                  payments?.filter(
                    (payment) => payment.paymentType === "MAINTENANCE",
                  ),
                  "مدفوعات الصيانة",
                )
              ),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {renderCard(
              "المدفوعات الأخرى (الضرائب، التأمين، التسجيل)",
              loadingPayments ? (
                <CircularProgress />
              ) : (
                renderDoughnutChart(
                  payments?.filter((payment) =>
                    ["TAX", "INSURANCE", "REGISTRATION"].includes(
                      payment.paymentType,
                    ),
                  ),
                  "المدفوعات الأخرى",
                )
              ),
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
