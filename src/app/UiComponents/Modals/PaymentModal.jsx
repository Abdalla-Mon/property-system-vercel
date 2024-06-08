import { Modal, Box } from "@mui/material";
import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";

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
  maxHeight: "90%",
  overflow: "auto",
});

export function PaymentModal({ modalInputs, id, submit }) {
  const { openModal, setOpenModal } = useTableForm();
  const modelStyle = modalStyle(false);
  if (!id || !modalInputs) return;
  return (
    <>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modelStyle}>
          <Form
            formTitle={"انشاء"}
            inputs={modalInputs}
            onSubmit={async (data) => {
              await submit(data);
            }}
            variant={"outlined"}
            btnText={"انشاء"}
          >
            {/*{children}*/}
          </Form>
        </Box>
      </Modal>
    </>
  );
}
