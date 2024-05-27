"use client";

import { useEffect, useState } from "react";
import MainTable from "@/app/components/Tables/MainTable";
import DataGrid from "@/app/components/DataGrid/DataGrid";
import CustomTable from "@/app/components/Tables/CustomTable";
import { EditTableModal } from "@/app/components/EditTableModal/EditTableModal";
import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";

export default function ViewComponent({
  columns,
  rows = [],
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
  loading,
  inputs,
  setData,
  id,
  children,
  extraData,
  extraDataName,
  setExtraData,
  fullWidth,
}) {
  const [view, setView] = useState("table");
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const { openModal, submitData } = useTableForm();

  async function create(data) {
    data = { ...data, extraData };
    const newData = await submitData(data, null, null, "POST");
    setData((old) => [...old, newData]);
  }

  useEffect(() => {
    if (openModal && setShowForm) {
      setShowForm(false);
    }
  }, [openModal]);
  return (
    <div className="">
      {openModal && (
        <EditTableModal
          fullWidth={fullWidth}
          inputs={inputs}
          formTitle={"تعديل"}
          rows={rows}
          id={id}
          setData={setData}
          extraDataName={extraDataName}
          setExtraData={setExtraData}
          extraData={extraData}
        >
          {children}
        </EditTableModal>
      )}
      <div className="flex justify-end mb-4">
        <button
          className="mx-2 px-4 py-2 bg-blue-500 text-white"
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
        >
          {showForm ? "إخفاء النموذج" : "اظهار نموذج الانشاء"}
        </button>
        <button
          className="mx-2 px-4 py-2 bg-blue-500 text-white"
          onClick={() => setView("table")}
        >
          عرض الجدول
        </button>

        <button
          className="mx-2 px-4 py-2 bg-blue-500 text-white"
          onClick={() => setView("dataGrid")}
        >
          عرض كارت
        </button>
      </div>
      {showForm && (
        <div className="mb-4">
          <Form
            formTitle={"إضافة"}
            inputs={inputs}
            onSubmit={(data) => {
              create(data);
            }}
            variant={"outlined"}
            btnText={"إضافة"}
          >
            {children}
          </Form>
        </div>
      )}
      {view === "table" && (
        <CustomTable
          columns={columns}
          rows={rows}
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
        />
      )}

      {view === "dataGrid" && (
        <DataGrid
          columns={columns}
          rows={rows}
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
        />
      )}
    </div>
  );
}
