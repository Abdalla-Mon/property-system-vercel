"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import { useReactToPrint } from "react-to-print";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const columnsPropertyDetails = [
  { col: "رقم التعريف", row: "id" },
  { col: "الاسم", row: "name" },
  { col: "الموقع", row: "location" },
  { col: "المساحة المبنية", row: "builtArea" },
  { col: "السعر", row: "price" },
  { col: "عدد المصاعد", row: "numElevators" },
  { col: "عدد مواقف السيارات", row: "numParkingSpaces" },
];

const columnsUnits = [
  { col: "رقم الوحدة", row: "id" },
  { col: "الطابق", row: "number" },
  { col: "الإيجار السنوي", row: "yearlyRentPrice" },
  { col: "عدد غرف النوم", row: "numBedrooms" },
  { col: "عدد الحمامات", row: "numBathrooms" },
  { col: "عدد أجهزة التكييف", row: "numACs" },
  { col: "عدد غرف المعيشة", row: "numLivingRooms" },
  { col: "الحالة", row: "status" },
];

const columnsRentAgreements = [
  { col: "رقم التعريف", row: "id" },
  { col: "رقم عقد الإيجار", row: "rentAgreementNumber" },
  { col: "تاريخ البدء", row: "startDate" },
  { col: "تاريخ الانتهاء", row: "endDate" },
  { col: "إجمالي السعر", row: "totalPrice" },
  { col: "الحالة", row: "status" },
];

const Reports = () => {
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [reportData, setReportData] = useState(null);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resProperties = await fetch("/api/fast-handler?id=properties");
        const dataProperties = await resProperties.json();
        setProperties(dataProperties);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    setSubmitLoading(true);
    const filters = {
      propertyId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const res = await fetch(
        `/api/main/reports?filters=${JSON.stringify(filters)}`,
      );
      const data = await res.json();
      setReportData(data.data);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to generate report", error);
    }
    setSubmitLoading(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "تقرير العقار",
  });

  const renderChart = (data, title, backgroundColor) => (
    <Bar
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

  const renderTable = (data, columns) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.row}>{col.col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.row}>{row[col.row]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderComparisonChart = (income, expenses) => (
    <Box sx={{ width: 400, height: 400, mx: "auto" }}>
      <Doughnut
        data={{
          labels: ["الدخل", "المصروفات"],
          datasets: [
            {
              data: [
                income.reduce((sum, i) => sum + i.amount, 0),
                expenses.reduce((sum, e) => sum + e.amount, 0),
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
          },
          cutout: "70%",
        }}
      />
    </Box>
  );

  if (loading) return <CircularProgress />;
  console.log(reportData, "reportData");
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          إنشاء التقارير
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>العقارات</InputLabel>
          <Select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          >
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="تاريخ البدء"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="تاريخ الانتهاء"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
        </LocalizationProvider>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          disabled={submitLoading}
        >
          {submitLoading ? <CircularProgress size={24} /> : "إنشاء التقرير"}
        </Button>

        {reportData && (
          <Box
            sx={{ mt: 4, p: 2, border: "1px solid #ddd" }}
            ref={componentRef}
          >
            <Box sx={{ my: 2 }}>
              <Typography variant="h6">
                تقرير من المدة {startDate.format("DD/MM/YYYY")} إلى{" "}
                {endDate.format("DD/MM/YYYY")}
              </Typography>
            </Box>
            <Box
              sx={{
                mb: 4,
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                تفاصيل المالك
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                <strong>اسم المالك:</strong> {reportData.client?.name}
                <strong> هوية المالك:</strong> {reportData.client?.nationalId}
                <strong> ايميل المالك:</strong> {reportData.client?.email}
                <strong> رقمة هاتف المالك:</strong> {reportData.client?.phone}
              </Typography>
            </Box>

            <Typography variant="h6">{reportData.name}</Typography>
            <Typography variant="subtitle1" className={"mt-3"}>
              تفاصيل العقار
            </Typography>
            {renderTable([reportData], columnsPropertyDetails)}
            <Typography variant="subtitle1" className={"mt-3"}>
              الوحدات
            </Typography>
            {renderTable(reportData.units, columnsUnits)}

            <Typography variant="subtitle1" className={"mt-3"}>
              عقود الإيجار
            </Typography>
            {renderTable(
              reportData.units.flatMap((unit) => unit.rentAgreements),
              columnsRentAgreements,
            )}

            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">الدخل</Typography>
                {renderChart(
                  reportData.income.map((income) => ({
                    label: new Date(income.date).toLocaleDateString(),
                    value: income.amount,
                  })),
                  "الدخل",
                  "rgba(75, 192, 192, 0.6)",
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">المصروفات</Typography>
                {renderChart(
                  reportData.expenses.map((expense) => ({
                    label: new Date(expense.date).toLocaleDateString(),
                    value: expense.amount,
                  })),
                  "المصروفات",
                  "rgba(255, 99, 132, 0.6)",
                )}
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 4 }}>
              مقارنة بين الدخل والمصروفات
            </Typography>
            {renderComparisonChart(reportData.income, reportData.expenses)}
          </Box>
        )}

        <Button variant="contained" color="secondary" onClick={handlePrint}>
          طباعة التقرير
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success">
            تم إنشاء التقرير بنجاح!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Reports;
