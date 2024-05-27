"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";

import { contractExpenseInputs } from "@/app/settings/contract-expense-type/contractExpenseInputs";

export default function ContractExpensePage() {
  return (
    <TableFormProvider url={"settings/contract-expense-type"}>
      <ContractExpenseWrapper />
    </TableFormProvider>
  );
}

const ContractExpenseWrapper = () => {
  const { data, loading, page, setPage, limit, setLimit, totalPages, setData } =
    useDataFetcher("settings/contract-expense-type");
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
      headerName: "اسم المصروف",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "value",
      headerName: "القيمة",
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
        inputs={contractExpenseInputs}
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
      />
    </>
  );
};
