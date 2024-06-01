import { propertyTypeInputs } from "@/app/settings/property-type/propertyTypeInputs";
import { stateInputs } from "@/app/settings/state/inputs";
import { cityInputs } from "@/app/settings/state/[stateId]/cityInputs";
import { districtInputs } from "@/app/settings/state/[stateId]/[cityId]/districtInputs";
import { ownerInputs } from "@/app/owners/ownerInputs";
import { bankInputs } from "@/app/settings/bank/inputs";
import { collectorInputs } from "@/app/settings/collectors/collectorInputs";

export const propertyInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم العقار",
      name: "name",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم العقار",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    id: "propertyType",
    data: {
      id: "typeId",
      type: "select",
      label: "نوع العقار",
      name: "typeId",
    },

    createData: propertyTypeInputs,
    autocomplete: true,
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال نوع العقار",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "propertyId",
      type: "number",
      label: "معرف العقار",
      name: "propertyId",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال معرف العقار",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "voucherNumber",
      type: "number",
      label: "رقم القسيمة",
      name: "voucherNumber",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رقم القسيمة",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    id: "state",
    data: {
      id: "stateId",
      type: "select",
      label: "المحافظه",
      name: "stateId",
    },
    createData: stateInputs,
    autocomplete: true,
    sx: {
      width: {
        xs: "100%",
        sm: "48%",
        md: "47%",
        lg: "48%",
      },
      mr: "auto",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال المحافظه",
      },
    },
  },
  {
    id: "city",
    data: {
      id: "cityId",
      type: "select",
      label: "المدينة",
      name: "cityId",
    },
    extraId: true,
    createData: cityInputs,
    autocomplete: true,
    rerender: true,
    sx: {
      width: {
        xs: "100%",
        sm: "48%",
        md: "47%",
        lg: "48%",
      },
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال المدينة",
      },
    },
  },
  {
    id: "district",
    data: {
      id: "districtId",
      type: "select",
      label: "الحي",
      name: "districtId",
    },
    extraId: true,
    createData: districtInputs,
    autocomplete: true,
    rerender: true,
    sx: {
      width: {
        xs: "100%",
        sm: "48%",
        md: "47%",
        lg: "48%",
      },
      mr: "auto",
    },
  },
  {
    id: "neighbour",
    data: {
      id: "neighbourId",
      type: "select",
      label: "المنطقة",
      name: "neighbourId",
    },
    createData: [
      {
        data: {
          id: "name",
          type: "text",
          label: "اسم المنطقه",
          name: "name",
        },
      },
      {
        data: {
          id: "location",
          type: "text",
          label: "الموقع",
          name: "location",
        },
      },
    ],
    extraId: true,

    autocomplete: true,
    rerender: true,

    sx: {
      width: {
        xs: "100%",
        sm: "48%",
        md: "47%",
        lg: "48%",
      },
    },
  },
  {
    data: {
      id: "street",
      type: "text",
      label: "الشارع",
      name: "street",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال الشارع",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "plateNumber",
      type: "number",
      label: "رقم اللوحة",
      name: "plateNumber",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رقم اللوحة",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "price",
      type: "number",
      label: "قيمة العقار",
      name: "price",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال قيمة العقار",
      },
    },
    sx: {
      width: {
        xs: "100%",
        sm: "48%",
        md: "47%",
        lg: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "dateOfBuilt",
      type: "date",
      label: "تاريخ البناء",
      name: "dateOfBuilt",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال تاريخ البناء",
      },
    },
    sx: {
      width: {
        xs: "100%",
        sm: "48%",
        md: "47%",
        lg: "48%",
      },
    },
  },
  {
    id: "owner",
    data: {
      id: "clientId",
      type: "select",
      label: "اسم المالك",
      name: "clientId",
    },
    createData: ownerInputs,
    autocomplete: true,
    pattern: {
      required: {
        value: true,
        message: "يرجى اختيار اسم المالك",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    id: "bank",
    data: {
      id: "bankId",
      type: "select",
      label: "اسم البنك",
      name: "bankId",
    },
    createData: bankInputs,
    autocomplete: true,

    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم البنك",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    id: "collector",
    data: {
      id: "collectorId",
      type: "select",
      label: "اسم المحصل",
      name: "collectorId",
    },
    createData: collectorInputs,
    autocomplete: true,
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم المحصل",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "bankAccountNumber",
      type: "number",
      label: "رقم الحساب البنكي",
      name: "bankAccountNumber",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رقم الحساب البنكي",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "managementCommission",
      type: "number",
      label: "عمولة اداره العقار",
      name: "managementCommission",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال عمولة اداره العقار",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "numElevators",
      type: "number",
      label: "عدد المصاعد",
      name: "numElevators",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال عدد المصاعد",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "numParkingSpaces",
      type: "number",
      label: "عدد المواقف",
      name: "numParkingSpaces",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال عدد المواقف",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "builtArea",
      type: "number",
      label: "مساحة البناء",
      name: "builtArea",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال مسطح البناء",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "buildingGuardName",
      type: "text",
      label: "اسم حارس العمارة",
      name: "buildingGuardName",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم حارس العمارة",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "buildingGuardPhone",
      type: "number",
      label: "رقم جوال حارس",
      name: "buildingGuardPhone",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رقم جوال حارس",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "buildingGuardId",
      type: "number",
      label: "هوية حارس",
      name: "buildingGuardId",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال هوية حارس",
      },
    },
    sx: {
      width: {
        xs: "100%",
        md: "100%",
      },
    },
  },
];
