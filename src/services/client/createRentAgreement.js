import { handleRequestSubmit } from "@/helpers/functions/handleRequestSubmit";

export async function submitRentAgreement(data, setLoading) {
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
  // Create Fee Invoices
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
  // Create other Expense Invoices
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
