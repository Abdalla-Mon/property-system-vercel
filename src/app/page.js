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
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
import { formatCurrencyAED } from "@/helpers/functions/convertMoneyToArabic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const Dashboard = () => {
  const theme = useTheme();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [rentedUnits, setRentedUnits] = useState([]);
  const [nonRentedUnits, setNonRentedUnits] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingIncome, setLoadingIncome] = useState(true);
  const [loadingTotalExpenses, setLoadingTotalExpenses] = useState(true);
  const [loadingTotalIncome, setLoadingTotalIncome] = useState(true);
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

  const renderIncomeChart = () => {
    const labels = income.map((inc) =>
      new Date(inc.date).toLocaleDateString("ar-AE"),
    );

    const incomeData = income.map((inc) => inc.amount);

    return (
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: "الدخل",
              data: incomeData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            datalabels: {
              display: false, // Disable datalabels
            },
          },
        }}
      />
    );
  };

  const renderExpenseChart = () => {
    const labels = expenses.map((exp) =>
      new Date(exp.date).toLocaleDateString("ar-AE"),
    );

    const expenseData = expenses.map((exp) => exp.amount);

    return (
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: "المصاريف",
              data: expenseData,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            datalabels: {
              display: false, // Disable datalabels
            },
          },
        }}
      />
    );
  };

  const renderCombinedBarChart = () => {
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
      <Bar
        data={{
          labels: ["إجمالي الدخل", "إجمالي المصاريف"],
          datasets: [
            {
              label: "المصاريف",
              data: [0, totalExpenses],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "الدخل",
              data: [totalIncome, 0],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            datalabels: {
              display: false, // Disable datalabels
            },
          },
        }}
      />
    );
  };

  const renderDoughnutChart = (data, title) => {
    const onTimePayments = data.filter(
      (payment) => payment.status === "PAID_ON_TIME",
    );
    const latePayments = data.filter(
      (payment) => payment.status === "PAID_LATE",
    );

    return (
      <Doughnut
        data={{
          labels: ["في الوقت", "متأخر"],
          datasets: [
            {
              label: title,
              data: [
                onTimePayments.reduce(
                  (sum, payment) => sum + payment.amount,
                  0,
                ),
                latePayments.reduce((sum, payment) => sum + payment.amount, 0),
              ],
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
            datalabels: {
              anchor: "end",
              align: "end",
              formatter: (value) => `${formatCurrencyAED(value)} `,
            },
          },
          cutout: "70%",
        }}
      />
    );
  };

  const renderCard = (title, content, backgroundColor) => (
    <Card
      sx={{
        minHeight: 200,
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
                    value={selectedProperty || ""}
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
              "إجمالي الدخل",
              loadingIncome ? (
                <CircularProgress />
              ) : (
                <Typography variant="h5">{`${formatCurrencyAED(
                  income.reduce((sum, inc) => sum + inc.amount, 0),
                )} `}</Typography>
              ),
            )}
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            {renderCard(
              "إجمالي المصاريف",
              loadingExpenses ? (
                <CircularProgress />
              ) : (
                <Typography variant="h5">{`${formatCurrencyAED(
                  expenses.reduce((sum, exp) => sum + exp.amount, 0),
                )} `}</Typography>
              ),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            {renderCard(
              "الدخل الشهري",
              loadingIncome ? <CircularProgress /> : renderIncomeChart(),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            {renderCard(
              "المصاريف الشهرية",
              loadingExpenses ? <CircularProgress /> : renderExpenseChart(),
            )}
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            {renderCard(
              "الدخل والمصاريف الإجمالية لهذا الشهر",
              loadingIncome || loadingExpenses ? (
                <CircularProgress />
              ) : (
                renderCombinedBarChart()
              ),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {renderCard(
              "دفعات الإيجار المدفوعة لهذا الشهر",
              loadingPayments ? (
                <CircularProgress />
              ) : (
                renderDoughnutChart(
                  payments?.filter((payment) => payment.paymentType === "RENT"),
                  "دفعات الإيجار",
                )
              ),
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {renderCard(
              "دفعات الصيانة لهذا الشهر",
              loadingPayments ? (
                <CircularProgress />
              ) : (
                renderDoughnutChart(
                  payments?.filter(
                    (payment) => payment.paymentType === "MAINTENANCE",
                  ),
                  "دفعات الصيانة",
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
