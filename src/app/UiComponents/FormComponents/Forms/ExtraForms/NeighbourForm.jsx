import { useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const NeighboursForm = ({ neighbours, setNeighbours }) => {
  const handleAddNeighbour = () => {
    setNeighbours([...neighbours, { name: "", location: "" }]);
  };

  const handleRemoveNeighbour = (index) => {
    const newNeighbours = [...neighbours];
    newNeighbours.splice(index, 1);
    setNeighbours(newNeighbours);
  };

  const handleNeighbourChange = (index, key, value) => {
    const newNeighbours = [...neighbours];
    newNeighbours[index][key] = value;
    setNeighbours(newNeighbours);
  };

  return (
    <div className="neighbours-form">
      <h4 className="text-md font-semibold mb-2">لمنطقه</h4>
      {neighbours?.map((neighbour, index) => (
        <div key={index} className="flex items-center mb-2 gap-4">
          <TextField
            label="اسم المنطقه"
            variant="outlined"
            value={neighbour.name}
            onChange={(e) =>
              handleNeighbourChange(index, "name", e.target.value)
            }
            className="mr-2"
          />
          <TextField
            label="موقع المنطقه"
            variant="outlined"
            value={neighbour.location}
            onChange={(e) =>
              handleNeighbourChange(index, "location", e.target.value)
            }
            className="mr-2"
          />
          <IconButton
            onClick={() => handleRemoveNeighbour(index)}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <Button onClick={handleAddNeighbour} variant="contained">
        إضافة منطقه
      </Button>
    </div>
  );
};
