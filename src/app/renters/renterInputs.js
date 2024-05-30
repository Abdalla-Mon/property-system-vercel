// renterInputs.js
export const renterInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم المستأجر",
      name: "name",
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
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم المستأجر",
      },
    },
  },
  {
    data: {
      id: "phone",
      type: "number",
      label: "رقم الهاتف",
      name: "phone",
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
    data: {
      id: "email",
      type: "text",
      label: "الإيميل",
      name: "email",
    },
  },
  {
    data: {
      id: "nationalId",
      type: "text",
      label: "هوية المستأجر",
      name: "nationalId",
    },
  },
];
