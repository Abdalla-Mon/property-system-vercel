"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { stateInputs } from "@/app/settings/state/inputs";
import { useEffect, useState } from "react";
import { TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { CitiesForm } from "@/app/UiComponents/FormComponents/Forms/ExtraForms/CiticeForm";
import Link from "next/link";

export default function StatePage() {
  return (
    <TableFormProvider url={"settings/states"}>
      <StateWrapper />
    </TableFormProvider>
  );
}

const StateWrapper = () => {
  const {
    data,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    setData,
    setRender,
    total,
    setTotal,
  } = useDataFetcher("settings/states");
  const { setOpenModal, setId, id, submitData } = useTableForm();

  const handleEdit = (id) => {
    setId(id);
    setOpenModal(true);
  };

  async function handleDelete(id) {
    const res = await submitData(null, null, id, "DELETE");

    const filterData = data.filter((item) => item.id !== res.id);
    setData(filterData);
    setTotal((old) => old - 1);
    if (page === 1) {
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
    },
    {
      field: "name",
      headerName: "اسم الاماره",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={`state/${params.row.id}`}>{params.row.name}</Link>
      ),
    },
    {
      field: "location",
      headerName: "الموقع",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "cities",
      type: "size",
      headerName: "عدد المدن",
      width: 150,
      printable: true,
      cardWidth: 48,
      valueGetter: (params) => {
        return params.length;
      },
    },
    {
      field: "actions",
      width: 250,
      printable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
            sx={{ mt: 1, mr: 1 }}
          >
            تعديل
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
            sx={{ mt: 1 }}
          >
            حذف
          </Button>
        </>
      ),
    },
  ];
  const [cities, setCities] = useState([]);
  return (
    <>
      <ViewComponent
        inputs={stateInputs}
        formTitle={"تعديل"}
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
        extraData={cities}
        extraDataName={"cities"}
        setExtraData={setCities}
        total={total}
        setTotal={setTotal}
      >
        <CitiesForm cities={cities} setCities={setCities} />
      </ViewComponent>
    </>
  );
};
