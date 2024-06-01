"use client";

import { useEffect, useState } from "react";
import MainTable from "@/app/components/Tables/MainTable";
import DataGrid from "@/app/components/DataGrid/DataGrid";
import CustomTable from "@/app/components/Tables/CustomTable";
import { EditTableModal } from "@/app/UiComponents/Modals/EditTableModal/EditTableModal";
import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";
import { Button } from "@mui/material";

export default function ViewComponent({
  columns,
  rows = [],
  page,
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
  setTotal,
  total,
  noModal = false,
  directEdit = false,
  disabled,
  createModalsData,
  reFetch,
  url,
  handleEditBeforeSubmit,
}) {
  const [view, setView] = useState("table");
  const [showForm, setShowForm] = useState(directEdit);
  const { openModal, submitData } = useTableForm();

  async function create(data) {
    if (handleEditBeforeSubmit) {
      const continueCreation = handleEditBeforeSubmit();
      console.log(continueCreation);
      if (!continueCreation) return;
    }
    data = { ...data, extraData };

    const newData = await submitData(
      data,
      null,
      null,
      "POST",
      null,
      "json",
      url,
    );

    if (rows.length < limit) {
      setData((old) => [...old, newData]);
    } else {
      setTotal((old) => old + 1);
    }
  }

  useEffect(() => {
    if (openModal && !noModal) {
      setShowForm(false);
    }
  }, [openModal]);
  return (
    <div className="">
      {openModal && !noModal && (
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
          handleEditBeforeSubmit={handleEditBeforeSubmit}
        >
          {children}
        </EditTableModal>
      )}
      <div className="flex justify-end mb-4 gap-3">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
        >
          {showForm ? "إخفاء النموذج" : "اظهار نموذج الانشاء"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setView("table")}
        >
          عرض الجدول
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => setView("dataGrid")}
        >
          عرض كارت
        </Button>
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
            btnText={directEdit ? "تعديل" : "إضافة"}
            disabled={disabled}
            extraData={createModalsData}
            reFetch={reFetch}
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
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
          total={total}
          setTotal={setTotal}
        />
      )}

      {view === "dataGrid" && (
        <DataGrid
          columns={columns}
          rows={rows}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
          total={total}
          setTotal={setTotal}
        />
      )}
    </div>
  );
}
