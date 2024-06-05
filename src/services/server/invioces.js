export async function payInvoice(invoiceId, paidAmount, paymentDate) {
  try {
    // Fetch the invoice details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        property: true,
        rentAgreement: true,
        maintenanceInstallment: true,
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Update the invoice with the paid amount and set status to PAID if fully paid
    const newPaidAmount = invoice.paidAmount + paidAmount;
    const isPaid = newPaidAmount >= invoice.amount;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status: isPaid ? "PAID" : "PENDING",
      },
    });

    // Create income or expense record based on the invoice type
    if (
      invoice.invoiceType === "RENT" ||
      invoice.invoiceType === "TAX" ||
      invoice.invoiceType === "INSURANCE" ||
      invoice.invoiceType === "REGISTRATION"
    ) {
      await prisma.income.create({
        data: {
          amount: paidAmount,
          date: paymentDate,
          description: `Payment received for invoice #${invoiceId}`,
          clientId: invoice.clientId,
          propertyId: invoice.propertyId,
          invoiceId: invoice.id,
        },
      });
    } else {
      await prisma.expense.create({
        data: {
          amount: paidAmount,
          date: paymentDate,
          description: `Payment made for invoice #${invoiceId}`,
          clientId: invoice.clientId,
          propertyId: invoice.propertyId,
          invoiceId: invoice.id,
        },
      });
    }

    return { message: "Invoice paid successfully" };
  } catch (error) {
    console.error("Error paying invoice:", error);
    throw error;
  }
}
