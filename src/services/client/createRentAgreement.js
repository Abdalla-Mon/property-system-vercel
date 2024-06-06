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
    "جاري إنشاء فواتير الرسوم...",
  );
  if (!data.extraData.contractExpenses) return rentAgreementResponse.data;
  // Create Contract Expense Invoices
  const contractExpensesData = {
    rentAgreement: rentAgreementResponse.data,
    contractExpenses: data.extraData.contractExpenses,
  };
  await handleRequestSubmit(
    contractExpensesData,
    setLoading,
    `main/rentAgreements/${rentAgreementId}/contractExpenses`,
    false,
    "جاري إنشاء فواتير مصاريف العقد...",
  );
  return rentAgreementResponse.data;
}
