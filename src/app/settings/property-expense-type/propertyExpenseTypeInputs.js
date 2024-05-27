export const propertyExpenseTypeInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم نوع المصروف",
      name: "name",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم نوع المصروف",
      },
    },
  },
];
