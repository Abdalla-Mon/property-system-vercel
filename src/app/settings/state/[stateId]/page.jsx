"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import Link from "next/link";
import { Button } from "@mui/material";
import { useState } from "react";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { DistrictsForm } from "@/app/UiComponents/FormComponents/Forms/ExtraForms/DistrictsForm";
import { cityInputs } from "@/app/settings/state/[stateId]/cityInputs";

const CityPage = ({ params }) => {
  const { stateId } = params;

  return (
    <TableFormProvider url={"settings/states/" + stateId + "/cities"}>
      <CityWrapper stateId={stateId} />
    </TableFormProvider>
  );
};

const CityWrapper = ({ stateId }) => {
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
  } = useDataFetcher("settings/states/" + stateId + "/cities");
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
      headerName: "اسم المدينه",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={`/settings/state/${stateId}/${params.row.id}/`}>
          {params.row.name}
        </Link>
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
      field: "districts",
      type: "size",
      headerName: "عدد الأحياء",
      width: 150,
      printable: true,
      cardWidth: 48,
      valueGetter: (params) => {
        return params.row.districts.length;
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

  const [districts, setDistricts] = useState([]);
  return (
    <>
      <ViewComponent
        inputs={cityInputs}
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
        extraData={districts}
        extraDataName={"districts"}
        setExtraData={setDistricts}
        total={total}
        setTotal={setTotal}
      >
        <DistrictsForm districts={districts} setDistricts={setDistricts} />
      </ViewComponent>
    </>
  );
};
export default CityPage;
