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
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const paymentTypes = [
  { value: "TAX", label: "الضريبة" },
  { value: "INSURANCE", label: "التأمين" },
  { value: "REGISTRATION", label: "التسجيل" },
];

const paymentStatusOptions = [
  { value: "PAID", label: "تم دفعها" },
  { value: "UNPAID", label: "لم يتم دفعها بعد" },
  { value: "ALL", label: "الجميع" },
];

const columnsPayments = [
  { col: "نوع الدفع", row: "paymentType" },
  { col: "تم الدفع بالكامل", row: "isFullPaid" },
  { col: "المبلغ المدفوع", row: "paidAmount" },
  { col: "التكلفة", row: "amount" },
  { col: "الوحدة", row: "unitNumber" },
  { col: "رقم عقد الإيجار", row: "rentAgreementNumber" },
];

const PaymentsReport = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");
  const [reportData, setReportData] = useState(null);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  console.log(reportData, "reported");
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

  const handlePropertyChange = async (e) => {
    const propertyId = e.target.value;
    setSelectedProperty(propertyId);
    setSelectedUnits([]);
    setUnits([]);

    try {
      const resUnits = await fetch(
        `/api/fast-handler?id=unit&propertyId=${propertyId}`,
      );
      const dataUnits = await resUnits.json();
      const dataWithLabel = dataUnits.map((item) => ({
        ...item,
        label: item.number,
      }));
      setUnits(dataWithLabel);
    } catch (error) {
      console.error("Failed to fetch units", error);
    }
  };

  const handleGenerateReport = async () => {
    setSubmitLoading(true);
    const filters = {
      propertyId: selectedProperty,
      unitIds: selectedUnits,
      paymentTypes: selectedPaymentTypes,
      paymentStatus: selectedPaymentStatus,
    };

    try {
      const res = await fetch(
        `/api/main/reports/payments?filters=${JSON.stringify(filters)}`,
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
    documentTitle: "تقرير المدفوعات",
  });

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

  if (loading) return <CircularProgress />;
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          إنشاء تقرير المدفوعات
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>العقار</InputLabel>
          <Select value={selectedProperty} onChange={handlePropertyChange}>
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedProperty && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>الوحدات</InputLabel>
              <Select
                multiple
                value={selectedUnits}
                onChange={(e) => setSelectedUnits(e.target.value)}
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>نوع الدفع</InputLabel>
              <Select
                multiple
                value={selectedPaymentTypes}
                onChange={(e) => setSelectedPaymentTypes(e.target.value)}
              >
                {paymentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>حالة الدفع</InputLabel>
              <Select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              >
                {paymentStatusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

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
            {renderTable(reportData, columnsPayments)}
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

export default PaymentsReport;
