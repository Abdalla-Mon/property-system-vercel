import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance
export async function createNewBankAccount(data, params, searchParams) {
  const clientId = searchParams.get("clientId");
  const bankAccount = await prisma.bankAccount.create({
    data: {
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      bankId: data.bankId,
      clientId: +clientId,
    },
  });
  return {
    id: bankAccount.id,
    name: bankAccount.accountNumber,
  };
}

export async function updatePayment(id, data) {
  let payment;
  const restPayment =
    +data.amount - (+data.currentPaidAmount + +data.paidAmount);

  if (restPayment > 1) {
    payment = await prisma.payment.update({
      where: { id: +id },
      data: {
        paidAmount: +data.paidAmount + +data.currentPaidAmount,
        status: "PENDING",
      },
      include: {
        invoices: true,
      },
    });
  } else {
    payment = await prisma.payment.update({
      where: { id: +id },
      data: {
        paidAmount: +data.paidAmount + +data.currentPaidAmount,
        status: "PAID",
      },
      include: {
        invoices: true,
      },
    });
    if (data.paymentType === "RENT") {
      await prisma.installment.update({
        where: { id: +payment.installmentId },
        data: {
          status: true,
        },
      });
    }
  }
  return payment;
}
