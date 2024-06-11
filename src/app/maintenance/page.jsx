"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useEffect, useState } from "react";
import { maintenanceInputs } from "./maintenanceInputs";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { submitMaintenance } from "@/services/client/maintenance";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";
import { Button } from "@mui/material";
import Link from "next/link";
import { StatusType } from "@/app/constants/Enums";
import { useRouter, useSearchParams } from "next/navigation";

export default function MaintenancePage() {
  return (
    <TableFormProvider url={"fast-handler"}>
      <MaintenanceWrapper />
    </TableFormProvider>
  );
}

const MaintenanceWrapper = () => {
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
  } = useDataFetcher("main/maintenance");
  const { id, submitData } = useTableForm();
  const [propertyId, setPropertyId] = useState(null);
  const [propertiesData, setPropertiesData] = useState(null);
  const [disabled, setDisabled] = useState({
    unitId: true,
  });
  const [reFetch, setRefetch] = useState({
    unitId: false,
  });
  const router = useRouter();
  const [extraData, setExtraData] = useState({});
  useEffect(() => {
    const currentProperty = propertiesData?.find(
      (property) => property.id === +propertyId,
    );
    if (currentProperty) {
      setExtraData({
        ownerId: currentProperty.client.id,
      });
    }
  }, [propertyId]);

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();
    setPropertiesData(data);
    return { data };
  }

  function handlePropertyChange(value) {
    setPropertyId(value);
    router.push("/maintenance?propertyId=" + value);
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
    const searchParams = new URLSearchParams(window.location.search);
    const propertyId = searchParams.get("propertyId");
    if (!propertyId) return { data: [] };
    const res = await fetch(
      "/api/fast-handler?id=unit&propertyId=" + propertyId,
    );

    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.unitId,
      };
    });

    return { data: dataWithLabel, id: propertyId };
  }

  async function getExpenseTypes() {
    const res = await fetch("/api/fast-handler?id=expenseTypes");
    const data = await res.json();
    return { data };
  }

  const otherInputs = [
    {
      data: {
        id: "startDate",
        type: "date",
        label: "تاريخ بداية الأقساط",
        name: "installmentStartDate",
      },
      pattern: {
        required: {
          value: true,
          message: "يرجى إدخال تاريخ بداية الأقساط",
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
        id: "endDate",
        type: "date",
        label: "تاريخ نهاية الأقساط",
        name: "installmentEndDate",
      },
      pattern: {
        required: {
          value: true,
          message: "يرجى إدخال تاريخ نهاية الأقساط",
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

  const [dataInputs, setDataInputs] = useState([]);
  const [loadingInput, setInputLoading] = useState(true);
  const defInputs = maintenanceInputs.map((input) => {
    switch (input.data.id) {
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
      case "typeId":
        return {
          ...input,
          getData: getExpenseTypes,
        };
      case "payEvery":
        return {
          ...input,
          onChange: (value) => {
            if (value === "ONCE") {
              setDataInputs((old) =>
                old.filter(
                  (input) =>
                    input.data.id !== "startDate" &&
                    input.data.id !== "endDate",
                ),
              );
            } else {
              setDataInputs((old) => {
                const withoutOtherInputs = old.filter(
                  (input) =>
                    input.data.id !== "startDate" &&
                    input.data.id !== "endDate",
                );
                return [...withoutOtherInputs, ...otherInputs];
              });
            }
          },
        };
      default:
        return input;
    }
  });
  useEffect(() => {
    setDataInputs(defInputs);
    setInputLoading(false);
  }, []);

  async function handleDelete(id) {
    await submitData(null, null, id, "DELETE", null, null, "main/maintenance");

    const filterData = data.filter((item) => +item.id !== +id);
    setData(filterData);
    setTotal((old) => old - 1);
    if (page === 1 && total >= limit) {
      setRender((old) => !old);
    } else {
      setPage((old) => (old > 1 ? old - 1 : 1) || 1);
    }
  }

  const { setLoading: setSubmitLoading } = useToastContext();

  const columns = [
    {
      field: "maintenanceNumber",
      headerName: "رقم الصيانة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"maintenance/" + params.row.id}>
          <Button variant={"text"}>{params.row.maintenanceNumber}</Button>
        </Link>
      ),
    },
    {
      field: "propertyId",
      headerName: "اسم العقار",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/properties/" + params.row.property.id}>
          <Button variant={"text"}>{params.row.property.name}</Button>
        </Link>
      ),
    },
    {
      field: "unit",
      headerName: "معرف الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/units/" + params.row.unit?.id}>
          <Button
            variant={"text"}
            sx={{
              maxWidth: 100,
              overflow: "auto",
            }}
          >
            {params.row.unit?.unitId}
          </Button>
        </Link>
      ),
    },
    {
      field: "status",
      headerName: "الحالة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => <>{StatusType[params.row.status]}</>,
    },
    {
      field: "date",
      headerName: "تاريخ الصيانة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{new Date(params.row.date).toLocaleDateString()}</>
      ),
    },
    {
      field: "totalPrice",
      headerName: "السعر الكلي",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "actions",
      width: 250,
      printable: false,
      renderCell: (params) => (
        <>
          <DeleteBtn handleDelete={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];

  async function submit(data) {
    return await submitMaintenance({ ...data, extraData }, setSubmitLoading);
  }

  if (loadingInput) {
    return null;
  }
  return (
    <>
      <ViewComponent
        inputs={dataInputs}
        formTitle={"إنشاء صيانة"}
        totalPages={totalPages}
        rows={data}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        id={id}
        loading={loading}
        setData={setData}
        setTotal={setTotal}
        total={total}
        noModal={true}
        disabled={disabled}
        reFetch={reFetch}
        submitFunction={submit}
        url={"main/maintenance"}
        onModalOpen={() => {
          router.push("/maintenance");
          setDataInputs(defInputs);
        }}
      />
    </>
  );
};