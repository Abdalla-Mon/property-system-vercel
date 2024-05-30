import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  CircularProgress,
  Autocomplete,
  TextField,
  MenuItem,
} from "@mui/material";
import { CreateModal } from "@/app/UiComponents/Modals/CreateModal/CreateModal";

export function MuiSelect({
  select,
  variant,
  register,
  errors,
  extraData,
  disabled,
  reFetch,
}) {
  if (select.autocomplete) {
    return (
      <MUIAutoComplete
        select={select}
        errors={errors}
        variant={variant}
        register={register}
        extraData={extraData}
        disabled={disabled}
        reFetch={reFetch}
      />
    );
  } else {
    return (
      <Select
        select={select}
        errors={errors}
        variant={variant}
        register={register}
      />
    );
  }
}

function Select({ select, variant, register, errors, extraData, disabled }) {
  const getData = select.getData;
  const selectData = select.data;
  const [options, setOptions] = useState(select.options);
  const [loading, setLoading] = useState(getData);
  const fullWidth = select.fullWidth;
  const [value, setValue] = useState(select.value);

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  useEffect(() => {
    if (!options && getData) {
      async function fetchOptions() {
        setLoading(true);
        const fetchedOptions = await getData();
        setOptions(fetchedOptions.data);
        setLoading(false);
      }

      fetchOptions();
    }
  }, []);

  return (
    <FormControl fullWidth={fullWidth} sx={select.sx}>
      <InputLabel id="demo-simple-select-label">{selectData.label}</InputLabel>
      <Select
        {...register(selectData.id, select.pattern)}
        {...selectData}
        value={value}
        onChange={handleChange}
        error={errors?.[selectData.id]}
        variant={variant}
      >
        {loading && "جاري تحميل الخيارات"}
        {options?.map((option) => (
          <MenuItem value={option.value} key={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errors[selectData.id]?.message}</FormHelperText>
    </FormControl>
  );
}

function MUIAutoComplete({
  select,
  variant,
  register,
  errors,
  extraData,
  disabled,
  reFetch,
}) {
  const getData = select.getData;
  const selectData = select.data;
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fullWidth = select.fullWidth;
  const [value, setValue] = useState(select.value);
  const onChange = select.onChange;
  const [opened, setOpened] = useState(false);
  const [id, setId] = useState(false);
  const handleOpen = async () => {
    setOpen(true);
    if (getData && !opened) {
      if (select.rerender && !reFetch[selectData.id]) {
        return;
      }
      setLoading(true);

      const fetchedOptions = await getData();
      setOptions(fetchedOptions.data);
      setId(fetchedOptions.id);
      setLoading(false);
      if (!select.rerender) {
        setOpened(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue ? newValue.id : null);
    }
  };
  return (
    <FormControl
      fullWidth={fullWidth}
      sx={{
        ...select.sx,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: select.createData && 2,
      }}
    >
      <div className={"flex-1 w-full"}>
        <Autocomplete
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          onChange={handleChange}
          value={value}
          options={options}
          loading={loading}
          disabled={disabled[selectData.id]}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              {...register(selectData.id, select.pattern)}
              label={selectData.label}
              variant={variant}
              error={Boolean(errors[selectData.id])}
              helperText={errors[selectData.id]?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </div>
      {select.createData && (
        <CreateModal
          setData={setOptions}
          oldData={options}
          modalInputs={select.createData}
          id={select.id}
          select={select}
          extraId={id}
        />
      )}
    </FormControl>
  );
}
