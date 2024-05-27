import { Modal, Box } from "@mui/material";
import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";
import { useEffect } from "react";

const modalStyle = (fullWidth) => ({
  position: "absolute",
  width: fullWidth ? "29.5cm" : "50%",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  maxWidth: fullWidth ? "100%" : "50%",
});

export function EditTableModal({
  inputs,
  rows,
  formTitle,
  id,
  setData,
  extraDataName,
  setExtraData,
  children,
  extraData,
  fullWidth,
}) {
  const { openModal, setOpenModal, submitData } = useTableForm();
  const data = rows.find((row) => row.id === id);
  useEffect(() => {
    if (extraDataName) {
      setExtraData(data[extraDataName]);
    }
  }, [extraDataName]);
  const modalInputs =
    data &&
    inputs?.map((input) => {
      return {
        ...input,
        value: data[input.data.id],
      };
    });
  const modelStyle = modalStyle(fullWidth);
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <Box sx={modelStyle}>
        <Form
          formTitle={formTitle}
          inputs={modalInputs}
          onSubmit={async (data) => {
            data = { ...data, extraData };
            const newData = await submitData(data, setOpenModal, id);
            const editedData = rows.map((row) => {
              return row.id === newData.id ? newData : row;
            });
            setData(editedData);
          }}
          variant={"outlined"}
          btnText={"تعديل"}
        >
          {children}
        </Form>
      </Box>
    </Modal>
  );
}
