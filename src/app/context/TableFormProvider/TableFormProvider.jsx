"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSubmitLoader } from "@/app/context/SubmitLoaderProvider/SubmitLoaderProvider";
import { postData } from "@/helpers/functions/postData";

const TableContext = createContext();
export default function TableFormProvider({ children, url }) {
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const { setLoading, setOpen, setMessage, setSeverity } = useSubmitLoader();

  async function submitData(
    data,
    setOpenModal,
    id,
    method = "PUT",
    extra,
    bodyType = "json",
  ) {
    const { extraId, id: handlerId } = extra || {};
    const route = id
      ? `${url}/${id}`
      : extra
        ? `${url}?id=${handlerId}&extraId=${extraId}`
        : url;

    const res = await postData(route, data, setLoading, method, bodyType);
    setOpen(true);
    if (res.status === 200) {
      setMessage(res.message);
      setSeverity("success");
      if (setOpenModal) {
        setOpenModal(false);
      }
      setId(null);
    } else {
      setMessage("حدث خطأ ما");
      setSeverity("error");
    }
    return res.data ? res.data : res;
  }

  return (
    <TableContext.Provider
      value={{ id, setId, openModal, setOpenModal, submitData }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTableForm() {
  return useContext(TableContext);
}
