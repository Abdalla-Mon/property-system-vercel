export default function HOME() {
  return <div>home</div>;
}

// "use client";
// import { useEffect, useState } from "react";
// import {
//   Container,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Box,
//   Typography,
//   CircularProgress,
//   Grid,
// } from "@mui/material";
// import { Bar, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
//
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// );
//
// const Dashboard = () => {
//   const [properties, setProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState("");
//
//   const [expenses, setExpenses] = useState([]);
//   const [income, setIncome] = useState([]);
//   const [rentedUnits, setRentedUnits] = useState([]);
//   const [nonRentedUnits, setNonRentedUnits] = useState([]);
//   const [payments, setPayments] = useState([]);
//
//   const [loadingExpenses, setLoadingExpenses] = useState(true);
//   const [loadingIncome, setLoadingIncome] = useState(true);
//   const [loadingRentedUnits, setLoadingRentedUnits] = useState(true);
//   const [loadingNonRentedUnits, setLoadingNonRentedUnits] = useState(true);
//   const [loadingPayments, setLoadingPayments] = useState(true);
//
//   useEffect(() => {
//     async function fetchProperties() {
//       try {
//         const res = await fetch("/api/fast-handler?id=properties");
//         const data = await res.json();
//         setProperties(data.data);
//       } catch (error) {
//         console.error("Failed to fetch properties", error);
//       }
//     }
//
//     fetchProperties();
//   }, []);
//
//   useEffect(() => {
//     async function fetchExpenses() {
//       setLoadingExpenses(true);
//       try {
//         const propertyParam = selectedProperty
//           ? `&propertyId=${selectedProperty}`
//           : "";
//         const res = await fetch(`/api/main/home/expenses?${propertyParam}`);
//         const data = await res.json();
//         setExpenses(data.data);
//       } catch (error) {
//         console.error("Failed to fetch expenses", error);
//       }
//       setLoadingExpenses(false);
//     }
//
//     fetchExpenses();
//   }, [selectedProperty]);
//
//   useEffect(() => {
//     async function fetchIncome() {
//       setLoadingIncome(true);
//       try {
//         const propertyParam = selectedProperty
//           ? `&propertyId=${selectedProperty}`
//           : "";
//         const res = await fetch(`/api/main/home/income?${propertyParam}`);
//         const data = await res.json();
//         setIncome(data.data);
//       } catch (error) {
//         console.error("Failed to fetch income", error);
//       }
//       setLoadingIncome(false);
//     }
//
//     fetchIncome();
//   }, [selectedProperty]);
//
//   useEffect(() => {
//     async function fetchRentedUnits() {
//       setLoadingRentedUnits(true);
//       try {
//         const propertyParam = selectedProperty
//           ? `&propertyId=${selectedProperty}`
//           : "";
//         const res = await fetch(`/api/main/home/rentedUnits?${propertyParam}`);
//         const data = await res.json();
//         setRentedUnits(data.data);
//       } catch (error) {
//         console.error("Failed to fetch rented units", error);
//       }
//       setLoadingRentedUnits(false);
//     }
//
//     fetchRentedUnits();
//   }, [selectedProperty]);
//
//   useEffect(() => {
//     async function fetchNonRentedUnits() {
//       setLoadingNonRentedUnits(true);
//       try {
//         const propertyParam = selectedProperty
//           ? `&propertyId=${selectedProperty}`
//           : "";
//         const res = await fetch(
//           `/api/main/home/nonRentedUnits?${propertyParam}`,
//         );
//         const data = await res.json();
//         setNonRentedUnits(data.data);
//       } catch (error) {
//         console.error("Failed to fetch non-rented units", error);
//       }
//       setLoadingNonRentedUnits(false);
//     }
//
//     fetchNonRentedUnits();
//   }, [selectedProperty]);
//
//   useEffect(() => {
//     async function fetchPayments() {
//       setLoadingPayments(true);
//       try {
//         const propertyParam = selectedProperty
//           ? `&propertyId=${selectedProperty}`
//           : "";
//         const res = await fetch(`/api/main/home/payments?${propertyParam}`);
//         const data = await res.json();
//         setPayments(data.data);
//       } catch (error) {
//         console.error("Failed to fetch payments", error);
//       }
//       setLoadingPayments(false);
//     }
//
//     fetchPayments();
//   }, [selectedProperty]);
//
//   const handlePropertyChange = (event) => {
//     setSelectedProperty(event.target.value);
//   };
//
//   const renderBarChart = (data, title, backgroundColor) => (
//     <Bar
//       data={{
//         labels: data.map((d) => d.label),
//         datasets: [
//           {
//             label: title,
//             data: data.map((d) => d.value),
//             backgroundColor: backgroundColor,
//           },
//         ],
//       }}
//       options={{
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "top",
//           },
//         },
//       }}
//     />
//   );
//
//   const renderDoughnutChart = (data, title) => (
//     <Doughnut
//       data={{
//         labels: ["في الوقت", "متأخر"],
//         datasets: [
//           {
//             label: title,
//             data: [
//               data
//                 .filter((payment) => payment.status === "PAID")
//                 .reduce((sum, payment) => sum + payment.amount, 0),
//               data
//                 .filter((payment) => payment.status === "OVERDUE")
//                 .reduce((sum, payment) => sum + payment.amount, 0),
//             ],
//             backgroundColor: [
//               "rgba(75, 192, 192, 0.6)",
//               "rgba(255, 99, 132, 0.6)",
//             ],
//           },
//         ],
//       }}
//       options={{
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "top",
//           },
//         },
//         cutout: "70%",
//       }}
//     />
//   );
//
//   return (
//     <Container>
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           لوحة القيادة
//         </Typography>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>اختر العقار</InputLabel>
//           <Select
//             value={selectedProperty}
//             onChange={handlePropertyChange}
//             displayEmpty
//           >
//             <MenuItem value="">
//               <em>جميع العقارات</em>
//             </MenuItem>
//             {properties?.map((property) => (
//               <MenuItem key={property.id} value={property.id}>
//                 {property.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6} lg={4}>
//             <Typography variant="h6" gutterBottom>
//               المصاريف
//             </Typography>
//             {loadingExpenses ? (
//               <CircularProgress />
//             ) : (
//               renderBarChart(
//                 expenses.map((expense) => ({
//                   label: new Date(expense.date).toLocaleDateString("ar-EG"),
//                   value: expense.amount,
//                 })),
//                 "المصاريف",
//                 "rgba(255, 99, 132, 0.6)",
//               )
//             )}
//           </Grid>
//
//           <Grid item xs={12} md={6} lg={4}>
//             <Typography variant="h6" gutterBottom>
//               الدخل
//             </Typography>
//             {loadingIncome ? (
//               <CircularProgress />
//             ) : (
//               renderBarChart(
//                 income.map((inc) => ({
//                   label: new Date(inc.date).toLocaleDateString("ar-EG"),
//                   value: inc.amount,
//                 })),
//                 "الدخل",
//                 "rgba(75, 192, 192, 0.6)",
//               )
//             )}
//           </Grid>
//
//           <Grid item xs={12} md={6} lg={4}>
//             <Typography variant="h6" gutterBottom>
//               الوحدات المؤجرة
//             </Typography>
//             {loadingRentedUnits ? (
//               <CircularProgress />
//             ) : (
//               <Typography variant="body1">{rentedUnits.length}</Typography>
//             )}
//           </Grid>
//
//           <Grid item xs={12} md={6} lg={4}>
//             <Typography variant="h6" gutterBottom>
//               الوحدات الشاغرة
//             </Typography>
//             {loadingNonRentedUnits ? (
//               <CircularProgress />
//             ) : (
//               <Typography variant="body1">{nonRentedUnits.length}</Typography>
//             )}
//           </Grid>
//
//           <Grid item xs={12} md={6} lg={4}>
//             <Typography variant="h6" gutterBottom>
//               مدفوعات الإيجار
//             </Typography>
//             {loadingPayments ? (
//               <CircularProgress />
//             ) : (
//               renderDoughnutChart(
//                 payments.filter((payment) => payment.paymentType === "RENT"),
//                 "مدفوعات الإيجار",
//               )
//             )}
//           </Grid>
//
//           <Grid item xs={12} md={6} lg={4}>
//             <Typography variant="h6" gutterBottom>
//               مدفوعات الصيانة
//             </Typography>
//             {loadingPayments ? (
//               <CircularProgress />
//             ) : (
//               renderDoughnutChart(
//                 payments.filter(
//                   (payment) => payment.paymentType === "MAINTENANCE",
//                 ),
//                 "مدفوعات الصيانة",
//               )
//             )}
//           </Grid>
//
//           <Grid item xs={12} md={6} lg={4}>
//             <Typography variant="h6" gutterBottom>
//               المدفوعات الأخرى (الضرائب، التأمين، التسجيل)
//             </Typography>
//             {loadingPayments ? (
//               <CircularProgress />
//             ) : (
//               renderDoughnutChart(
//                 payments.filter((payment) =>
//                   ["TAX", "INSURANCE", "REGISTRATION"].includes(
//                     payment.paymentType,
//                   ),
//                 ),
//                 "المدفوعات الأخرى",
//               )
//             )}
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//   );
// };
//
// export default Dashboard;
