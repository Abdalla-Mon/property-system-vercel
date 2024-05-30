import { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";

export const ExtraForm = ({ items, setItems, title, fields }) => {
  const { openModal } = useTableForm();
  const [editableItems, setEditableItems] = useState(items?.map(() => false));

  useEffect(() => {
    if (!openModal) {
      setItems([]);
    }
  }, [openModal]);

  const handleAddItem = () => {
    const newItem = {};
    fields.forEach((field) => (newItem[field.id] = ""));
    setItems([...items, newItem]);
    setEditableItems([...editableItems, true]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    const newEditableItems = [...editableItems];
    newItems.splice(index, 1);
    newEditableItems.splice(index, 1);
    setItems(newItems);
    setEditableItems(newEditableItems);
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  return (
    <div className="dynamic-form">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {items?.map((item, index) => (
        <div key={index} className="flex flex-col mb-2 gap-4">
          <div className="flex items-center gap-4">
            {fields.map((field) => (
              <TextField
                key={field.id}
                label={field.label}
                variant="outlined"
                value={item[field.id]}
                onChange={(e) =>
                  handleItemChange(index, field.id, e.target.value)
                }
                className="mr-2"
              />
            ))}
            <IconButton
              onClick={() => handleRemoveItem(index)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}
      <Button onClick={handleAddItem} variant="contained">
        إضافة {title}
      </Button>
    </div>
  );
};
