"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import { useEffect, useState } from "react";
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

const PropertyWrapper = ({ urlId }) => {
  const {
    data,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    setData,
    total,
    setTotal,
    setRender,
  } = useDataFetcher("main/rentAgreements/" + urlId);
  const { submitData, openModal } = useTableForm();
  const [disabled, setDisabled] = useState({});
  const [reFetch, setRefetch] = useState({});
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

  async function getUnits() {
    const res = await fetch("/api/fast-handler?id=unit");
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.unitId,
        disabled: item.rentAgreements?.some((rent) => rent.status === "ACTIVE"),
      };
    });

    return { data: dataWithLabel };
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

  console.log(data, "data");
  if (loading || typeof data !== "object" || wait) return <div>loading...</div>;
  const dataInputs = rentAgreementInputs.map((input) => {
    input = {
      ...input,
      value: data[input.data.id],
      disabled: true,
    };
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
      case "unitId":
        return {
          ...input,
          extraId: false,
          getData: getUnits,
        };
      default:
        return input;
    }
  });
  console.log(dataInputs);

  async function create(data) {
    const extraData = { electricityMeters };
    data = { ...data, extraData };
    await submitData(
      data,
      null,
      null,
      "PUT",
      null,
      "json",
      "main/rentAgreements" + urlId,
    );
  }

  async function handleDelete(id) {
    const deleted = await submitData(
      null,
      null,
      null,
      "DELETE",
      null,
      "json",
      "main/rentAgreements/" + id,
    );
  }

  return (
    <div>
      {loading ? (
        <div>جاري تحميل بيانات العقد</div>
      ) : (
        <>
          <div className="mb-4">
            <Form
              formTitle={"تعديل عقد الايجار"}
              inputs={dataInputs}
              onSubmit={(data) => {
                create(data);
              }}
              disabled={disabled}
              variant={"outlined"}
              btnText={"تعديل"}
              reFetch={reFetch}
            >
              {contractExpenses !== null &&
                !loading &&
                contractExpenses !== undefined && (
                  <MultiSelectInput
                    route={"fast-handler?id=contractExpenses"}
                    items={contractExpenses}
                    setItems={setContractExpenses}
                    label={"مصروفات العقود"}
                  />
                )}
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

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

const DataCard = ({ data }) => {
  return (
    <Card sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mb: 2,
          }}
        >
          رقم العقد: {data.rentAgreementNumber}
        </Typography>

        <Grid container spacing={2}>
          <GridRow
            label="الوحدة"
            value={
              <Link href={`/units/${data.unit.id}`}>{data.unit.unitId}</Link>
            }
          />
          <GridRow
            label="اسم العقار"
            value={
              <Link href={`/properties/${data.unit.property.id}`}>
                {data.unit.property.name}
              </Link>
            }
          />
          <GridRow
            label="اسم المالك"
            value={
              <Link href={`/owners/${data.unit.property.client.id}`}>
                {data.unit.property.client.name}
              </Link>
            }
          />
          <GridRow
            label="اسم المستأجر"
            value={
              <Link href={`/renters/${data.renter.id}`}>
                {data.renter.name}
              </Link>
            }
          />
          <GridRow label="نوع العقد" value={data.type.title} />
          <GridRow
            label="نوع الدفع"
            value={RentCollectionType[data.rentCollectionType]}
          />
          <GridRow label="السعر الكلي" value={data.totalPrice} />
          <GridRow label="الضريبة" value={data.tax} />
          <GridRow label="التأمين" value={data.insuranceFees} />
          <GridRow label="الحالة" value={StatusType[data.status]} />

          <GridRow
            label="تاريخ البداية"
            value={dayjs(data.startDate).format("DD/MM/YYYY")}
          />
          <GridRow
            label="تاريخ النهاية"
            value={dayjs(data.endDate).format("DD/MM/YYYY")}
          />
          {data.contractExpenses && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>مصروفات العقود:</strong>
              </Typography>
              <Box component="ul" sx={{ paddingLeft: 2 }}>
                {data.contractExpenses.map((expense, index) => (
                  <Typography component="li" key={index} variant="body2">
                    {expense.name}: {expense.value}
                  </Typography>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

const GridRow = ({ label, value }) => (
  <>
    <Grid item xs={12} md={6}>
      <Box display="flex" flexDirection="column">
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <strong>{label}:</strong> {value}
        </Typography>
        <Divider sx={{ width: "100%", marginY: 1 }} orientation="vertical" />
        <Divider sx={{ width: "100%", marginY: 1 }} />
      </Box>
    </Grid>
  </>
);
