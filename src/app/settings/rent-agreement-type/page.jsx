"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useEffect, useState } from "react";
import { rentAgreementTypeInputs } from "@/app/settings/rent-agreement-type/inputs";
import TinyMCEEditor from "@/app/components/WordComponent/Tiny";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";

export default function RentAgreementTypePage() {
  return (
    <TableFormProvider url={"settings/rent-agreement-types"}>
      <RentAgreementTypeWrapper />
    </TableFormProvider>
  );
}

const RentAgreementTypeWrapper = () => {
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
  } = useDataFetcher("settings/rent-agreement-types");
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
    },
    {
      field: "title",
      headerName: "عنوان",
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
            sx={{ mt: 1, mr: 1 }}
          >
            تعديل
          </Button>
          <DeleteBtn handleDelete={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];

  const [description, setDescription] = useState("");
  return (
    <>
      <ViewComponent
        inputs={rentAgreementTypeInputs}
        formTitle={"نوع عقد الايجار"}
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
        extraData={description}
        extraDataName={"description"}
        setExtraData={setDescription}
        fullWidth={true}
        setTotal={setTotal}
        total={total}
      >
        <TinyMCEEditor
          description={description}
          setDescription={setDescription}
        />
      </ViewComponent>
    </>
  );
};
