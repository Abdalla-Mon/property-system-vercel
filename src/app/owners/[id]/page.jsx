"use client";
import PropertyComponent from "@/app/components/PropertyComponent/PropertyComponent";
import TableFormProvider from "@/app/context/TableFormProvider/TableFormProvider";

export default function Owner({ params: { id } }) {
  return (
    <TableFormProvider url={"clients/owner"}>
      <div>Client page</div>
      <PropertyComponent clientId={id} noTabs={true} />
    </TableFormProvider>
  );
}
