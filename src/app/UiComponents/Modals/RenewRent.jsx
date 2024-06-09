import { Modal, Box, Typography } from "@mui/material";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";
import { useEffect, useState } from "react";

export function RenewRentModal({
  open,
  handleClose,
  initialData,
  inputs,
  onSubmit,
  children,
}) {
  const [modalInputs, setModalInputs] = useState([]);

  useEffect(() => {
    function createInputs() {
      inputs[0] = {
        data: {
          id: "propertyId",
          label: "العقار",
          type: "text",
          name: "propertyId",
          disabled: true,
        },
        value: initialData?.unit.property.name,
        sx: {
          width: {
            xs: "100%",
            sm: "48%",
          },
          mr: "auto",
        },
      };
      inputs[1] = {
        data: {
          id: "unitNumber",
          label: "معرف الوحدة",
          type: "text",
          disabled: true,
        },

        value: initialData?.unit.unitId,
        sx: {
          width: {
            xs: "100%",
            sm: "48%",
          },
        },
      };
      inputs[inputs.length] = {
        data: {
          id: "unitId",
          label: "الوحدة",
          type: "text",
          name: "unitId",
        },
        sx: {
          width: {
            xs: "100%",
            sm: "48%",
          },
          display: "none",
        },
      };

      const newInputs =
        initialData &&
        inputs.map((input) => {
          if (input.data.id === "propertyId" || input.data.id === "unitNumber")
            return input;
          return { ...input, value: initialData[input.data.id] };
        });
      setModalInputs(newInputs);
    }

    createInputs();
  }, [open, initialData]);

  if (!open) return null;
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
          تجديد عقد الإيجار
        </Typography>
        <Form
          formTitle={"تجديد عقد الإيجار"}
          inputs={modalInputs}
          onSubmit={onSubmit}
          variant={"outlined"}
          btnText={"تجديد"}
          initialData={initialData}
        >
          {children}
        </Form>
      </Box>
    </Modal>
  );
}
