import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useForm } from "react-hook-form";
import { Button, Typography } from "@mui/material";
import TextAreaField from "@/app/UiComponents/FormComponents/MUIInputs/TextAreaField";
import { MuiTextField } from "@/app/UiComponents/FormComponents/MUIInputs/MuiTextField";
import { MuiSelect } from "@/app/UiComponents/FormComponents/MUIInputs/MuiSelect";
import { MuiDatePicker } from "@/app/UiComponents/FormComponents/MUIInputs/MuiDatePicker";
import MuiFileField from "@/app/UiComponents/FormComponents/MUIInputs/MuiFileField";
import MuiSwitchField from "@/app/UiComponents/FormComponents/MUIInputs/MuiSwitchField";
import { MuiNumberField } from "@/app/UiComponents/FormComponents/MUIInputs/MuiNumberField";

export function Form({
  formStyle,
  onSubmit,
  inputs,
  variant,
  formTitle,
  subTitle,
  btnText,
  differentButton,
  children,
}) {
  const { formState, register, handleSubmit, watch, trigger, control } =
    useForm();
  const { errors } = formState;
  return (
    <div className="bg-white p-6 rounded shadow-md my-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          style={{ ...formStyle }}
          className="space-y-4"
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {formTitle}
          </Typography>
          <Typography variant="subtitle1" className="mb-4 font-bold">
            {subTitle}
          </Typography>
          <div className="main w-full flex flex-col gap-4">
            {inputs.map((input) => {
              switch (input.data.type) {
                case "text":
                  return (
                    <MuiTextField
                      variant={variant}
                      register={register}
                      input={input}
                      errors={errors}
                      trigger={trigger}
                      watch={watch}
                      key={input.data.id}
                    />
                  );
                case "textarea":
                  return (
                    <TextAreaField
                      errors={errors}
                      input={input}
                      register={register}
                      variant={variant}
                      control={control}
                      key={input.data.id}
                    />
                  );
                case "select":
                  return (
                    <MuiSelect
                      errors={errors}
                      register={register}
                      variant={variant}
                      select={input}
                      key={input.data.id}
                    />
                  );
                case "date":
                  return (
                    <MuiDatePicker
                      input={input}
                      control={control}
                      key={input.data.id}
                    />
                  );
                case "file":
                  return (
                    <MuiFileField
                      control={control}
                      input={input}
                      variant={variant}
                      register={register}
                      errors={errors}
                      key={input.data.id}
                    />
                  );
                case "switch":
                  return (
                    <MuiSwitchField
                      register={register}
                      control={control}
                      input={input}
                      key={input.data.id}
                    />
                  );
                case "number":
                  return (
                    <MuiNumberField
                      variant={variant}
                      register={register}
                      input={input}
                      errors={errors}
                      watch={watch}
                      trigger={trigger}
                    />
                  );
                default:
                  return null;
              }
            })}
            {children}
          </div>
          {differentButton ? (
            differentButton
          ) : (
            <Button
              type={"submit"}
              variant={"contained"}
              sx={{
                mt: 2,
                px: 4,
                py: 1,
              }}
            >
              {btnText}
            </Button>
          )}
        </form>
      </LocalizationProvider>
    </div>
  );
}
