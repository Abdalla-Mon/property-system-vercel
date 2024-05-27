export const stateInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم الولاية",
      name: "name",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم الولاية",
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
