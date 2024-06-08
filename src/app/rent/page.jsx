"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useState } from "react";

import Link from "next/link";
import { rentAgreementInputs } from "./rentInputs";
import { MultiSelectInput } from "@/app/UiComponents/FormComponents/MUIInputs/MultiSelectAutoComplete";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { submitRentAgreement } from "@/services/client/createRentAgreement";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";

export default function PropertyPage() {
  return (
    <TableFormProvider url={"fast-handler"}>
      <RentWrapper />
    </TableFormProvider>
  );
}

const RentWrapper = () => {
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
  } = useDataFetcher("main/rentAgreements/");
  const { id, submitData } = useTableForm();
  const [propertyId, setPropertyId] = useState(null);
  const [disabled, setDisabled] = useState({
    unitId: true,
  });
  const [reFetch, setRefetch] = useState({
    unitId: false,
  });

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

  async function handleDelete(id) {
    await submitData(
      null,
      null,
      id,
      "DELETE",
      null,
      null,
      "main/rentAgreements",
    );

    const filterData = data.filter((item) => +item.id !== +id);
    setData(filterData);
    setTotal((old) => old - 1);
    if (page === 1 && total >= limit) {
      setRender((old) => !old);
    } else {
      setPage((old) => (old > 1 ? old - 1 : 1) || 1);
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"rent/" + params.row.id}>
          <Button variant={"text"}>{params.row.id}</Button>
        </Link>
      ),
    },
    {
      field: "rentAgreementNumber",
      headerName: "رقم العقد",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"rent/" + params.row.id}>
          <Button variant={"text"}>{params.row.rentAgreementNumber}</Button>
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
        <Link href={"/properties/" + params.row.unit.property.id}>
          <Button variant={"text"}>{params.row.unit.property.name}</Button>
        </Link>
      ),
    },
    {
      field: "unit",
      headerName: "معرف الوحده",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/units/" + params.row.unit?.id}>
          <Button variant={"text"}>{params.row.unit?.unitId}</Button>
        </Link>
      ),
    },
    {
      field: "owner",
      headerName: "المالك",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/owners/" + params.row.unit.property?.client.id}>
          <Button variant={"text"}>
            {params.row.unit.property?.client.name}
          </Button>
        </Link>
      ),
    },
    {
      field: "renter",
      headerName: "المستأجر",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/renters/" + params.row.renter?.id}>
          <Button variant={"text"}>{params.row.renter?.name}</Button>
        </Link>
      ),
    },
    {
      field: "status",
      headerName: "الحالة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{params.row.status === "ACTIVE" ? "نشط" : "منتهي"}</>
      ),
    },
    {
      field: "startDate",
      headerName: "تاريخ البداية",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{new Date(params.row.startDate).toLocaleDateString()}</>
      ),
    },
    {
      field: "endDate",
      headerName: "تاريخ النهاية",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{new Date(params.row.endDate).toLocaleDateString()}</>
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

  const [contractExpenses, setContractExpenses] = useState([]);
  const { setLoading: setSubmitLoading } = useToastContext();

  async function submit(data) {
    return await submitRentAgreement(data, setSubmitLoading);
  }

  return (
    <>
      <ViewComponent
        inputs={dataInputs}
        formTitle={"انشاء عقد ايجار "}
        totalPages={totalPages}
        rows={data}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        extraData={{ contractExpenses }}
        extraDataName={"contractExpenses"}
        id={id}
        loading={loading}
        setData={setData}
        setTotal={setTotal}
        total={total}
        noModal={true}
        disabled={disabled}
        reFetch={reFetch}
        submitFunction={submit}
        url={"main/rentAgreements"}
      >
        <MultiSelectInput
          route={"fast-handler?id=contractExpenses"}
          items={contractExpenses}
          setItems={setContractExpenses}
          label={"مصروفات العقود"}
        />
      </ViewComponent>
    </>
  );
};
