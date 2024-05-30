import { useTableForm } from "@/app/context/TableFormProvider/TableFormProvider";
import { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const CitiesForm = ({ cities, setCities }) => {
  const { openModal } = useTableForm();
  const [editableCities, setEditableCities] = useState(
    cities?.map(() => false),
  );

  useEffect(() => {
    if (!openModal) {
      setCities([]);
    }
  }, [openModal]);

  const handleAddCity = () => {
    setCities([...cities, { name: "", location: "" }]);
    setEditableCities([...editableCities, true]);
  };

  const handleRemoveCity = (index) => {
    const newCities = [...cities];
    const newEditableCities = [...editableCities];
    newCities.splice(index, 1);
    newEditableCities.splice(index, 1);
    setCities(newCities);
    setEditableCities(newEditableCities);
  };

  const handleCityChange = (index, key, value) => {
    const newCities = [...cities];
    newCities[index][key] = value;
    setCities(newCities);
  };

  return (
    <div className="cities-form">
      {cities?.map((city, index) => (
        <div key={index} className="flex flex-col mb-2 gap-4">
          <h3 className="text-lg font-semibold mb-2">المدينه</h3>
          <div className="flex items-center gap-4">
            <TextField
              label="اسم المدينه"
              variant="outlined"
              value={city.name}
              onChange={(e) => handleCityChange(index, "name", e.target.value)}
              className="mr-2"
            />
            <TextField
              label="موقع المدينه"
              variant="outlined"
              value={city.location}
              onChange={(e) =>
                handleCityChange(index, "location", e.target.value)
              }
              className="mr-2"
            />
            <IconButton
              onClick={() => handleRemoveCity(index)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}
      <Button onClick={handleAddCity} variant="contained">
        إضافة مدينة
      </Button>
    </div>
  );
};
