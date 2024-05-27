"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button, CircularProgress } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import { bankInputs } from "@/app/settings/bank/inputs";

import ViewComponent from "@/app/components/ViewComponent/ViewComponent";

export default function BankPage() {
  return (
    <TableFormProvider url={"settings/banks"}>
      <BankWrapper />
    </TableFormProvider>
  );
}
const BankWrapper = () => {
  const { data, loading, page, setPage, limit, setLimit, totalPages, setData } =
    useDataFetcher("settings/banks");
  const { setOpenModal, setId, id, submitData } = useTableForm();
  const handleEdit = (id) => {
    setId(id);
    setOpenModal(true);
  };

  async function handleDelete(id) {
    const res = await submitData(null, null, id, "DELETE");
    const filterData = data.filter((item) => item.id !== res.id);
    setData(filterData);
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
      headerName: "اسم البنك",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "country",
      headerName: "الدولة",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "city",
      headerName: "المدينة",
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
  return (
    <>
      <ViewComponent
        inputs={bankInputs}
        formTitle={"تعديل"}
        totalPages={totalPages}
        rows={data}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        modalData={id ? data.find((item) => item.id === id) : {}}
        setLimit={setLimit}
        id={id}
        loading={loading}
        setData={setData}
      />
    </>
  );
};
