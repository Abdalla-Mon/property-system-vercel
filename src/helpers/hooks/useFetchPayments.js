import { useEffect, useState } from "react";
import { getData } from "@/helpers/functions/getData";

export const useFetchPayments = (type) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      const res = await fetch("/api/main/payments?type=" + type);
      const payments = await res.json();
      setPayments(payments.data);
      setLoading(false);
    }

    fetchPayments();
  }, []);

  return { payments, loading, setPayments };
};
