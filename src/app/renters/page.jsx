"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { renterInputs } from "@/app/renters/renterInputs";
import Link from "next/link";

export default function RenterPage() {
  return (
    <TableFormProvider url={"clients/renter"}>
      <RenterWrapper />
    </TableFormProvider>
  );
}

const RenterWrapper = () => {
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
  } = useDataFetcher("clients/renter");
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
      renderCell: (params) => (
        <Link
          className={"text-blue-500 hover:text-blue-800"}
          href={`/renters/${params.row.id}`}
        >
          {params.row.id}
        </Link>
      ),
    },
    {
      field: "name",
      headerName: "اسم المستاجر",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link
          className={"text-blue-500 hover:text-blue-800"}
          href={`/renters/${params.row.id}`}
        >
          {params.row.name}
        </Link>
      ),
    },
    {
      field: "phone",
      headerName: "رقم الهاتف",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "email",
      headerName: "الإيميل",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "nationalId",
      headerName: "هوية المالك",
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
        inputs={renterInputs}
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
        setTotal={setTotal}
        total={total}
      />
    </>
  );
};
