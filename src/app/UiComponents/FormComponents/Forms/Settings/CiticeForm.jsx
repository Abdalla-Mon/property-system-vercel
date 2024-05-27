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
    setCities([...cities, { name: "", location: "", districts: [] }]);
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

  const handleDistrictsChange = (index, districts) => {
    const newCities = [...cities];
    newCities[index].districts = districts;
    setCities(newCities);
  };

  return (
    <div className="cities-form">
      {cities?.map((city, index) => (
        <div key={index} className="flex flex-col mb-2 gap-4">
          <h3 className="text-lg font-semibold mb-2">المدينه</h3>
          <div className="flex items-center gap-4">
            <TextField
              label="اسم المنطقه"
              variant="outlined"
              value={city.name}
              onChange={(e) => handleCityChange(index, "name", e.target.value)}
              className="mr-2"
            />
            <TextField
              label="موقع المنطقه"
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
          <DistrictsForm
            districts={city.districts}
            setDistricts={(districts) =>
              handleDistrictsChange(index, districts)
            }
          />
        </div>
      ))}
      <Button onClick={handleAddCity} variant="contained">
        إضافة مدينة
      </Button>
    </div>
  );
};

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
