"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import { Button } from "@mui/material";
import { useState } from "react";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { districtInputs } from "@/app/settings/state/[stateId]/[cityId]/districtInputs";
import { NeighboursForm } from "@/app/UiComponents/FormComponents/Forms/ExtraForms/NeighbourForm";

export const DistrictPage = ({ params }) => {
  const { cityId, stateId } = params;

  return (
    <TableFormProvider
      url={`settings/states/${stateId}/cities/${cityId}/districts`}
    >
      <DistrictWrapper cityId={cityId} stateId={stateId} />
    </TableFormProvider>
  );
};

const DistrictWrapper = ({ cityId, stateId }) => {
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
  } = useDataFetcher(`settings/states/${stateId}/cities/${cityId}/districts`);
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
      headerName: "اسم الحي",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "location",
      headerName: "الموقع",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "neighbours",
      type: "size",
      headerName: "عدد المناطق",
      width: 150,
      printable: true,
      cardWidth: 48,
      valueGetter: (params) => {
        return params.row.neighbours.length;
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

  const [neighbours, setNeighbours] = useState([]);
  return (
    <>
      <ViewComponent
        inputs={districtInputs}
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
        extraData={neighbours}
        extraDataName={"neighbours"}
        setExtraData={setNeighbours}
        total={total}
        setTotal={setTotal}
      >
        <NeighboursForm neighbours={neighbours} setNeighbours={setNeighbours} />
      </ViewComponent>
    </>
  );
};
export default DistrictPage;
