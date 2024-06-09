"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useState } from "react";

import { rentAgreementInputs } from "./rentInputs";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { submitRentAgreement } from "@/services/client/createRentAgreement";
import useEditState from "@/helpers/hooks/useEditState";
import { ExtraForm } from "@/app/UiComponents/FormComponents/Forms/ExtraForms/ExtraForm";
import { RenewRentModal } from "@/app/UiComponents/Modals/RenewRent"; // Import the RenewRentModal
import { CancelRentModal } from "@/app/UiComponents/Modals/CancelRentModal";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";
import { Button } from "@mui/material";
import Link from "next/link"; // Import the CancelRentModal
import { StatusType } from "@/app/constants/enums";

export default function PropertyPage() {
  return (
    <TableFormProvider url={"fast-handler"}>
      <RentWrapper />
    </TableFormProvider>
  );
}

const RentWrapper = () => {
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
  } = useDataFetcher("main/rentAgreements/");
  const { id, submitData } = useTableForm();
  const [propertyId, setPropertyId] = useState(null);
  const [disabled, setDisabled] = useState({
    unitId: true,
  });
  const [reFetch, setRefetch] = useState({
    unitId: false,
  });
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [renewData, setRenewData] = useState(null);
  const [cancelData, setCancelData] = useState(null);

  async function getRenters() {
    const res = await fetch("/api/fast-handler?id=renter");
    const data = await res.json();

    return { data };
  }

  async function getRentTypes() {
    const res = await fetch("/api/fast-handler?id=rentType");
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.title,
      };
    });
    return { data: dataWithLabel };
  }

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();
    return { data };
  }

  function handlePropertyChange(value) {
    setPropertyId(value);
    setDisabled({
      ...disabled,
      unitId: false,
    });
    setRefetch({
      ...reFetch,
      unitId: true,
    });
  }

  async function getUnits() {
    const res = await fetch(
      "/api/fast-handler?id=unit&propertyId=" + propertyId,
    );
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.unitId,
        disabled: item.rentAgreements?.some((rent) => rent.status === "ACTIVE"),
      };
    });

    return { data: dataWithLabel, id: propertyId };
  }

  async function getRentCollectionType() {
    const data = [
      { id: "TWO_MONTHS", name: "شهرين" },
      { id: "THREE_MONTHS", name: "ثلاثة أشهر" },
      { id: "FOUR_MONTHS", name: "أربعة أشهر" },
      { id: "SIX_MONTHS", name: "ستة أشهر" },
      { id: "ONE_YEAR", name: "سنة واحدة" },
    ];
    return { data };
  }

  const dataInputs = rentAgreementInputs.map((input) => {
    switch (input.data.id) {
      case "rentCollectionType":
        return {
          ...input,
          extraId: false,
          getData: getRentCollectionType,
        };
      case "renterId":
        return {
          ...input,
          extraId: false,
          getData: getRenters,
        };
      case "typeId":
        return {
          ...input,
          extraId: false,
          getData: getRentTypes,
        };
      case "propertyId":
        return {
          ...input,
          getData: getProperties,
          onChange: handlePropertyChange,
        };
      case "unitId":
        return {
          ...input,
          getData: getUnits,
        };
      default:
        return input;
    }
  });

  async function handleDelete(id) {
    await submitData(
      null,
      null,
      id,
      "DELETE",
      null,
      null,
      "main/rentAgreements",
    );

    const filterData = data.filter((item) => +item.id !== +id);
    setData(filterData);
    setTotal((old) => old - 1);
    if (page === 1 && total >= limit) {
      setRender((old) => !old);
    } else {
      setPage((old) => (old > 1 ? old - 1 : 1) || 1);
    }
  }

  const handleOpenRenewModal = (rentData) => {
    setRenewData(rentData);
    setRenewModalOpen(true);
  };

  const handleCloseRenewModal = () => {
    setRenewModalOpen(false);
    setRenewData(null);
  };

  const handleOpenCancelModal = (rentData) => {
    setCancelData(rentData);
    setCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
    setCancelData(null);
  };

  const handleCancelConfirm = async () => {
    await submitRentAgreement(
      { ...cancelData },
      setSubmitLoading,
      "PUT",
      [
        {
          route: `/${cancelData.id}?installments=true`,
          message: "جاري البحث عن اي دفعات لم يتم استلامها...",
        },
        {
          route: `/${cancelData.id}?feeInvoices=true`,
          message: "جاري البحث عن اي رسوم لم يتم دفعها...",
        },
        {
          route: `/${cancelData.id}?otherExpenses=true`,
          message: "جاري البحث عن اي مصاريف اخري لم يتم دفعها...",
        },
        {
          route: `/${cancelData.id}?cancel=true`,
          message: "جاري تحديث حالة العقد القديم...",
        },
      ],
      true,
    );
    const newData = data.map((item) => {
      if (item.id === cancelData.id) {
        return { ...item, status: "CANCELED" };
      }
      return item;
    });
    setData(newData);
    handleCloseCancelModal();
  };

  const [otherExpenses, setOtherExpenses] = useState([]);
  const { setLoading: setSubmitLoading } = useToastContext();

  const handleRenewSubmit = async (data) => {
    if (handleEditBeforeSubmit) {
      const continueCreation = handleEditBeforeSubmit();
      if (!continueCreation) return;
    }
    const extraData = { otherExpenses };
    data = { ...data, extraData };
    const returedData = await submitRentAgreement(
      { ...data },
      setSubmitLoading,
      "PUT",
      [
        {
          route: `/${renewData.id}?installments=true`,
          message: "جاري البحث عن اي دفعات لم يتم استلامها...",
        },
        {
          route: `/${renewData.id}?feeInvoices=true`,
          message: "جاري البحث عن اي رسوم لم يتم دفعها...",
        },
        {
          route: `/${renewData.id}?otherExpenses=true`,
          message: "جاري البحث عن اي مصاريف اخري لم يتم دفعها...",
        },
        {
          route: `/${renewData.id}?renew=true`,
          message: "جاري تحديث حالة العقد القديم...",
        },
      ],
    );

    setData((old) =>
      [...old, returedData].map((item) => {
        if (item.id === renewData.id) {
          return { ...item, status: "EXPIRED" };
        }
        return item;
      }),
    );
    handleCloseRenewModal();
  };

  const columns = [
    {
      field: "rentAgreementNumber",
      headerName: "رقم العقد",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"rent/" + params.row.id}>
          <Button variant={"text"}>{params.row.rentAgreementNumber}</Button>
        </Link>
      ),
    },
    {
      field: "propertyId",
      headerName: "اسم العقار",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/properties/" + params.row.unit.property.id}>
          <Button variant={"text"}>{params.row.unit.property.name}</Button>
        </Link>
      ),
    },
    {
      field: "unit",
      headerName: "معرف الوحده",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/units/" + params.row.unit?.id}>
          <Button
            variant={"text"}
            sx={{
              maxWidth: 100,
              overflow: "auto",
            }}
          >
            {params.row.unit?.unitId}
          </Button>
        </Link>
      ),
    },

    {
      field: "renter",
      headerName: "المستأجر",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link
          href={"/renters/" + params.row.renter?.id}
          className={"flex justify-center"}
        >
          <Button variant={"text"}>{params.row.renter?.name}</Button>
        </Link>
      ),
    },
    {
      field: "status",
      headerName: "الحالة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => <>{StatusType[params.row.status]}</>,
    },
    {
      field: "startDate",
      headerName: "تاريخ البداية",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{new Date(params.row.startDate).toLocaleDateString()}</>
      ),
    },
    {
      field: "endDate",
      headerName: "تاريخ النهاية",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{new Date(params.row.endDate).toLocaleDateString()}</>
      ),
    },
    {
      field: "totalPrice",
      headerName: "السعر الكلي",
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
          {params.row.status === "ACTIVE" && (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 1,
                  mr: 1,
                }}
                onClick={() => handleOpenRenewModal(params.row)}
              >
                تجديد
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  mt: 1,
                  mr: 1,
                }}
                onClick={() => handleOpenCancelModal(params.row)}
              >
                الغاء العقد
              </Button>
            </>
          )}
          <DeleteBtn handleDelete={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];

  const otherExpencesFields = [
    {
      id: "name",
      type: "text",
      label: "اسم مصروف",
    },
    {
      id: "value",
      type: "number",
      label: "السعر",
    },
  ];
  const {
    isEditing,
    setIsEditing,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    handleEditBeforeSubmit,
  } = useEditState([
    { name: "otherExpenses", message: "جميع المصاريف الاخري" },
  ]);

  async function submit(data) {
    return await submitRentAgreement(data, setSubmitLoading);
  }

  return (
    <>
      <ViewComponent
        inputs={dataInputs}
        formTitle={"انشاء عقد ايجار "}
        totalPages={totalPages}
        rows={data}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        extraData={{ otherExpenses }}
        extraDataName={"otherExpenses"}
        id={id}
        loading={loading}
        setData={setData}
        setTotal={setTotal}
        total={total}
        noModal={true}
        disabled={disabled}
        reFetch={reFetch}
        submitFunction={submit}
        url={"main/rentAgreements"}
        handleEditBeforeSubmit={handleEditBeforeSubmit}
      >
        <div className={"w-full"}>
          <ExtraForm
            setItems={setOtherExpenses}
            items={otherExpenses}
            fields={otherExpencesFields}
            title={"مصاريف اخري"}
            formTitle={"مصاريف اخري"}
            name={"otherExpenses"}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarOpen={setSnackbarOpen}
            snackbarMessage={snackbarMessage}
            snackbarOpen={snackbarOpen}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </ViewComponent>

      <RenewRentModal
        open={renewModalOpen}
        handleClose={handleCloseRenewModal}
        initialData={renewData}
        inputs={dataInputs}
        onSubmit={handleRenewSubmit}
      >
        <div className={"w-full"}>
          <ExtraForm
            setItems={setOtherExpenses}
            items={otherExpenses}
            fields={otherExpencesFields}
            title={"مصاريف اخري"}
            formTitle={"مصاريف اخري"}
            name={"otherExpenses"}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarOpen={setSnackbarOpen}
            snackbarMessage={snackbarMessage}
            snackbarOpen={snackbarOpen}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </RenewRentModal>

      <CancelRentModal
        open={cancelModalOpen}
        handleClose={handleCloseCancelModal}
        handleConfirm={handleCancelConfirm}
      />
    </>
  );
};
