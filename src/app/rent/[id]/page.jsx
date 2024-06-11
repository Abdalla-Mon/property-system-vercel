"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import React, { useEffect, useState, useRef } from "react";

import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";

import dayjs from "dayjs";
import { getData } from "@/helpers/functions/getData";
import { PaymentModal } from "@/app/UiComponents/Modals/PaymentModal";
import { DataCard } from "@/app/components/RentDataCard";
import { PaymentStatus, PaymentType } from "@/app/constants/Enums";
import { updatePayment } from "@/services/client/updatePayment";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { useReactToPrint } from "react-to-print";
import TinyMCEEditor from "@/app/components/WordComponent/Tiny";
import { handleRequestSubmit } from "@/helpers/functions/handleRequestSubmit";
import { CancelRentModal } from "@/app/UiComponents/Modals/CancelRentModal";
import { RenewRentModal } from "@/app/UiComponents/Modals/RenewRent";
import { rentAgreementInputs } from "@/app/rent/rentInputs";
import { useRouter } from "next/navigation";
import { submitRentAgreement } from "@/services/client/createRentAgreement";

export default function PropertyPage({ params }) {
  const id = params.id;
  return <ViewWrapper urlId={id} />;
}

const ViewWrapper = ({ urlId }) => {
  const { data, loading, setData } = useDataFetcher(
    "main/rentAgreements/" + urlId,
  );
  const [contractExpenses, setContractExpenses] = useState(null);
  const [wait, setWait] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  useEffect(() => {
    if (!loading && typeof data === "object") {
      setContractExpenses(
        data.contractExpenses?.map((item) => item.contractExpense),
      );
      window.setTimeout(() => {
        setWait(false);
      }, 100);
    }
  }, [data, loading]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const componentRef = useRef();
  if (loading || typeof data !== "object" || wait) return <div>loading...</div>;
  const fullData = {
    ...data,
    contractExpenses,
  };
  return (
    <Box ref={componentRef}>
      <GlobalStyles />
      <DataCard data={fullData} />
      <TableFormProvider
        url={
          "main/payments/" +
          urlId +
          "?clientId=" +
          data.unit.property.client.id +
          "&"
        }
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            py: 2,
          }}
        >
          <RenewRent data={data} setData={setData} />
          {data?.status === "active" && (
            <CancelRent data={data} setData={setData} />
          )}
        </Box>
        <Payments
          renter={data.renter}
          rentData={data}
          url={`main/rentAgreements/${urlId}/installments`}
          description={"فاتورة دفعة ايجار"}
          title={"فاتورة دفعة ايجار"}
          heading={"الدفعات"}
        />
        <Payments
          renter={data.renter}
          rentData={data}
          url={`main/rentAgreements/${urlId}/feeInvoices`}
          description={"فاتورة رسوم العقد"}
          title={"فاتورة رسوم العقد"}
          heading={"رسوم العقد"}
        />
      </TableFormProvider>
      {!isPrinting && <RentAgreementDescription data={data} />}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ mt: 5 }}
      >
        طباعة الصفحة بالكامل
      </Button>
    </Box>
  );
};

