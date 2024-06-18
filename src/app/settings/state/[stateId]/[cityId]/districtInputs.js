export const districtInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم المنطقه",
      name: "name",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم المنطقه",
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
