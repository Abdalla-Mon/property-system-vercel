import { handleRequestSubmit } from "@/helpers/functions/handleRequestSubmit";
import { toast } from "react-toastify";
import { Failed, Success } from "@/app/components/loading/ToastUpdate";

const PayEveryMonths = {
  TWO_MONTHS: 2,
  THREE_MONTHS: 3,
  FOUR_MONTHS: 4,
  SIX_MONTHS: 6,
  ONE_YEAR: 12,
};

export async function submitRentAgreement(
  data,
  setLoading,
  method,
  others,
  cancel,
) {
  if (!data.canceling) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    console.log(startDate, endDate, data);
    const monthDifference =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    const id = toast.loading("يتم مراجعة البيانات...");
    if (
      monthDifference % PayEveryMonths[data.rentCollectionType] !== 0 ||
      monthDifference < 1
    ) {
      toast.update(
        id,
        Failed("الرجاء التأكد من تاريخ البداية والنهاية والتكرار المختار "),
      );
      return null;
    } else {
      toast.update(id, Success("تم مراجعة البيانات بنجاح"));
    }
  }
  if (method === "PUT") {
    {
      for (const req of others) {
        await handleRequestSubmit(
          data,
          setLoading,
          `main/rentAgreements${req.route}`,
          false,
          req.message,
          "PUT",
        );
      }
    }
  }

  if (cancel) {
    return;
  }
  const rentAgreementResponse = await handleRequestSubmit(
    data,
    setLoading,
    "main/rentAgreements",
    false,
    "جاري إنشاء عقد الإيجار...",
  );

  if (rentAgreementResponse.status !== 200) {
    return;
  }

  const rentAgreementId = rentAgreementResponse.data.id;

  // Create Installments and Invoices
  const installmentsData = { ...rentAgreementResponse.data, rentAgreementId };
  await handleRequestSubmit(
    installmentsData,
    setLoading,
    `main/rentAgreements/${rentAgreementId}/installments`,
    false,
    "جاري إنشاء الدفعات ...",
  );
  const feeInvoicesData = { ...rentAgreementResponse.data };
  await handleRequestSubmit(
    feeInvoicesData,
    setLoading,
    `main/rentAgreements/${rentAgreementId}/feeInvoices`,
    false,
    "جاري إنشاء رسوم العقود...",
  );
  if (!data.extraData.otherExpenses || data.extraData.otherExpenses?.length < 1)
    return rentAgreementResponse.data;
  const otherExpensesData = {
    rentAgreement: rentAgreementResponse.data,
    otherExpenses: data.extraData.otherExpenses,
  };
  await handleRequestSubmit(
    otherExpensesData,
    setLoading,
    `main/rentAgreements/${rentAgreementId}/otherExpenses`,
    false,
    "جاري إنشاء  المصاريف الاخري...",
  );
  return rentAgreementResponse.data;
}
