"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useState } from "react";
import { propertyInputs } from "@/app/properties/propertyInputs";
import { ExtraForm } from "@/app/UiComponents/FormComponents/Forms/ExtraForms/ExtraForm";
import Link from "next/Link";
import useEditState from "@/helpers/hooks/useEditState";
import PropertyComponent from "@/app/components/PropertyComponent/PropertyComponent";

export default function PropertyPage() {
  return (
    <TableFormProvider url={"fast-handler"}>
      <PropertyComponent />
    </TableFormProvider>
  );
}
