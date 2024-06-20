"use client";
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import dayjs from "dayjs";
import { useFetchPayments } from "@/helpers/hooks/useFetchPayments";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { PaymentStatus, PaymentType } from "@/app/constants/Enums";
import { PaymentModal } from "@/app/UiComponents/Modals/PaymentModal";
import { updatePayment } from "@/services/client/updatePayment";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { getEndingRentAgreements } from "@/services/client/getEndingRentAgreements";
import Link from "next/link"; // Import the new service function
import "moment/locale/ar";
import { TableLoading } from "@/app/UiComponents/loaders/TableLoading"; // Import Arabic locale for moment

import { formatCurrencyAED } from "@/helpers/functions/convertMoneyToArabic";
import { useSubmitLoader } from "@/app/context/SubmitLoaderProvider/SubmitLoaderProvider";

moment.locale("ar"); // Set moment locale globally to Arabic
const localizer = momentLocalizer(moment);

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const { payments: rent, loading: rentLoading } = useFetchPayments("RENT");
  const { payments: maintenance, loading: maintenanceLoading } =
    useFetchPayments("MAINTENANCE");
  const { payments: other, loading: otherLoading } =
    useFetchPayments("RENTEXPENCES");
  const { payments: overdue, loading: overdueLoading } =
    useFetchPayments("OVERRUDE");
  const [endingAgreements, setEndingAgreements] = useState([]);
  const [endingAgreementsLoading, setEndingAgreementsLoading] = useState(true);

  useEffect(() => {
    const fetchEndingAgreements = async () => {
      setEndingAgreementsLoading(true);
      try {
        const { data } = await getEndingRentAgreements();
        setEndingAgreements(data);
      } catch (error) {
        console.error("Error fetching endingRents rent agreements:", error);
      } finally {
        setEndingAgreementsLoading(false);
      }
    };

    fetchEndingAgreements();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.start);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (action) => {
    let newDate;
    const currentDate = selectedDate || new Date();

    switch (view) {
      case Views.DAY:
        newDate =
          action === "next"
            ? moment(currentDate).add(1, "days").toDate()
            : moment(currentDate).subtract(1, "days").toDate();
        break;
      case Views.WEEK:
        newDate =
          action === "next"
            ? moment(currentDate).add(1, "weeks").toDate()
            : moment(currentDate).subtract(1, "weeks").toDate();
        break;
      case Views.MONTH:
        newDate =
          action === "next"
            ? moment(currentDate).add(1, "months").toDate()
            : moment(currentDate).subtract(1, "months").toDate();
        break;
      default:
        newDate = currentDate;
    }

    setSelectedDate(newDate);
  };

  const filterPaymentsByDate = (payments) => {
    if (!selectedDate) return payments;
    return payments.filter((payment) =>
      dayjs(payment.dueDate).isSame(selectedDate, "day"),
    );
  };

  const sortedPayments = (payments) => {
    return payments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const events = [...rent, ...maintenance, ...other, ...overdue].map(
    (payment) => ({
      title: `دفعة ${PaymentType[payment.paymentType]} خاصة بالوحدة رقم ${
        payment.rentAgreement?.unit.number || payment.unit?.number
      } للعقار ${payment.property?.name}`,
      start: new Date(payment.dueDate),
      end: new Date(payment.dueDate),
      allDay: true,
      resource: payment,
      isOverdue: overdue.includes(payment),
    }),
  );

  const eventPropGetter = (event) => {
    let style = {};
    if (event.isOverdue) {
      style = { backgroundColor: "#ffcccc" };
    }
    return { style };
  };

  return (
    <div className={"container mx-auto"}>
      <TableFormProvider url={"main/payments/"}>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            overflow: "auto",
          }}
        >
          <Box>
            <IconButton onClick={() => handleNavigate("prev")}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={() => handleNavigate("next")}>
              <NavigateNextIcon />
            </IconButton>
          </Box>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, flex: 1 }}
            onSelectEvent={handleDateChange}
            view={view}
            onView={handleViewChange}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            date={selectedDate || new Date()}
            eventPropGetter={eventPropGetter}
          />
        </Box>

        <PaymentSection
          payments={sortedPayments(filterPaymentsByDate(rent))}
          title="Rent Payments"
          description="فاتورة دفعة ايجار"
          heading="دفعات الايجار"
          loading={rentLoading}
          loadingMessage="جاري تحميل دفعات عقد الايجار"
        />

        <PaymentSection
          payments={sortedPayments(filterPaymentsByDate(maintenance))}
          title="Maintenance Payments"
          description="فاتورة الصيانة"
          heading="الصيانة"
          maintenance={true}
          loading={maintenanceLoading}
          loadingMessage="جاري تحميل دفعات الصيانة"
        />

        <PaymentSection
          payments={sortedPayments(filterPaymentsByDate(other))}
          title="Other Payments"
          description="فاتورة رسوم العقد"
          heading="رسوم العقد"
          loading={otherLoading}
          loadingMessage="جاري تحميل الدفعات الأخرى"
        />

        <PaymentSection
          payments={sortedPayments(overdue)}
          title="Overdue Payments"
          description="الدفعات المتأخرة"
          heading="الدفعات المتأخرة"
          overdue={true}
          loading={overdueLoading}
          loadingMessage="جاري تحميل الدفعات المتأخرة"
        />

        <EndingAgreementsSection
          agreements={endingAgreements}
          heading="اتفاقيات الايجار التي على وشك الانتهاء"
          loading={endingAgreementsLoading}
          loadingMessage="جاري تحميل اتفاقيات الايجار التي على وشك الانتهاء"
        />
      </TableFormProvider>
    </div>
  );
};

