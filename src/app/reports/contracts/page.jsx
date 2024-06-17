"use client";
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

// Import necessary components from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const columnsRentAgreements = [
  { col: "رقم عقد الإيجار", row: "rentAgreementNumber" },
  { col: "تاريخ البدء", row: "startDate" },
  { col: "تاريخ الانتهاء", row: "endDate" },
  { col: "الحالة", row: "customStatus" },
];

const RentAgreementsReport = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
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
      propertyIds: selectedProperties,
    };

    try {
      const res = await fetch(
        `/api/main/reports/rents?filters=${JSON.stringify(filters)}`,
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
    documentTitle: "تقرير عقود الإيجار",
  });

  const renderTable = (data, columns) => (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
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
                <TableCell key={col.row}>
                  {col.row.includes("Date")
                    ? new Date(row[col.row]).toLocaleDateString()
                    : row[col.row]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderComparisonChart = (rentAgreements) => {
    const labels = ["المبلغ الكلي", "المدفوع", "المتبقي"];
    const datasets = rentAgreements.map((agreement, index) => {
      const totalAmount = agreement.payments.reduce(
        (acc, payment) => acc + payment.amount,
        0,
      );
      const paidAmount = agreement.payments.reduce(
        (acc, payment) => acc + payment.paidAmount,
        0,
      );
      const unpaidAmount = totalAmount - paidAmount;

      const paymentData = [totalAmount, paidAmount, unpaidAmount];

      return {
        label: `عقد الإيجار ${agreement.rentAgreementNumber}`,
        data: paymentData,
        backgroundColor: [
          `rgba(${75 + index * 40}, ${192 - index * 40}, ${192 - index * 40}, 0.6)`,
          `rgba(${75 + index * 40}, ${192 - index * 40}, ${192 - index * 40}, 0.3)`,
          `rgba(${75 + index * 40}, ${192 - index * 40}, ${192 - index * 40}, 0.1)`,
        ],
      };
    });

    return (
      <Bar
        data={{
          labels: labels,
          datasets: datasets,
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
  };

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
          إنشاء تقرير عقود الإيجار
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
            {reportData.map((property) => (
              <div key={property.id}>
                <Typography variant="h6" gutterBottom>
                  {property.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  عقود الإيجار
                </Typography>
                {property.units.map((unit) => (
                  <div key={unit.id}>
                    <Typography variant="subtitle1" gutterBottom>
                      وحدة: {unit.number}
                    </Typography>
                    {renderTable(unit.rentAgreements, columnsRentAgreements)}
                    <Typography variant="subtitle1" gutterBottom>
                      إحصائيات المدفوعات
                    </Typography>
                    {renderComparisonChart(unit.rentAgreements)}
                  </div>
                ))}
              </div>
            ))}
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

export default RentAgreementsReport;
