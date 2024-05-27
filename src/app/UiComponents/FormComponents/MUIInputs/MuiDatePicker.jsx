import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export function MuiDatePicker({ control, input }) {
  const inputData = input.data;

  return (
    <FormControl fullWidth error={!!errors.startDate}>
      <Controller
        name={inputData.label}
        control={control}
        rules={{ required: input.pattern.message }}
        render={({
          field: { onChange, value = input.value },
          fieldState: { error },
        }) => (
          <DatePicker
            id={inputData.id}
            label={inputData.label}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error}
                helperText={error ? input.pattern.message : ""}
              />
            )}
          />
        )}
      />
    </FormControl>
  );
}
