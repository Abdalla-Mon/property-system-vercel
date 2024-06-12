// services/maintenanceService.js
import prisma from "@/lib/prisma";
import { convertToISO } from "@/helpers/functions/convertDateToIso";

const PayEvery = {
  ONCE: 1,
  TWO_MONTHS: 2,
  FOUR_MONTHS: 4,
  SIX_MONTHS: 6,
  ONE_YEAR: 12,
};

export async function createMaintenance(data) {
  const extraData = data.extraData;
  const ownerId = extraData.ownerId;
  const description = data.description;
  try {
    const newMaintenance = await prisma.maintenance.create({
      data: {
        description: description,
        cost: +data.cost,
        date: convertToISO(data.date),
        isPaid: false,
        property: {
          connect: {
            id: +data.propertyId,
          },
        },
        client: {
          connect: {
            id: +ownerId,
          },
        },

        unit: data.unitId
          ? {
              connect: {
                id: +data.unitId,
              },
            }
          : undefined,
        type: {
          connect: {
            id: +data.typeId,
          },
        },
        totalPrice: +data.cost,
        payEvery: data.payEvery,
      },
      include: {
        payments: true,
        installments: true,
        property: {
          select: {
            id: true,
            name: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            unitId: true,
          },
        },
      },
    });

    return {
      data: newMaintenance,
      message: "تمت إضافة الصيانة بنجاح",
      status: 200,
    };
  } catch (error) {
    console.error("Error creating maintenance:", error);
    throw error;
  }
}

export async function createMaintenenceInstallmentsAndPayments(data) {
  const { maintenance, payEvery } = data;
  try {
    if (payEvery === "ONCE") {
      const createdInstallment = await prisma.maintenanceInstallment.create({
        data: {
          startDate: convertToISO(new Date(maintenance.date)),
          endDate: convertToISO(new Date(maintenance.date)),
          status: false,
          maintenanceId: maintenance.id,
          amount: maintenance.totalPrice,
          date: convertToISO(new Date(maintenance.date)),
        },
      });
      await prisma.payment.create({
        data: {
          amount: maintenance.totalPrice,
          dueDate: convertToISO(new Date(maintenance.date)),
          status: "PENDING",
          client: {
            connect: {
              id: maintenance.ownerId,
            },
          },
          property: {
            connect: {
              id: maintenance.propertyId,
            },
          },
          unit: {
            connect: {
              id: maintenance.unitId,
            },
          },
          maintenance: {
            connect: {
              id: maintenance.id,
            },
          },
          maintenanceInstallment: {
            connect: {
              id: createdInstallment.id,
            },
          },
          paymentType: "MAINTENANCE",
        },
      });
      return {
        data: {},
        message: "تمت إضافة الدفعات بنجاح",
      };
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const monthDifference =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      endDate.getMonth() -
      startDate.getMonth();
    const totalInstallments = Math.ceil(monthDifference / PayEvery[payEvery]);
    const installmentBaseAmount = maintenance.totalPrice / totalInstallments;
    let remainingAmount = maintenance.totalPrice;

    const installments = Array(totalInstallments)
      .fill()
      .map((_, i) => {
        let dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + i * PayEvery[payEvery]);
        const endDate = new Date(dueDate);
        endDate.setMonth(dueDate.getMonth() + PayEvery[payEvery]);

        let installmentAmount;
        if (i === totalInstallments - 1) {
          installmentAmount = remainingAmount;
        } else {
          installmentAmount = Math.round(installmentBaseAmount / 50) * 50;
          remainingAmount -= installmentAmount;
        }

        return {
          startDate: convertToISO(startDate),
          dueDate: convertToISO(dueDate),
          endDate: convertToISO(endDate),
          status: false,
          maintenanceId: maintenance.id,
          amount: installmentAmount,
          date: convertToISO(maintenance.date),
        };
      });

    for (let i = 0; i < installments.length; i++) {
      const installment = installments[i];
      const dueDate = new Date(installment.dueDate);
      delete installment.dueDate;
      const amount = installment.amount;
      const createdInstallment = await prisma.maintenanceInstallment.create({
        data: installment,
      });

      await prisma.payment.create({
        data: {
          amount: amount,
          dueDate: dueDate,
          status: "PENDING",
          client: {
            connect: {
              id: maintenance.ownerId,
            },
          },
          property: {
            connect: {
              id: maintenance.propertyId,
            },
          },
          maintenance: {
            connect: {
              id: maintenance.id,
            },
          },
          maintenanceInstallment: {
            connect: {
              id: createdInstallment.id,
            },
          },
          unit: {
            connect: {
              id: maintenance.unitId,
            },
          },
          paymentType: "MAINTENANCE",
        },
      });
    }
    return {
      data: {},
      message: "تمت إضافة الدفعات بنجاح",
    };
  } catch (error) {
    console.error("Error creating installments and payments:", error);
    throw error;
  }
}

export async function getMaintenances(page, limit) {
  const offset = (page - 1) * limit;

  const maintenances = await prisma.maintenance.findMany({
    skip: offset,
    take: limit,
    include: {
      property: true,
      unit: true,
      type: true,
      payments: true,
      installments: true,
    },
  });
  const total = await prisma.maintenance.count();
  return {
    data: maintenances,
    page,
    total,
  };
}

export async function getMaintenanceById(id) {
  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: +id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            unitId: true,
          },
        },
        type: {
          select: {
            id: true,
            name: true,
          },
        },
        payments: true,
        installments: true,
      },
    });

    return {
      data: maintenance,
    };
  } catch (error) {
    console.error("Error fetching maintenance:", error);
    throw error;
  }
}

export async function getMaintenanceInstallments(id) {
  try {
    const installments = await prisma.maintenanceInstallment.findMany({
      where: {
        maintenanceId: +id,
      },
      include: {
        maintenance: true,
        payments: true,
      },
    });
    return {
      data: installments,
    };
  } catch (error) {
    console.error("Error fetching maintenance installments:", error);
    throw error;
  }
}

export async function deleteMaintenance(id) {
  try {
    await prisma.payment.deleteMany({
      where: {
        maintenanceId: +id,
      },
    });

    await prisma.maintenance.delete({
      where: { id: +id },
    });
    return {
      message: "تم حذف الصيانة بنجاح",
    };
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    throw error;
  }
}
