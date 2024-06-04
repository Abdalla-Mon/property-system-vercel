import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export function MuiDatePicker({ control, input, errors }) {
  const inputData = input.data;

  return (
    <FormControl fullWidth error={!!errors[inputData.id]} sx={input.sx}>
      <Controller
        name={inputData.id}
        control={control}
        defaultValue={input.value ? dayjs(input.value) : null}
        rules={{ required: input.pattern.required }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePicker
            id={inputData.id}
            label={inputData.label}
            value={value ? dayjs(value) : null}
            onChange={(date) => {
              onChange(date ? date.toISOString() : null); // Convert to ISO string
            }}
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
