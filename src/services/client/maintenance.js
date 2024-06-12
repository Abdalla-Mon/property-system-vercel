import { handleRequestSubmit } from "@/helpers/functions/handleRequestSubmit";
import { toast } from "react-toastify";
import { Failed, Success } from "@/app/components/loading/ToastUpdate";

const PayEveryMonths = {
  ONCE: 1,
  TWO_MONTHS: 2,
  FOUR_MONTHS: 4,
  SIX_MONTHS: 6,
  ONE_YEAR: 12,
};

export async function submitMaintenance(data, setLoading) {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  console.log(data);

  const monthDifference =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const id = toast.loading("يتم مراجعة البيانات...");

  if (
    data.payEvery !== "ONCE" &&
    (monthDifference % PayEveryMonths[data.payEvery] !== 0 ||
      monthDifference < 1)
  ) {
    toast.update(
      id,
      Failed("الرجاء التأكد من تاريخ البداية والنهاية والتكرار المختار "),
    );
    return null;
  } else {
    toast.update(id, Success("تم مراجعة البيانات بنجاح"));
  }
  try {
    const response = await handleRequestSubmit(
      data,
      setLoading,
      "main/maintenance",
      false,
      "جاري إنشاء الصيانة...",
    );
    const installmentsData = {
      maintenanceId: response.data.id,
      maintenance: {
        ...response.data,
        unitId: data.unitId,
      },
      payEvery: data.payEvery,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    await handleRequestSubmit(
      installmentsData,
      setLoading,
      "main/maintenance/" + response.data.id + "/installments",
      false,
      "جاري إنشاء الدفعات...",
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting maintenance:", error);
    throw error;
  }
}
