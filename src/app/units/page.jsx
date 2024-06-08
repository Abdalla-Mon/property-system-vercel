"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useState } from "react";

import Link from "next/link";
import { unitInputs } from "@/app/units/unitInputs";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";

export default function PropertyPage() {
  return (
    <TableFormProvider url={"fast-handler"}>
      <PropertyWrapper />
    </TableFormProvider>
  );
}

const PropertyWrapper = () => {
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
  } = useDataFetcher("main/units");
  const { id, submitData } = useTableForm();
  const [disabled, setDisabled] = useState({});

  const [reFetch, setRefetch] = useState({});

  async function getUnitTypes() {
    const res = await fetch("/api/fast-handler?id=unitType");
    const data = await res.json();

    return { data };
  }

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();

    return { data };
  }

  unitInputs[2] = {
    ...unitInputs[2],
    extraId: false,
    getData: getUnitTypes,
  };
  unitInputs[0] = {
    ...unitInputs[0],
    extraId: false,
    getData: getProperties,
  };

  async function handleDelete(id) {
    const res = await submitData(
      null,
      null,
      id,
      "DELETE",
      null,
      null,
      "main/units",
    );

    const filterData = data.filter((item) => item.id !== res.id);
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
        <Link href={"units/" + params.row.id}>
          <Button variant={"text"}>{params.row.id}</Button>
        </Link>
      ),
    },
    {
      field: "unitId",
      headerName: "معرف الوحده",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "property",
      headerName: "العقار",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/properties/" + params.row.property?.id}>
          <Button variant={"text"}>{params.row.property?.name}</Button>
        </Link>
      ),
    },
    {
      field: "number",
      headerName: "رقم الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "type",
      headerName: "نوع الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => <>{params.row.type?.name}</>,
    },
    {
      field: "yearlyRentPrice",
      headerName: "سعر الإيجار السنوي",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "electricityMeter",
      headerName: "رقم عداد الكهرباء",
      width: 200,
      printable: true,
      cardWidth: 48,
    },

    {
      field: "floor",
      headerName: "الدور",
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
  return (
    <>
      <ViewComponent
        inputs={unitInputs}
        formTitle={"انشاء وحده جديده"}
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
        url={"main/units"}
      ></ViewComponent>
    </>
  );
};
