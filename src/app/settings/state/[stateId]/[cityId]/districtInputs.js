export const districtInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم الحي",
      name: "name",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم الحي",
      },
    },
  },
  {
    data: {
      id: "location",
      type: "text",
      label: "الموقع",
      name: "location",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال الموقع",
      },
    },
  },
];
