"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";
import { getData } from "@/helpers/functions/getData";
import { PaymentModal } from "@/app/UiComponents/Modals/PaymentModal";

import { DataCard } from "@/app/components/RentDataCard";
import { PaymentStatus } from "@/app/constants/Enums";
import { updatePayment } from "@/services/client/updatePayment";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";

export default function PropertyPage({ params }) {
  const id = params.id;
  return <ViewWrapper urlId={id} />;
}

const ViewWrapper = ({ urlId }) => {
  const { data, loading } = useDataFetcher("main/rentAgreements/" + urlId);
  const [contractExpenses, setContractExpenses] = useState(null);
  const [wait, setWait] = useState(true);

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

  if (loading || typeof data !== "object" || wait) return <div>loading...</div>;

  const fullData = {
    ...data,
    contractExpenses,
  };
  return (
    <>
      <DataCard data={fullData} />
      <TableFormProvider
        url={"main/payments/" + urlId + "?renterId=" + data.renter.id + "&"}
      >
        <Installments urlId={urlId} renter={data.renter} rentData={data} />
      </TableFormProvider>
    </>
  );
};

const Installments = ({ urlId, renter, rentData }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);
  const [modalInputs, setModalInputs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getData({
        url: `main/rentAgreements/${urlId}/installments`,
        setLoading,
        others: "",
      });
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
      title: "فاتورة دفعة ايجار",
      description: "فاتورة دفعة ايجار",
      invoiceType: "RENT",
    };

    const newData = await updatePayment(submitData, setSubmitLoading);
    const updateData = data.map((item) => {
      if (item.id === id) {
        return newData.payment;
      }
      return item;
    });
    setData(updateData);
  }

  return (
    <Box
      sx={{
        mt: 5,
      }}
    >
      <Typography variant="h5" gutterBottom>
        الدفعات
      </Typography>
      {loading ? (
        <div>loading...</div>
      ) : (
        <Grid container spacing={2}>
          {data?.map((item, index) => (
            <Payment
              item={item}
              key={item.id}
              setId={setId}
              setModalInputs={setModalInputs}
              renter={renter}
            />
          ))}
        </Grid>
      )}
      <PaymentModal id={id} modalInputs={modalInputs} submit={submit} />
    </Box>
  );
};

function Payment({ item, setModalInputs, setId, renter }) {
  const { setOpenModal } = useTableForm();

  const [paymentType, setPaymentType] = useState("CASH");

  async function getRenterAccountData() {
    const res = await fetch("/api/clients/renter/" + renter.id);
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
      },
      pattern: {
        required: {
          value: true,
          message: "يرجى إدخال القيمة المراد دفعها",
        },
        max: {
          value: item.amount - item.paidAmount, // replace with your actual values
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
            label: "رقم حساب المستاجر",
            name: "bankAccountId",
          },
          createData: createInputs,
          autocomplete: true,
          extraId: false,
          getData: getRenterAccountData,
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
      ]);
    } else {
      setModalInputs(modalInputs);
    }
  }, [paymentType]);
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {item.installmentNumber}
          </Typography>
          <Typography variant="body1" gutterBottom>
            تاريخ الدفع: {dayjs(item.dueDate).format("DD/MM/YYYY")}
          </Typography>
          <Typography variant="body1" gutterBottom>
            قيمة الدفعه: {item.amount}
          </Typography>
          <Typography variant="body1" gutterBottom>
            ما تم دفعه: {item.paidAmount}
          </Typography>
          <Typography variant="body1" gutterBottom>
            الحالة: {PaymentStatus[item.status]}
          </Typography>
        </CardContent>
        <CardActionArea>
          {item.amount - item.paidAmount > 0 && (
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
        </CardActionArea>
      </Card>
    </Grid>
  );
}

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
const printStyles = `
  @media print {
    .MuiButton-root {
      display: none;
    }
    .MuiCard-root {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
`;

const GlobalStyles = () => <style>{printStyles}</style>;
