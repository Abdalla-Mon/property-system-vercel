"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import { useEffect, useState, useRef } from "react";
import { propertyInputs } from "@/app/properties/propertyInputs";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";
import { ExtraForm } from "@/app/UiComponents/FormComponents/Forms/ExtraForms/ExtraForm";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Link from "next/link";
import CustomTable from "@/app/components/Tables/CustomTable";
import { unitInputs } from "@/app/units/unitInputs";
import { CreateModal } from "@/app/UiComponents/Modals/CreateModal/CreateModal";
import useEditState from "@/helpers/hooks/useEditState";
import { MultiSelectInput } from "@/app/UiComponents/FormComponents/MUIInputs/MultiSelectAutoComplete";
import { rentAgreementInputs } from "@/app/rent/rentInputs";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";

const RentCollectionType = {
  TWO_MONTHS: "شهرين",
  THREE_MONTHS: "ثلاثة أشهر",
  FOUR_MONTHS: "أربعة أشهر",
  SIX_MONTHS: "ستة أشهر",
  ONE_YEAR: "سنة واحدة",
};

const StatusType = {
  ACTIVE: "نشط",
  CANCELED: "ملغى",
  EXPIRED: "منتهي",
};

export default function PropertyPage({ params }) {
  const id = params.id;
  return (
    <TableFormProvider url={"fast-handler"}>
      <ViewWrapper urlId={id} />
    </TableFormProvider>
  );
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
    </>
  );
};
const contractExpensesTotalPrice = (contractExpenses) => {
  return contractExpenses?.reduce((acc, item) => acc + item.value, 0);
};
const DataCard = ({ data }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Card sx={{ padding: 2 }} ref={componentRef}>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mb: 5,
            textAlign: "center",
            width: "fit-content",
            mx: "auto",
            padding: 1,
            px: 1.5,
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: 1,
          }}
        >
          رقم العقد: {data.rentAgreementNumber}
        </Typography>
        <Divider sx={{ width: "100%", marginY: 1 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
          container
          spacing={2}
        >
          <GridRow
            label="الوحدة"
            value={
              <Button variant="text" color="primary">
                <Link href={`/units/${data.unit.id}`}>{data.unit.unitId}</Link>
              </Button>
            }
          />
          <GridRow
            label="اسم العقار"
            value={
              <Link href={`/properties/${data.unit.property.id}`}>
                <Button variant="text" color="primary">
                  {data.unit.property.name}
                </Button>
              </Link>
            }
          />
          <GridRow
            label="اسم المالك"
            value={
              <Link href={`/owners/${data.unit.property.client.id}`}>
                <Button variant="text" color="primary">
                  {data.unit.property.client.name}
                </Button>
              </Link>
            }
          />
          <GridRow
            label="اسم المستأجر"
            value={
              <Link href={`/renters/${data.renter.id}`}>
                <Button variant="text" color="primary">
                  {data.renter.name}
                </Button>
              </Link>
            }
          />
          <GridRow
            label=" يتم تحصيل الايجار كل"
            value={RentCollectionType[data.rentCollectionType]}
          />
          <GridRow label="سعر عقد الايجار سنويا " value={data.totalPrice} />
          <GridRow label="الضريبة" value={data.tax} />
          <GridRow
            label="قمية الضريبه"
            value={(data.tax * data.totalPrice) / 100}
          />

          <GridRow label="التأمين" value={data.insuranceFees} />
          <GridRow label="رسوم التسجيل" value={data.registrationFees} />
          <GridRow label="الحالة" value={StatusType[data.status]} />
          <GridRow />
          <GridRow
            label="تاريخ البداية"
            value={dayjs(data.startDate).format("DD/MM/YYYY")}
          />
          <GridRow
            label="تاريخ النهاية"
            value={dayjs(data.endDate).format("DD/MM/YYYY")}
          />

          {data.contractExpenses && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>مصروفات العقد:</strong>
              </Typography>
              <Box component="ul" sx={{ paddingLeft: 2 }}>
                {data.contractExpenses.map((expense, index) => (
                  <Typography component="li" key={index} variant="body2">
                    {expense.name}: {expense.value}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
          <GridRow
            label="المبلغ الكلي"
            value={
              data.totalPrice +
              (data.tax * data.totalPrice) / 100 +
              data.insuranceFees +
              data.registrationFees +
              contractExpensesTotalPrice(data.contractExpenses)
            }
          />
        </Box>

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const GridRow = ({ label, value }) => (
  <Box>
    <Box display="flex" flexDirection="column">
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <strong>{label}:</strong> {value}
      </Typography>
      <Divider sx={{ width: "100%", marginY: 1 }} orientation="vertical" />
      <Divider sx={{ width: "100%", marginY: 1 }} />
    </Box>
  </Box>
);

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
