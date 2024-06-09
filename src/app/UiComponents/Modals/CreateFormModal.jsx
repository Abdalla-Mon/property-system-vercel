import { Modal, Box, Typography } from "@mui/material";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";

export function CreateFormModal({
  open,
  handleClose,
  inputs,
  onSubmit,
  disabled,
  createModalsData,
  reFetch,
  children,
}) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%",

            md: "750px",
            lg: "850px",
          },
          height: "90%",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: {
            xs: 1,
            sm: 2,
            md: 4,
          },
        }}
      >
        <Typography variant="h6" component="h2">
          إضافة
        </Typography>
        <Form
          formTitle={"إضافة"}
          inputs={inputs}
          onSubmit={onSubmit}
          variant={"outlined"}
          btnText={"إضافة"}
          disabled={disabled}
          extraData={createModalsData}
          reFetch={reFetch}
        >
          {children}
        </Form>
      </Box>
    </Modal>
  );
}
