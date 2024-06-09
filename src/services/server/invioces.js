import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance
export async function createInvoice(data) {
  const invoice = await prisma.invoice.create({
    data: {
      amount: +data.paidAmount || 0,
      description: data.description || "",
      title: data.title || "",
      bankAccount: data.bankAccountId
        ? { connect: { id: data.bankAccountId } }
        : undefined,
      invoiceType: data.invoiceType || "",
      paymentTypeMethod: data.paymentTypeMethod || "",
      payment: data.paymentId ? { connect: { id: data.paymentId } } : undefined,
      renter: data.renterId ? { connect: { id: data.renterId } } : undefined,
      owner: data.ownerId ? { connect: { id: data.ownerId } } : undefined,
      property: data.propertyId
        ? { connect: { id: data.propertyId } }
        : undefined,
      rentAgreement: data.rentAgreementId
        ? { connect: { id: data.rentAgreementId } }
        : undefined,
      installment: data.installmentId
        ? { connect: { id: data.installmentId } }
        : undefined,
      maintenance: data.maintenanceId
        ? { connect: { id: data.maintenanceId } }
        : undefined,
    },
    include: {
      bankAccount: true,
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
      invoice.invoiceType === "REGISTRATION" ||
      invoice.invoiceType === "CONTRACT_EXPENSE"
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
