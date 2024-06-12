import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance

export async function getRentPaymentsForCurrentMonth(
  page,
  limit,
  searchParams,
  params,
) {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  const type = searchParams.get("type");
  let actualType;
  let dateCondition;

  if (type === "RENTEXPENCES") {
    actualType = {
      in: ["TAX", "INSURANCE", "REGISTRATION"],
    };
    dateCondition = {
      gte: today,
      lte: endDate,
    };
  } else if (type === "OVERRUDE") {
    actualType = {
      in: [
        "RENT",
        "TAX",
        "INSURANCE",
        "REGISTRATION",
        "MAINTENANCE",
        "CONTRACT_EXPENSE",
        "OTHER_EXPENSE",
        "OTHER",
      ],
    };
    dateCondition = {
      lt: today,
    };
  } else {
    actualType = type;
    dateCondition = {
      gte: today,
      lte: endDate,
    };
  }

  try {
    const payments = await prisma.payment.findMany({
      where: {
        paymentType: actualType,
        dueDate: dateCondition,
        status: {
          in: ["PENDING", "OVERDUE"],
        },
      },
      include: {
        installment: true,
        property: {
          select: {
            name: true,
          },
        },
        unit: {
          select: {
            unitId: true,
            number: true,
          },
        },
        rentAgreement: {
          select: {
            rentAgreementNumber: true,
            unit: {
              select: {
                id: true,
                unitId: true,
                number: true,
                client: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        invoices: {
          include: {
            bankAccount: true,
          },
        },
      },
    });
    return {
      data: payments,
    };
  } catch (error) {
    console.error("Error fetching rent payments:", error);
    throw error;
  }
}

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
        installment: true,
        property: {
          select: {
            name: true,
          },
        },
        unit: {
          select: {
            unitId: true,
            number: true,
          },
        },
        rentAgreement: {
          select: {
            rentAgreementNumber: true,
            unit: {
              select: {
                id: true,
                unitId: true,
                number: true,
                client: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        invoices: {
          include: {
            bankAccount: true,
          },
        },
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
        installment: true,
        property: {
          select: {
            name: true,
          },
        },
        unit: {
          select: {
            unitId: true,
            number: true,
          },
        },
        rentAgreement: {
          select: {
            rentAgreementNumber: true,
            unit: {
              select: {
                id: true,
                unitId: true,
                number: true,
                client: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        invoices: {
          include: {
            bankAccount: true,
          },
        },
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
