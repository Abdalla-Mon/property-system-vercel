import { renterInputs } from "@/app/renters/renterInputs";
import { rentAgreementTypeInputs } from "@/app/settings/rent-agreement-type/inputs";
import dayjs from "dayjs";

export const rentAgreementInputs = [
  {
    data: {
      id: "unitId",
      type: "select",
      label: "الوحدة",
      name: "unitId",
    },
    autocomplete: true,
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال الوحدة",
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
      id: "rentAgreementNumber",
      type: "text",
      label: "رقم العقد",
      name: "rentAgreementNumber",
    },
    autocomplete: true,

    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رقم العقد",
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
    id: "renter",
    data: {
      id: "renterId",
      type: "select",
      label: "المستأجر",
      name: "renterId",
    },
    createData: renterInputs,
    autocomplete: true,
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال المستأجر",
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
    id: "type",
    data: {
      id: "typeId",
      type: "select",
      label: "نوع العقد",
      name: "typeId",
    },
    createData: rentAgreementTypeInputs,
    autocomplete: true,
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال نوع العقد",
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
    id: "rentCollectionType",
    data: {
      id: "rentCollectionType",
      type: "select",
      label: "نوع التحصيل",
      name: "rentCollectionType",
    },
    hasOptions: true,
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال نوع التحصيل",
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
      id: "totalPrice",
      type: "number",
      label: "السعر الكلي",
      name: "totalPrice",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال السعر الكلي",
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
      id: "startDate",
      type: "date",
      label: "تاريخ البداية",
      name: "startDate",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال تاريخ البداية",
      },
    },
    onChange: (date, setValue) => {
      const newEndDate = dayjs(date).add(1, "year");
      setValue("endDate", newEndDate.format("YYYY-MM-DD"));
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
      id: "endDate",
      type: "date",
      label: "تاريخ النهاية",
      name: "endDate",
    },
    watchData: "startDate",

    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال تاريخ النهاية",
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
      id: "tax",
      type: "number",
      label: "الضريبة",
      name: "tax",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال الضريبة",
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
      id: "registrationFees",
      type: "number",
      label: "رسوم التسجيل",
      name: "registrationFees",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رسوم التسجيل",
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
      id: "insuranceFees",
      type: "number",
      label: "رسوم التأمين",
      name: "insuranceFees",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال رسوم التأمين",
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
];
