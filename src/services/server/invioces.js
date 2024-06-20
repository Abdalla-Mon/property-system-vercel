import prisma from "@/lib/prisma";
import { endOfDay, startOfDay } from "@/helpers/functions/dates";
import { endOfMonth, startOfMonth } from "date-fns"; // Adjust the path to your Prisma instance
export async function createInvoice(data) {
  const invoice = await prisma.invoice.create({
    data: {
      amount: +data.paidAmount || 0,
      description: data.description || "",
      title: data.title || "",
      bankAccount: data.bankId ? { connect: { id: data.bankId } } : undefined,
      chequeNumber: data.chequeNumber || "",
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
      invoice.invoiceType === "CONTRACT_EXPENSE" ||
      invoice.invoiceType === "OTHER_EXPENSE"
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

export async function getInvioces(page, limit, searchParams) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { unitIds, startDate, endDate, propertyId } = filters;

  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date();

  // Check if "ALL" is included in unitIds
  const isAll = !unitIds ? true : unitIds.includes("ALL");

  try {
    const conditions = [
      {
        rentAgreement: {
          unitId: {
            in: !isAll ? unitIds.map((id) => parseInt(id)) : undefined,
          },
        },
      },
      {
        propertyId: parseInt(propertyId),
        invoiceType: "MAINTENANCE",
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    ];

    // If "ALL" is selected, include property-based filtering for rent agreements
    if (isAll && propertyId) {
      conditions.shift();
      conditions.push({
        rentAgreement: {
          unit: {
            propertyId: parseInt(propertyId),
          },
        },
      });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        OR: conditions,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        rentAgreement: {
          select: {
            rentAgreementNumber: true,
            unit: {
              select: {
                number: true,
              },
            },
          },
        },

        property: {
          select: {
            name: true,
          },
        },
        renter: {
          select: {
            name: true,
          },
        },
        owner: {
          select: {
            name: true,
          },
        },
        payment: {
          select: {
            amount: true,
            dueDate: true,
            maintenance: true,
          },
        },
      },
    });

    // Log the fetched invoices for debugging

    return {
      data: invoices,
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
}

export async function updateInvoice(id, data) {
  const { title, description } = data;
  try {
    const invoice = await prisma.invoice.update({
      where: {
        id: +id,
      },
      data: {
        title,
        description,
      },
    });
    return invoice;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
}