const Payments = ({
  renter,
  rentData,
  url,
  title,
  description,
  heading,
  showName,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);
  const [modalInputs, setModalInputs] = useState([]);
  const { setOpenModal } = useTableForm();

  useEffect(() => {
    async function fetchData() {
      const data = await getData({ url: url, setLoading, others: "" });
      setData(data?.data);
    }

    fetchData();
  }, []);

  const { setLoading: setSubmitLoading } = useToastContext();

  async function submit(d) {
    const currentPayment = data.find((item) => item.id === id);
    const submitData = {
      ...d,
      currentPaidAmount: +currentPayment.paidAmount,
      id,
      amount: currentPayment.amount,
      propertyId: currentPayment.propertyId,
      rentAgreementId: currentPayment.rentAgreementId,
      installmentId: currentPayment.installmentId,
      renterId: rentData.renterId,
      ownerId: rentData.unit.property.client.id,
      title: title,
      description: description,
      invoiceType: currentPayment.paymentType,
    };

    const newData = await updatePayment(submitData, setSubmitLoading);
    const updateData = data.map((item) => {
      if (item.id === id) {
        return {
          ...newData.payment,
          invoices: [...item.invoices, newData.invoice],
        };
      }
      return item;
    });

    setData(updateData);
    setOpenModal(false);
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        {heading}
      </Typography>
      {loading ? (
        <div>loading...</div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="payment table">
            <TableHead>
              <TableRow>
                <TableCell>دفعه رقم</TableCell>
                <TableCell>ميعاد الدفع</TableCell>
                {showName && <TableCell>اسم المصروف</TableCell>}
                <TableCell>قيمة الدفعه</TableCell>
                <TableCell>ما تم دفعه</TableCell>
                <TableCell>الباقي</TableCell>
                <TableCell>النوع</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>دفع</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => (
                <React.Fragment key={item.id}>
                  <PaymentRow
                    item={item}
                    setId={setId}
                    setModalInputs={setModalInputs}
                    renter={renter}
                    showName={showName}
                    index={index + 1}
                  />
                  {item.invoices && item.invoices.length > 0 && (
                    <InvoiceRows invoices={item.invoices} index={index + 1} />
                  )}
                </React.Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography variant="body2" align="center">
                    إجمالي المدفوعات:{" "}
                    {data
                      .reduce((acc, item) => acc + item.paidAmount, 0)
                      .toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
      <PaymentModal id={id} modalInputs={modalInputs} submit={submit} />
    </Box>
  );
};

const PaymentRow = ({ item, setModalInputs, setId, index, showName }) => {
  const { setOpenModal } = useTableForm();
  const [paymentType, setPaymentType] = useState("CASH");

  async function getOwnerAccountData() {
    const res = await fetch("/api/clients/owner/" + item.clientId);
    const data = await res.json();
    const bankAccounts = data.bankAccounts.map((account) => ({
      id: account.id,
      name: account.accountNumber,
    }));
    return { data: bankAccounts };
  }

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
          message: `القيمة المراد دفعها يجب ان تكون اقل من ${item.amount - item.paidAmount} والتي هي القيمة المتبقية لهذه الدفعة `,
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
    if (paymentType === "BANK") {
      setModalInputs([
        ...modalInputs,
        {
          data: {
            id: "bankAccountId",
            type: "select",
            label: "رقم حساب المالك",
            name: "bankAccountId",
          },
          createData: createInputs,
          autocomplete: true,
          extraId: false,
          getData: getOwnerAccountData,
          pattern: {
            required: {
              value: true,
              message: "يرجى إدخال رقم حساب المالك",
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
    <TableRow hover>
      <TableCell>{index}</TableCell>
      <TableCell>{dayjs(item.dueDate).format("DD/MM/YYYY")}</TableCell>
      {showName && <TableCell>{item.title}</TableCell>}
      <TableCell>{item.amount.toFixed(2)}</TableCell>
      <TableCell>{item.paidAmount.toFixed(2)}</TableCell>
      <TableCell>{(item.amount - item.paidAmount).toFixed(2)}</TableCell>
      <TableCell>{PaymentType[item.paymentType]}</TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            color:
              item.status === "PAID"
                ? "green"
                : item.status === "PENDING"
                  ? "orange"
                  : "red",
            fontWeight: "bold",
          }}
        >
          {PaymentStatus[item.status]}
        </Typography>
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
              }, 50);
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
          {/*<Typography variant="body2">رقم الفاتورة {invoice.id}</Typography>*/}
          <Typography variant="body2">
            تاريخ الدفع: {dayjs(invoice.createdAt).format("DD/MM/YYYY")}
          </Typography>
          <Typography variant="body2">القيمة: {invoice.amount}</Typography>
          <Typography variant="body2">
            طريقة الدفع:{" "}
            {invoice.paymentTypeMethod === "CASH" ? "كاش" : "تحويل بنكي"}
          </Typography>
          <Typography variant="body2">
            {invoice.bankAccount && (
              <>رقم حساب المالك: {invoice.bankAccount.accountNumber}</>
            )}
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

function RentAgreementDescription({ data }) {
  const [description, setDescription] = useState(data.customDescription);
  const { setLoading } = useToastContext();

  async function submit() {
    await handleRequestSubmit(
      {
        customDescription: description,
      },
      setLoading,
      "main/rentAgreements/" + data.id + "/updateDescription",
      false,
      "جاري حفظ النص",
    );
  }

  return (
    <Box
      className="no-print"
      sx={{
        mt: 5,
        maxWidth: "100%",
        overflow: "auto",
      }}
    >
      <TinyMCEEditor
        description={description}
        setDescription={setDescription}
      />
      <Button
        onClick={() => submit()}
        variant={"contained"}
        sx={{ mt: 2 }}
        size={"large"}
      >
        حفظ نص العقد
      </Button>
    </Box>
  );
}

const CancelRent = ({ data, setData }) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelData, setCancelData] = useState(null);
  const { setLoading: setSubmitLoading } = useToastContext();

  const handleOpenCancelModal = (rentData) => {
    setCancelData(rentData);
    setCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
    setCancelData(null);
  };

  const handleCancelConfirm = async () => {
    await submitRentAgreement(
      { ...cancelData, canceling: true },
      setSubmitLoading,
      "PUT",
      [
        {
          route: `/${cancelData.id}?installments=true`,
          message: "جاري البحث عن اي دفعات لم يتم استلامها...",
        },
        {
          route: `/${cancelData.id}?feeInvoices=true`,
          message: "جاري البحث عن اي رسوم لم يتم دفعها...",
        },
        {
          route: `/${cancelData.id}?otherExpenses=true`,
          message: "جاري البحث عن اي مصاريف اخري لم يتم دفعها...",
        },
        {
          route: `/${cancelData.id}?cancel=true`,
          message: "جاري تحديث حالة العقد القديم...",
        },
      ],
      true,
    );
    router.push("/rent/");
    handleCloseCancelModal();
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => handleOpenCancelModal(data)}
      >
        إلغاء العقد
      </Button>
      <CancelRentModal
        open={cancelModalOpen}
        handleClose={handleCloseCancelModal}
        handleConfirm={handleCancelConfirm}
      />
    </>
  );
};

const RenewRent = ({ data, setData }) => {
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewData, setRenewData] = useState(null);
  const { setLoading: setSubmitLoading } = useToastContext();
  const router = useRouter();

  const handleOpenRenewModal = (rentData) => {
    setRenewData(rentData);
    setRenewModalOpen(true);
  };

  const handleCloseRenewModal = () => {
    setRenewModalOpen(false);
    setRenewData(null);
  };

  async function getRenters() {
    const res = await fetch("/api/fast-handler?id=renter");
    const data = await res.json();

    return { data };
  }

  async function getRentTypes() {
    const res = await fetch("/api/fast-handler?id=rentType");
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.title,
      };
    });
    return { data: dataWithLabel };
  }

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();
    return { data };
  }

  function handlePropertyChange(value) {
    setPropertyId(value);
    setDisabled({
      ...disabled,
      unitId: false,
    });
    setRefetch({
      ...reFetch,
      unitId: true,
    });
  }

  async function getUnits() {
    const res = await fetch(
      "/api/fast-handler?id=unit&propertyId=" + propertyId,
    );
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.unitId,
        disabled: item.rentAgreements?.some((rent) => rent.status === "ACTIVE"),
      };
    });

    return { data: dataWithLabel, id: propertyId };
  }

  async function getRentCollectionType() {
    const data = [
      { id: "TWO_MONTHS", name: "شهرين" },
      { id: "THREE_MONTHS", name: "ثلاثة أشهر" },
      { id: "FOUR_MONTHS", name: "أربعة أشهر" },
      { id: "SIX_MONTHS", name: "ستة أشهر" },
      { id: "ONE_YEAR", name: "سنة واحدة" },
    ];
    return { data };
  }

  const dataInputs = rentAgreementInputs.map((input) => {
    switch (input.data.id) {
      case "rentCollectionType":
        return {
          ...input,
          extraId: false,
          getData: getRentCollectionType,
        };
      case "renterId":
        return {
          ...input,
          extraId: false,
          getData: getRenters,
        };
      case "typeId":
        return {
          ...input,
          extraId: false,
          getData: getRentTypes,
        };
      case "propertyId":
        return {
          ...input,
          getData: getProperties,
          onChange: handlePropertyChange,
        };
      case "unitId":
        return {
          ...input,
          getData: getUnits,
        };
      default:
        return input;
    }
  });
  const handleRenewSubmit = async (data) => {
    const extraData = { otherExpenses: [] };
    data = { ...data, extraData };
    const returedData = await submitRentAgreement(
      { ...data },
      setSubmitLoading,
      "PUT",
      [
        {
          route: `/${renewData.id}?installments=true`,
          message: "جاري البحث عن اي دفعات لم يتم استلامها...",
        },
        {
          route: `/${renewData.id}?feeInvoices=true`,
          message: "جاري البحث عن اي رسوم لم يتم دفعها...",
        },
        {
          route: `/${renewData.id}?otherExpenses=true`,
          message: "جاري البحث عن اي مصاريف اخري لم يتم دفعها...",
        },
        {
          route: `/${renewData.id}?renew=true`,
          message: "جاري تحديث حالة العقد القديم...",
        },
      ],
    );
    if (!returedData) return;
    router.push("/rent/" + returedData.id);
    handleCloseRenewModal();
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleOpenRenewModal(data)}
      >
        تجديد العقد
      </Button>
      <RenewRentModal
        open={renewModalOpen}
        handleClose={handleCloseRenewModal}
        initialData={renewData}
        inputs={dataInputs}
        onSubmit={handleRenewSubmit}
      />
    </>
  );
};

const printStyles = `
  @media print {
body{
padding:15px ;
}
    .MuiButton-root {
      display: none;
    }
  }
`;

const GlobalStyles = () => <style>{printStyles}</style>;
