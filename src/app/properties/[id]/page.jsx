"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import { useEffect, useState } from "react";
import { propertyInputs } from "@/app/properties/propertyInputs";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";
import { ExtraForm } from "@/app/UiComponents/FormComponents/Forms/ExtraForms/ExtraForm";
import { Button, Link as MUILINK } from "@mui/material";
import Link from "next/link";
import CustomTable from "@/app/components/Tables/CustomTable";
import { unitInputs } from "@/app/units/unitInputs";
import { CreateModal } from "@/app/UiComponents/Modals/CreateModal/CreateModal";
import useEditState from "@/helpers/hooks/useEditState";

export default function PropertyPage({ params }) {
  const id = params.id;
  return (
    <TableFormProvider url={"fast-handler"}>
      <PropertyWrapper urlId={id} />
    </TableFormProvider>
  );
}

const PropertyWrapper = ({ urlId }) => {
  const {
    data: units,
    loading: unitsLoading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    setData: setUnits,
    total,
    setTotal,
    setRender,
  } = useDataFetcher("main/properties/" + urlId + "/units", true);
  const { submitData } = useTableForm();

  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [renderdDefault, setRenderedDefault] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [disabled, setDisabled] = useState({
    cityId: true,
    districtId: true,
    neighbourId: true,
  });

  const [reFetch, setRefetch] = useState({
    cityId: false,
    districtId: false,
    neighbourId: false,
  });
  const [electricityMeters, setMeters] = useState([]);
  const metersFields = [
    { id: "name", label: "اسم العداد", type: "text" },
    { id: "meterId", label: "رقم العداد", type: "number" },
  ];
  const {
    isEditing: isMetersEditing,
    setIsEditing: setIsMetersEditing,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    handleEditBeforeSubmit,
  } = useEditState([{ name: "meters", message: "عدادات الكهرباء" }]);

  useEffect(() => {
    async function getPropertyData() {
      const res = await fetch("/api/main/properties/" + urlId);
      const data = await res.json();
      setData(data.data);
      setLoading(false);
    }

    getPropertyData();
  }, []);
  useEffect(() => {
    if (typeof data === "object" && !loading) {
      setStateId(data.stateId);
      setCityId(data.cityId);
      setDistrictId(data.districtId);
      setMeters(data.electricityMeters);
      setIsMetersEditing({
        meters: data.electricityMeters?.map(() => false),
      });
      setDisabled({
        cityId: data.stateId ? false : true,
        districtId: data.cityId ? false : true,
        neighbourId: data.districtId ? false : true,
      });

      window.setTimeout(() => setRenderedDefault(true), 100);
    }
  }, [loading, data]);

  async function getStatesData() {
    const res = await fetch("/api/fast-handler?id=state");
    const data = await res.json();

    return { data };
  }

  async function getCitiesDataByStateId() {
    const res = await fetch("/api/fast-handler?id=city&stateId=" + stateId);
    const data = await res.json();

    return { data, id: stateId };
  }

  async function getDistrictsDataByCityId() {
    const res = await fetch("/api/fast-handler?id=district&cityId=" + cityId);
    const data = await res.json();

    return { data, id: cityId };
  }

  async function getNeighboursDataByDistrictId() {
    const res = await fetch(
      "/api/fast-handler?id=neighbour&districtId=" + districtId,
    );
    const data = await res.json();
    return { data, id: districtId };
  }

  async function getBanksData() {
    const res = await fetch("/api/fast-handler?id=bank");
    const data = await res.json();
    return { data };
  }

  async function getOwners() {
    const res = await fetch("/api/fast-handler?id=owner");
    const data = await res.json();
    return { data };
  }

  async function getPropertyTypes() {
    const res = await fetch("/api/fast-handler?id=propertyType");
    const data = await res.json();
    return { data };
  }

  async function getCollectors() {
    const res = await fetch("/api/fast-handler?id=collector");
    const data = await res.json();
    return { data };
  }

  const handleStateChange = (newValue) => {
    setStateId(newValue);
    setCityId(null);
    setDistrictId(null);
    setDisabled({
      ...disabled,
      cityId: newValue === null,
      districtId: true,
      neighbourId: true,
    });
    setRefetch({ ...reFetch, cityId: true });
  };

  const handleCityChange = (newValue) => {
    setCityId(newValue);
    setDistrictId(null);
    setDisabled({
      ...disabled,
      districtId: newValue === null,
      neighbourId: true,
    });
    setRefetch({ ...reFetch, districtId: true, cityId: false });
  };

  const handleDistrictChange = (newValue) => {
    setDistrictId(newValue);
    setDisabled({
      ...disabled,
      neighbourId: newValue === null,
    });
    setRefetch({ ...reFetch, neighbourId: true, districtId: false });
  };

  const handleNeighbourChange = (newValue) => {
    setRefetch({ ...reFetch, neighbourId: false });
  };

  const dataInputs = propertyInputs.map((input) => {
    input = {
      ...input,
      value: data[input.data.id],
    };
    switch (input.data.id) {
      case "stateId":
        return {
          ...input,
          extraId: false,
          getData: getStatesData,
          onChange: handleStateChange,
        };
      case "cityId":
        return {
          ...input,
          getData: getCitiesDataByStateId,
          onChange: handleCityChange,
          disabled: disabled.cityId,
        };
      case "districtId":
        return {
          ...input,
          getData: getDistrictsDataByCityId,
          onChange: handleDistrictChange,
          disabled: disabled.districtId,
        };
      case "neighbourId":
        return {
          ...input,
          getData: getNeighboursDataByDistrictId,
          onChange: handleNeighbourChange,
          disabled: disabled.neighbourId,
        };
      case "bankId":
        return {
          ...input,
          extraId: false,
          getData: getBanksData,
        };
      case "collectorId":
        return {
          ...input,
          extraId: false,
          getData: getCollectors,
        };
      case "clientId":
        return {
          ...input,
          extraId: false,
          getData: getOwners,
        };
      case "typeId":
        return {
          ...input,
          extraId: false,
          getData: getPropertyTypes,
        };
      default:
        return input;
    }
  });

  async function create(data) {
    const contintueCreation = handleEditBeforeSubmit();
    if (!contintueCreation) {
      return;
    }
    const extraData = { electricityMeters };
    data = { ...data, extraData };
    await submitData(
      data,
      null,
      null,
      "PUT",
      null,
      "json",
      "main/properties/" + urlId,
    );
  }

  async function handleDelete(id) {
    const deleted = await submitData(
      null,
      null,
      null,
      "DELETE",
      null,
      "json",
      "main/units/" + id,
    );
    if (deleted) {
      setUnits(units.filter((unit) => unit.id !== id));
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
        <Link href={"/units/" + params.row.id}>
          <Button variant={"text"}>{params.row.id}</Button>
        </Link>
      ),
    },
    {
      field: "name",
      headerName: "اسم الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/units/" + params.row.id}>
          <Button variant={"text"}>{params.row.name}</Button>
        </Link>
      ),
    },
    {
      field: "unitId",
      headerName: "معرف الوحده",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "number",
      headerName: "رقم الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "typeId",
      headerName: "نوع الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => <>{params.row.type?.name}</>,
    },
    {
      field: "yearlyRentPrice",
      headerName: "سعر الإيجار السنوي",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "client",
      headerName: "اسم المستاجر",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={`/owners/${params.row.client?.id}`}>
          <Button variant={"text"}>{params.row.client?.name}</Button>
        </Link>
      ),
    },
    {
      field: "floor",
      headerName: "الدور",
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
    <div>
      {loading || !renderdDefault ? (
        <div>جاري تحميل بيانات العقار</div>
      ) : (
        <>
          {unitsLoading && !units ? (
            <div>جاري تحميل </div>
          ) : (
            <div className={"flex gap-3 items-center"}>
              اضافه وحده جديده لهذا العقار؟
              <CreateUnit
                propertyId={urlId}
                setUnits={setUnits}
                units={units}
              />
            </div>
          )}

          <div className="mb-4">
            <Form
              formTitle={"تعديل العقار"}
              inputs={dataInputs}
              onSubmit={(data) => {
                create(data);
              }}
              disabled={disabled}
              variant={"outlined"}
              btnText={"تعديل"}
              reFetch={reFetch}
            >
              <ExtraForm
                setItems={setMeters}
                items={electricityMeters}
                fields={metersFields}
                title={"عداد"}
                formTitle={"عدادات الكهرباء"}
                name={"meters"}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarOpen={setSnackbarOpen}
                snackbarMessage={snackbarMessage}
                snackbarOpen={snackbarOpen}
                isEditing={isMetersEditing}
                setIsEditing={setIsMetersEditing}
              />
            </Form>
          </div>
        </>
      )}
      {unitsLoading && !units ? (
        <div>جاري تحميل وحدات العقار</div>
      ) : (
        <CustomTable
          rows={units ? units : []}
          columns={columns}
          loading={unitsLoading || !units}
          setTotal={setTotal}
          total={total}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </div>
  );
};

function CreateUnit({ propertyId, setUnits, units }) {
  async function getUnitTypes() {
    const res = await fetch("/api/fast-handler?id=unitType");
    const data = await res.json();

    return { data };
  }

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();

    return { data };
  }

  const modalInputs = unitInputs;
  modalInputs[2] = {
    ...modalInputs[2],
    extraId: false,
    getData: getUnitTypes,
  };
  modalInputs[3] = {
    ...modalInputs[3],
    extraId: false,
    getData: getProperties,
    value: propertyId,
    data: {
      ...modalInputs[3].data,
      disabled: true,
    },
  };
  return (
    <CreateModal
      oldData={units}
      setData={setUnits}
      modalInputs={modalInputs}
      id={"unit"}

      // extraId={propertyId}
    />
  );
}