const PaymentSection = ({
  title,
  payments,
  maintenance,
  description,
  heading,
  overdue,
  loading,
  loadingMessage,
}) => {
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);
  const [modalInputs, setModalInputs] = useState([]);
  const { setOpenModal } = useTableForm();
  const { setMessage, setSeverity, setOpen } = useSubmitLoader();

  useEffect(() => {
    setData(payments);
  }, [payments]);

  const { setLoading: setSubmitLoading } = useToastContext();

  async function submit(d) {
    const currentPayment = data.find((item) => item.id === id);

    if (d.paymentTypeMethod !== "CASH") {
      if (
        !currentPayment.property.bankAccount ||
        currentPayment.property.bankAccount.length === 0
      ) {
        setOpen(true);
        setSeverity("error");
        setMessage(
          "لا يمكن اتمام هذه العمليه ليس هناك حساب بنكي مرتبط بهذا العقار",
        );
        return null;
      }
    }
    const submitData = {
      ...d,
      currentPaidAmount: +currentPayment.paidAmount,
      id,
      amount: currentPayment.amount,
      propertyId: currentPayment.propertyId,
      rentAgreementId: currentPayment.rentAgreementId,
      installmentId: currentPayment.installmentId,
      renterId: currentPayment.rentAgreement?.unit.client.id,
      ownerId: currentPayment.client.id,
      title: title,
      description: description,
      invoiceType: currentPayment.paymentType,
      bankId: currentPayment.property.bankAccount
        ? currentPayment.property.bankAccount[0]?.id
        : null,
      bankAccount: currentPayment.property.bankAccount
        ? currentPayment.property.bankAccount[0]?.accountNumber
        : null,
    };

    const newData = await updatePayment(submitData, setSubmitLoading);
    if (newData) {
      let updateData;
      if (newData.payment.paidAmount < newData.payment.amount) {
        updateData = data.map((item) => {
          if (item.id === id) {
            return {
              ...newData.payment,

              invoices: [...item.invoices, newData.invoice],
            };
          }
          return item;
        });
      } else {
        updateData = data.filter((item) => item.id !== id);
      }
      if (updateData) {
        setData(updateData);
        setOpenModal(false);
      }
    }
  }

  return (
    <Box sx={{ mt: 5, position: "relative", minHeight: 200 }}>
      {loading && <TableLoading loadingMessage={loadingMessage} />}
      <Typography variant="h5" gutterBottom>
        {heading}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "100vh",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="payment table">
          <TableHead>
            <TableRow>
              <TableCell>دفعه رقم</TableCell>
              <TableCell>ميعاد الدفع</TableCell>
              <TableCell>قيمة الدفعه</TableCell>
              <TableCell>ما تم دفعه</TableCell>
              <TableCell>الباقي</TableCell>
              <TableCell>النوع</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>اسم العقار</TableCell>
              <TableCell> رقم الوحدة</TableCell>
              <TableCell>
                {maintenance ? "اسم المالك" : "اسم المستأجر"}
              </TableCell>
              <TableCell>دفع</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => (
              <>
                <PaymentRow
                  maintenance={maintenance}
                  item={item}
                  setId={setId}
                  id={id}
                  setModalInputs={setModalInputs}
                  showName
                  index={index + 1}
                  overdue={overdue}
                  setOpenModal={setOpenModal}
                  key={item.id}
                />
                {item.invoices && item.invoices.length > 0 && (
                  <InvoiceRows invoices={item.invoices} index={index + 1} />
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaymentModal
        id={id}
        modalInputs={modalInputs}
        submit={submit}
        setId={setId}
      />
    </Box>
  );
};

const PaymentRow = ({
  item,
  setModalInputs,
  setId,
  index,
  overdue,
  setOpenModal,
}) => {
  const { openModal } = useTableForm();
  const [paymentType, setPaymentType] = useState("CASH");
  useEffect(() => {
    setPaymentType("CASH");
  }, [openModal]);

  const modalInputs = [
    {
      data: {
        name: "paidAmount",
        label: "القيمة المراد دفعها",
        type: "number",
        id: "paidAmount",
        defaultValue: (item.amount - item.paidAmount).toFixed(2),
      },
      pattern: {
        required: {
          value: true,
          message: "يرجى إدخال القيمة المراد دفعها",
        },
        max: {
          value: item.amount - item.paidAmount,
          message: `القيمة المراد دفعها يجب أن تكون أقل من ${
            item.amount - item.paidAmount
          } والتي هي القيمة المتبقية لهذه الدفعة`,
        },
      },
    },
    {
      data: {
        id: "paymentTypeMethod",
        type: "simpleSelect",
        label: "طريقة الدفع",
        name: "paymentTypeMethod",
        value: paymentType,
      },
      options: [
        { label: "كاش", value: "CASH" },
        { label: "تحويل بنكي", value: "BANK" },
        { label: "شيك", value: "CHEQUE" },
      ],
      onChange: (e) => {
        setPaymentType(e.target.value);
      },
      pattern: {
        required: {
          value: true,
          message: "يرجى إدخال طريقة الدفع",
        },
      },
      sx: {
        width: {
          xs: "100%",
          md: "48%",
        },
      },
    },
  ];

  useEffect(() => {
    if (paymentType === "CHEQUE") {
      setModalInputs([
        ...modalInputs,
        {
          data: {
            id: "chequeNumber",
            type: "text",
            label: "رقم الشيك ",
            name: "checkNumber",
          },
          pattern: {
            required: {
              value: true,
              message: "يرجى إدخال رقم الشيك",
            },
          },
          sx: {
            width: {
              xs: "100%",
              md: "48%",
            },
          },
        },
      ]);
    } else {
      setModalInputs(modalInputs);
    }
  }, [paymentType]);

  return (
    <TableRow hover sx={{ backgroundColor: "inherit" }}>
      <TableCell>{index}</TableCell>
      <TableCell>{dayjs(item.dueDate).format("DD/MM/YYYY")}</TableCell>
      <TableCell>{formatCurrencyAED(item.amount)}</TableCell>
      <TableCell>{formatCurrencyAED(item.paidAmount.toFixed(2))}</TableCell>
      <TableCell>
        {formatCurrencyAED((item.amount - item.paidAmount).toFixed(2))}
      </TableCell>
      <TableCell>{PaymentType[item.paymentType]}</TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            color: overdue
              ? "#ff1b1b"
              : item.status === "PAID"
                ? "green"
                : item.status === "PENDING"
                  ? "orange"
                  : "red",
            fontWeight: "bold",
          }}
        >
          {overdue ? "دفعه متاخرة" : PaymentStatus[item.status]}
        </Typography>
      </TableCell>
      <TableCell>{item.property?.name}</TableCell>
      <TableCell>
        {item.rentAgreement?.unit.number || item.unit?.number}
      </TableCell>
      <TableCell>
        {item.rentAgreement?.unit.client.name || item.client?.name + "(مالك)"}
      </TableCell>
      <TableCell>
        {item.status !== "PAID" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setId(item.id);
              setModalInputs(modalInputs);
              setTimeout(() => {
                setOpenModal(true);
              }, 100);
            }}
          >
            دفع
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const InvoiceRows = ({ invoices, index }) => {
  return invoices.map((invoice) => (
    <TableRow key={invoice.id} sx={{ backgroundColor: "#f9f9f9" }}>
      <TableCell colSpan={8}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr 1fr 1fr ",
            gap: 1,
            padding: 1,
            backgroundColor: "#f1f1f1",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6"> {index}</Typography>
          <Typography variant="body2">
            تاريخ الدفع: {dayjs(invoice.createdAt).format("DD/MM/YYYY")}
          </Typography>
          <Typography variant="body2">
            القيمة: {formatCurrencyAED(invoice.amount)}
          </Typography>
          <Typography variant="body2">
            طريقة الدفع:{" "}
            {invoice.paymentTypeMethod === "CASH"
              ? "كاش"
              : invoice.paymentTypeMethod === "BANK"
                ? "تحويل بنكي"
                : "شيك"}{" "}
          </Typography>
          <Typography variant="body2">
            {invoice.bankAccount && (
              <>رقم حساب المالك: {invoice.bankAccount.accountNumber}</>
            )}
          </Typography>
          <Typography variant="body2">
            {invoice.chequeNumber && <>رقم الشيك: {invoice.chequeNumber}</>}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  ));
};

async function getBanksData() {
  const res = await fetch("/api/fast-handler?id=bank");
  const data = await res.json();
  return { data };
}

const createInputs = [
  {
    data: {
      id: "accountName",
      type: "text",
      label: "اسم الحساب",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم الحساب",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "accountNumber",
      type: "text",
      label: "رقم الحساب",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رقم الحساب",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "bankId",
      type: "select",
      label: "اسم البنك",
      name: "bankId",
    },
    autocomplete: true,
    getData: getBanksData,
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم البنك",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
];

const EndingAgreementsSection = ({
  agreements,
  heading,
  loading,
  loadingMessage,
}) => {
  return (
    <Box sx={{ mt: 5, position: "relative", minHeight: 200 }}>
      {loading && <TableLoading loadingMessage={loadingMessage} />}

      <Typography variant="h5" gutterBottom>
        {heading}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="ending agreements table">
          <TableHead>
            <TableRow>
              <TableCell>عقد الايجار</TableCell>
              <TableCell>رقم الوحدة</TableCell>
              <TableCell>اسم المستأجر</TableCell>
              <TableCell>اسم العقار</TableCell>
              <TableCell>تاريخ انتهاء العقد</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agreements.map((agreement, index) => (
              <TableRow key={agreement.id}>
                <TableCell>
                  <Link href={`/rent/${agreement.id}`}>
                    <Button>{agreement.id}</Button>
                  </Link>
                </TableCell>
                <TableCell>{agreement.unit.number}</TableCell>
                <TableCell>{agreement.unit.client.name}</TableCell>
                <TableCell>{agreement.unit.property.name}</TableCell>
                <TableCell>
                  {dayjs(agreement.endDate).format("DD/MM/YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HomePage;
