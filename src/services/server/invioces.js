import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance
export async function createInvoice(data) {
  console.log(data, "data from invioce");
  const invoice = await prisma.invoice.create({
    data: {
      amount: +data.paidAmount || 0,
      description: data.description || "",
      title: data.title || "",
      renterId: data.renterId || null,
      ownerId: data.ownerId || null,
      propertyId: data.propertyId || null,
      rentAgreementId: data.rentAgreementId || null,
      installmentId: data.installmentId || null,
      maintenanceId: data.maintenanceId || null,
      bankAccountId: data.bankAccountId || null,
      invoiceType: data.invoiceType || "",
    },
  });
  await createIncomeOrExpenseFromInvoice({ ...invoice, invoiceId: invoice.id });
  return invoice;
}

export async function createIncomeOrExpenseFromInvoice(invoice) {
  try {
    if (
      invoice.invoiceType === "RENT" ||
      invoice.invoiceType === "TAX" ||
      invoice.invoiceType === "INSURANCE" ||
      invoice.invoiceType === "REGISTRATION"
    ) {
      await prisma.income.create({
        data: {
          amount: +invoice.amount,
          date: new Date(),
          description: `دخل من دفعة فاتورة #${invoice.id}`,
          clientId: +invoice.ownerId,
          propertyId: +invoice.propertyId,
          invoiceId: +invoice.invoiceId,
        },
      });
    } else {
      await prisma.expense.create({
        data: {
          amount: +invoice.amount,
          date: new Date(),
          description: `مصروف من دفعة فاتورة #${invoice.id}`,
          clientId: invoice.ownerId,
          propertyId: invoice.propertyId,
          invoiceId: +invoice.invoiceId,
        },
      });
    }
    return { message: "", status: 200 };
  } catch (error) {
    console.error("Error paying invoice:", error);
    throw error;
  }
}
