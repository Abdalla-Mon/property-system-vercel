import { Modal, Box, Typography, Button } from "@mui/material";

export function CancelRentModal({ open, handleClose, handleConfirm }) {
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
            md: "fit-content",
          },
          height: "auto",
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
        <Typography variant="h6" component="h2" mb={2}>
          هل أنت متأكد أنك تريد إلغاء هذا العقد؟
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button variant="text" color="secondary" onClick={handleConfirm}>
            نعم
          </Button>
          <Button variant="text" onClick={handleClose}>
            إلغاء
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
