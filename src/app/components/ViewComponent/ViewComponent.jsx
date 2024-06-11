"use client";

import { useEffect, useState } from "react";
import DataGrid from "@/app/components/DataGrid/DataGrid";
import CustomTable from "@/app/components/Tables/CustomTable";
import { EditTableModal } from "@/app/UiComponents/Modals/EditTableModal";
import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { CreateFormModal } from "@/app/UiComponents/Modals/CreateFormModal"; // Import the new modal component

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
  noTabs,
  submitFunction,
  setIdEditing,
  onModalOpen,
}) {
  const [view, setView] = useState("table");
  const [showForm, setShowForm] = useState(directEdit);
  const { openModal, submitData } = useTableForm();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  async function create(data) {
    if (handleEditBeforeSubmit) {
      const continueCreation = handleEditBeforeSubmit();
      if (!continueCreation) return;
    }
    data = { ...data, extraData };

    const newData = submitFunction
      ? await submitFunction(data)
      : await submitData(data, null, null, "POST", null, "json", url);
    if (rows.length < limit && newData) {
      setData((old) => [...old, newData]);
    } else {
      setTotal((old) => old + 1);
    }
    return newData;
  }

  useEffect(() => {
    if (openModal && !noModal) {
      setShowForm(false);
    }
  }, [openModal]);

  const handleOpenCreateModal = () => {
    if (setIdEditing) {
      setIdEditing(null);
    }
    setCreateModalOpen(true);
    onModalOpen && onModalOpen();
  };
  const handleCloseCreateModal = () => setCreateModalOpen(false);

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
      {!noTabs && (
        <div className="flex justify-end mb-4 gap-3">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenCreateModal} // Open the create form modal
          >
            {showForm ? "إخفاء النموذج" : " اتشاء"}
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
      <CreateFormModal
        open={createModalOpen}
        handleClose={handleCloseCreateModal}
        inputs={inputs}
        onSubmit={async (data) => {
          const submit = await create(data);
          if (submit) {
            handleCloseCreateModal();
          }
        }}
        disabled={disabled}
        createModalsData={createModalsData}
        reFetch={reFetch}
      >
        {children}
      </CreateFormModal>
    </div>
  );
}
