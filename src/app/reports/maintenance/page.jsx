"use client";
import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import "dayjs/locale/en-gb";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MaintenanceReports = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const componentRef = useRef();

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
      propertyIds: selectedProperties,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const res = await fetch(
        `/api/main/reports/maintenance?filters=${JSON.stringify(filters)}`,
      );
      const data = await res.json();
      setReportData(data.data);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to generate report", error);
    }
    setSubmitLoading(false);
  };

  const renderTable = (data) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>صيانة</TableCell>
            <TableCell>رقم الوحدة</TableCell>
            <TableCell>تاريخ الصيانة</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>المبلغ</TableCell>
            <TableCell>المبلغ المدفوع</TableCell>
            <TableCell>ميعاد الدفع</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.unitNumber}</TableCell>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell>
                {row.paidAmount === row.amount
                  ? "مدفوع بالكامل"
                  : row.paidAmount > 0
                    ? "مدفوع جزئيا"
                    : "قيد الانتظار"}
              </TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.paidAmount}</TableCell>
              <TableCell>
                {new Date(row.dueDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderChart = (totalAmount, totalPaid) => {
    const data = {
      labels: ["إجمالي المبلغ", "المبلغ المدفوع", "المبلغ المتبقي"],
      datasets: [
        {
          label: "تكاليف الصيانة",
          data: [totalAmount, totalPaid, totalAmount - totalPaid],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    };

    return (
      <Box sx={{ width: "100%", height: "400px", margin: "auto" }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
          }}
        />
      </Box>
    );
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) return <CircularProgress />;
  return (
    <Container
      sx={{
        p: {
          xs: 0,
          md: 1,
        },
      }}
    >
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          إنشاء تقارير الصيانة
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>العقارات</InputLabel>
          <Select
            multiple
            value={selectedProperties}
            onChange={(e) => setSelectedProperties(e.target.value)}
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
      </Box>

      <Box ref={componentRef}>
        {reportData && (
          <Box sx={{ mt: 4, p: 2, border: "1px solid #ddd" }}>
            {reportData.map((property) => {
              const totalAmount = property.maintenances.reduce(
                (acc, maintenance) =>
                  acc +
                  maintenance.payments.reduce(
                    (sum, payment) => sum + payment.amount,
                    0,
                  ),
                0,
              );
              const totalPaid = property.maintenances.reduce(
                (acc, maintenance) =>
                  acc +
                  maintenance.payments.reduce(
                    (sum, payment) => sum + payment.paidAmount,
                    0,
                  ),
                0,
              );

              return (
                <Box key={property.id} sx={{ mb: 4 }}>
                  <Typography variant="h6">{property.name}</Typography>
                  {renderTable(
                    property.maintenances.flatMap((maintenance) =>
                      maintenance.payments.map((payment) => ({
                        description: maintenance.description,
                        date: maintenance.date,
                        amount: payment.amount,
                        paidAmount: payment.paidAmount,
                        dueDate: payment.dueDate,
                        status: payment.status,
                        unitNumber: maintenance.unit.number,
                      })),
                    ),
                  )}
                  {renderChart(totalAmount, totalPaid)}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

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
    </Container>
  );
};

export default MaintenanceReports;
