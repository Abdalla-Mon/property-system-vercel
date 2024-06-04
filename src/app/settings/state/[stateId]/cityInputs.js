export const cityInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم المدينة",
      name: "name",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم المدينة",
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
