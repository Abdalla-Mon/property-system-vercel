export const stateInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم الاماره",
      name: "name",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم الاماره",
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
