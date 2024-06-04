import { useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const DistrictsForm = ({ districts, setDistricts }) => {
  const handleAddDistrict = () => {
    setDistricts([...districts, { name: "", location: "" }]);
  };

  const handleRemoveDistrict = (index) => {
    const newDistricts = [...districts];
    newDistricts.splice(index, 1);
    setDistricts(newDistricts);
  };

  const handleDistrictChange = (index, key, value) => {
    const newDistricts = [...districts];
    newDistricts[index][key] = value;
    setDistricts(newDistricts);
  };

  return (
    <div className="districts-form">
      <h4 className="text-md font-semibold mb-2">الأحياء</h4>
      {districts?.map((district, index) => (
        <div key={index} className="flex items-center mb-2 gap-4">
          <TextField
            label="اسم الحي"
            variant="outlined"
            value={district.name}
            onChange={(e) =>
              handleDistrictChange(index, "name", e.target.value)
            }
            className="mr-2"
          />
          <TextField
            label="موقع الحي"
            variant="outlined"
            value={district.location}
            onChange={(e) =>
              handleDistrictChange(index, "location", e.target.value)
            }
            className="mr-2"
          />
          <IconButton
            onClick={() => handleRemoveDistrict(index)}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <Button onClick={handleAddDistrict} variant="contained">
        إضافة حي
      </Button>
    </div>
  );
};
