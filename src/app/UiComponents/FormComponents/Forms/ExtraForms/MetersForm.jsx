import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";
import { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const MetersForm = ({ meters, setMeters }) => {
  const { openModal } = useTableForm();
  const [editableMeters, setEditableMeters] = useState(
    meters?.map(() => false),
  );

  useEffect(() => {
    if (!openModal) {
      setMeters([]);
    }
  }, [openModal]);

  const handleAddMeter = () => {
    setMeters([...meters, { meterId: "", name: "" }]);
    setEditableMeters([...editableMeters, true]);
  };

  const handleRemoveMeter = (index) => {
    const newMeters = [...meters];
    const newEditableMeters = [...editableMeters];
    newMeters.splice(index, 1);
    newEditableMeters.splice(index, 1);
    setMeters(newMeters);
    setEditableMeters(newEditableMeters);
  };

  const handleMeterChange = (index, key, value) => {
    const newMeters = [...meters];
    newMeters[index][key] = value;
    setMeters(newMeters);
  };

  return (
    <div className="meters-form">
      <h3 className="text-lg font-semibold mb-2">عدادات الكهرباء</h3>
      {meters?.map((meter, index) => (
        <div key={index} className="flex flex-col mb-2 gap-4">
          <div className="flex items-center gap-4">
            <TextField
              label="معرف العداد"
              variant="outlined"
              value={meter.meterId}
              onChange={(e) =>
                handleMeterChange(index, "meterId", e.target.value)
              }
              className="mr-2"
            />
            <TextField
              label="اسم العداد"
              variant="outlined"
              value={meter.name}
              onChange={(e) => handleMeterChange(index, "name", e.target.value)}
              className="mr-2"
            />
            <IconButton
              onClick={() => handleRemoveMeter(index)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}
      <Button onClick={handleAddMeter} variant="contained">
        إضافة عداد
      </Button>
    </div>
  );
};
