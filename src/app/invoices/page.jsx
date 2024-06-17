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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import InvoicePrint from "./InvoicePrint"; // Import the InvoicePrint component

const InvoicePage = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const componentRef = useRef();
  const printRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const resProperties = await fetch("/api/fast-handler?id=properties");
        const dataProperties = await resProperties.json();
        setProperties(Array.isArray(dataProperties) ? dataProperties : []);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
      setLoading(false);
    }

    fetchProperties();
  }, []);

  const fetchUnits = async (propertyId) => {
    try {
      const resUnits = await fetch(
        `/api/fast-handler?id=unit&propertyId=${propertyId}`,
      );
      const dataUnits = await resUnits.json();
      setUnits(Array.isArray(dataUnits) ? dataUnits : []);
    } catch (error) {
      console.error("Failed to fetch units", error);
    }
  };

  const handlePropertyChange = (event) => {
    const propertyId = event.target.value;
    setSelectedProperty(propertyId);
    fetchUnits(propertyId);
  };

  const handleGenerateInvoices = async () => {
    setSubmitLoading(true);
    const filters = {
      unitIds: selectedUnits,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const res = await fetch(
        `/api/main/invoices?filters=${JSON.stringify(filters)}`,
      );
      const data = await res.json();
      setInvoices(data.data);
    } catch (error) {
      console.error("Failed to generate invoices", error);
    }
    setSubmitLoading(false);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "فاتورة",
  });

  const renderInvoices = (invoices) => (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>رقم الفاتورة</TableCell>
            <TableCell>تاريخ الفاتورة</TableCell>
            <TableCell>المبلغ</TableCell>
            <TableCell>وصف</TableCell>
            <TableCell>طباعة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>
                {new Date(invoice.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>{invoice.description}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setCurrentInvoice(invoice);
                    handlePrint();
                  }}
                >
                  طباعة
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
          جلب الفواتير
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>العقارات</InputLabel>
          <Select value={selectedProperty} onChange={handlePropertyChange}>
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>الوحدات</InputLabel>
          <Select
            multiple
            value={selectedUnits}
            onChange={(e) => setSelectedUnits(e.target.value)}
          >
            {units.map((unit) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
            <DatePicker
              label="تاريخ البدء"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="تاريخ الانتهاء"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateInvoices}
          disabled={submitLoading}
        >
          {submitLoading ? <CircularProgress size={24} /> : "جلب الفواتير"}
        </Button>

        {invoices.length > 0 && (
          <Box sx={{ mt: 4, p: 2, border: "1px solid #ddd" }}>
            {renderInvoices(invoices)}
          </Box>
        )}

        {currentInvoice && (
          <div style={{ display: "none" }}>
            <InvoicePrint ref={printRef} invoice={currentInvoice} />
          </div>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success">
            تم جلب الفواتير بنجاح!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default InvoicePage;
