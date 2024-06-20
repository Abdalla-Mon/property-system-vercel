import prisma from "@/lib/prisma";
import { PaymentStatus, PaymentType } from "@/app/constants/Enums";
import { endOfDay, startOfDay } from "@/helpers/functions/dates";
import { isBefore, isAfter, addMonths } from "date-fns"; // Make sure to import these functions
const statusTranslations = {
  ACTIVE: "نشط",
  EXPIRED: "منتهي",
  CANCELED: "ملغاة",
};

export async function getReports(page, limit, searchParams, params) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { propertyIds, startDate, endDate } = filters;
  const reportData = [];

  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  try {
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: {
        id: true,
        name: true,
        builtArea: true,
        price: true,
        numElevators: true,
        numParkingSpaces: true,
        client: {
          select: {
            name: true,
            nationalId: true,
            email: true,
            phone: true,
          },
        },
        units: {
          select: {
            id: true,
            number: true,
            yearlyRentPrice: true,
            floor: true,
            numBedrooms: true,
            numBathrooms: true,
            numACs: true,
            numLivingRooms: true,
            rentAgreements: {
              select: {
                id: true,
                rentAgreementNumber: true,
                startDate: true,
                endDate: true,
                totalPrice: true,
                status: true,
              },
            },
          },
        },
        maintenances: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          select: {
            id: true,
            description: true,
            date: true,
            unit: {
              select: {
                number: true,
              },
            },
            payments: {
              where: {
                dueDate: {
                  gte: start,
                  lte: end,
                },
              },
              select: {
                amount: true,
                paidAmount: true,
                dueDate: true,
                status: true,
              },
            },
          },
        },
        incomes: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          select: {
            date: true,
            amount: true,
            description: true,
            invoice: {
              select: {
                id: true,
                invoiceType: true,
                property: {
                  select: {
                    id: true,
                    name: true,
                  },
                },

                rentAgreement: {
                  select: {
                    id: true,
                    rentAgreementNumber: true,
                    unit: {
                      select: {
                        id: true,
                        number: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        expenses: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          select: {
            date: true,
            amount: true,
            description: true,
            invoice: {
              select: {
                id: true,
                invoiceType: true,
                property: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    reportData.push(
      ...properties.map((property) => ({
        id: property.id,
        name: property.name,
        client: property.client,
        builtArea: property.builtArea,
        price: property.price,
        numElevators: property.numElevators,
        numParkingSpaces: property.numParkingSpaces,
        units: property.units.map((unit) => ({
          id: unit.id,
          number: unit.number,
          yearlyRentPrice: unit.yearlyRentPrice,
          floor: unit.floor,
          numBedrooms: unit.numBedrooms,
          numBathrooms: unit.numBathrooms,
          numACs: unit.numACs,
          numLivingRooms: unit.numLivingRooms,
          status: unit.rentAgreements.some(
            (agreement) => agreement.status === "ACTIVE",
          )
            ? "مؤجرة"
            : "غير مؤجرة",
          rentAgreements: unit.rentAgreements.map((agreement) => ({
            id: agreement.id,
            rentAgreementNumber: agreement.rentAgreementNumber,
            startDate: agreement.startDate,
            endDate: agreement.endDate,
            totalPrice: agreement.totalPrice,
            status: statusTranslations[agreement.status] || agreement.status,
          })),
        })),
        maintenances: property.maintenances.map((maintenance) => ({
          id: maintenance.id,
          description: maintenance.description,
          date: maintenance.date,
          unit: maintenance.unit,
          payments: maintenance.payments.map((payment) => ({
            amount: payment.amount,
            paidAmount: payment.paidAmount,
            dueDate: payment.dueDate,
            status: PaymentStatus[payment.status],
          })),
        })),
        income: property.incomes.map((income) => ({
          date: income.date,
          amount: income.amount,
          description: income.description,
          invoice: income.invoice,
        })),
        expenses: property.expenses.map((expense) => ({
          date: expense.date,
          amount: expense.amount,
          description: expense.description,
          invoice: expense.invoice,
        })),
      })),
    );
  } catch (error) {
    console.error("Error fetching property report data", error);
  }

  return { data: reportData };
}

export async function getMaintenanceReports(page, limit, searchParams, params) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { propertyIds, startDate, endDate } = filters;
  const start = startOfDay(startDate);

  const end = endOfDay(endDate);
  try {
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIds },
      },
      select: {
        id: true,
        name: true,
        client: true,
        maintenances: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          select: {
            id: true,
            description: true,
            date: true,
            unit: {
              select: {
                number: true,
              },
            },
            payments: {
              where: {
                dueDate: {
                  gte: start,
                  lte: end,
                },
              },
              select: {
                amount: true,
                paidAmount: true,
                dueDate: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return { data: properties };
  } catch (error) {
    console.error("Error fetching maintenance report data", error);
    return { data: [] };
  }
}

export async function getOwnersReport(page, limit, searchParams, params) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { ownerIds, startDate, endDate } = filters;
  const start = startOfDay(new Date(startDate));
  const end = endOfDay(new Date(endDate));

  try {
    const owners = await prisma.client.findMany({
      where: {
        id: {
          in: ownerIds.map((id) => parseInt(id, 10)),
        },
      },
      select: {
        id: true,
        name: true,
        nationalId: true,
        email: true,
        phone: true,
        properties: {
          select: {
            id: true,
            name: true,
            builtArea: true,
            price: true,
            numElevators: true,
            numParkingSpaces: true,
            units: {
              select: {
                id: true,
                number: true,
                yearlyRentPrice: true,
                floor: true,
                numBedrooms: true,
                numBathrooms: true,
                numACs: true,
                numLivingRooms: true,
                rentAgreements: {
                  select: {
                    status: true,
                  },
                },
              },
            },
            incomes: {
              where: {
                date: {
                  gte: start,
                  lte: end,
                },
              },
              select: {
                date: true,
                amount: true,
                description: true,
                invoice: {
                  select: {
                    id: true,
                    invoiceType: true,
                    property: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    rentAgreement: {
                      select: {
                        id: true,
                        rentAgreementNumber: true,
                        unit: {
                          select: {
                            id: true,
                            number: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            expenses: {
              where: {
                date: {
                  gte: start,
                  lte: end,
                },
              },
              select: {
                date: true,
                amount: true,
                description: true,
                invoice: {
                  select: {
                    id: true,
                    invoiceType: true,
                    property: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return { data: owners };
  } catch (error) {
    console.error("Error fetching owners' report data", error);
    return { data: [] };
  }
}

export async function getPaymentsReport(page, limit, searchParams, params) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { unitIds, paymentTypes, paymentStatus, startDate, endDate } = filters;

  try {
    let whereCondition = {
      unitId: { in: unitIds.map((id) => parseInt(id, 10)) },
      dueDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    if (paymentTypes && paymentTypes.length > 0) {
      whereCondition.paymentType = { in: paymentTypes };
    }

    if (paymentStatus !== "ALL") {
      whereCondition.status = paymentStatus === "PAID" ? "PAID" : "PENDING";
    }

    const payments = await prisma.payment.findMany({
      where: whereCondition,
      select: {
        id: true,
        paymentType: true,
        amount: true,
        paidAmount: true,
        status: true,
        dueDate: true,
        unit: {
          select: {
            number: true,
            property: {
              select: {
                name: true,
              },
            },
          },
        },
        rentAgreement: {
          select: {
            rentAgreementNumber: true,
          },
        },
      },
    });

    const formattedPayments = payments.map((payment) => ({
      paymentType: payment.paymentType,
      isFullPaid: payment.amount === payment.paidAmount ? "نعم" : "لا",
      paidAmount: payment.paidAmount,
      amount: payment.amount,
      unit: payment.unit,
      rentAgreement: payment.rentAgreement,
      date: payment.date,
    }));

    return { data: formattedPayments };
  } catch (error) {
    console.error("Error fetching payments report data", error);
    return { data: [] }; // Ensure a consistent return format
  }
}

export const getTaxPaymentsReport = async (
  page,
  limit,
  searchParams,
  params,
) => {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { ownerId, startDate, endDate } = filters;
  try {
    const payments = await prisma.payment.findMany({
      where: {
        paymentType: "TAX",
        clientId: parseInt(ownerId, 10),
        dueDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        id: true,
        paymentType: true,
        amount: true,
        paidAmount: true,
        dueDate: true,
        unit: {
          select: {
            number: true,
            property: {
              select: {
                name: true,
              },
            },
          },
        },
        client: {
          select: {
            name: true,
          },
        },
      },
    });
    const formattedPayments = payments.map((payment) => ({
      ownerName: payment.client.name,
      propertyName: payment.unit.property.name,
      unitNumber: payment.unit.number,
      amount: payment.amount,
      paidAmount: payment.paidAmount,
      dueDate: payment.dueDate,
    }));

    return { data: formattedPayments };
  } catch (error) {
    console.error("Error fetching tax payments report data", error);
    throw new Error("Internal server error");
  }
};

export async function getElectricMetersReports(
  page,
  limit,
  searchParams,
  params,
) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { propertyIds } = filters;
  try {
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIds },
      },
      select: {
        id: true,
        name: true,
        client: true,
        electricityMeters: {
          select: {
            id: true,
            meterId: true,
            name: true,
          },
        },
        units: {
          select: {
            id: true,
            number: true,
            electricityMeter: true,
          },
        },
      },
    });

    return { data: properties };
  } catch (error) {
    console.error("Error fetching electric meters report data", error);
  }
}

export async function getRentAgreementsReports(
  page,
  limit,
  searchParams,
  params,
) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { propertyIds, startDate, endDate } = filters;
  const currentDate = new Date();

  try {
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIds },
      },
      select: {
        id: true,
        name: true,
        managementCommission: true,
        client: {
          select: {
            name: true,
            nationalId: true,
            email: true,
            phone: true,
          },
        },
        units: {
          select: {
            id: true,
            number: true,
            rentAgreements: {
              where: {
                AND: [
                  { startDate: { gte: new Date(startDate) } },
                  { endDate: { lte: new Date(endDate) } },
                  { endDate: { gte: currentDate } },
                  { status: "ACTIVE" },
                ],
              },
              select: {
                id: true,
                rentAgreementNumber: true,
                startDate: true,
                endDate: true,
                status: true,
                payments: {
                  select: {
                    amount: true,
                    paidAmount: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Process rent agreements to add custom status and payment summaries
    properties.forEach((property) => {
      property.rentAgreements = [];
      property.units.forEach((unit) => {
        unit.rentAgreements.forEach((agreement) => {
          agreement.unitNumber = unit.number;
          agreement.totalAmount = agreement.payments.reduce(
            (acc, payment) => acc + payment.amount,
            0,
          );
          agreement.paidAmount = agreement.payments.reduce(
            (acc, payment) => acc + payment.paidAmount,
            0,
          );
          agreement.remainingAmount =
            agreement.totalAmount - agreement.paidAmount;
          agreement.managementCommission = agreement.totalAmount * 0.03;

          if (agreement.status === "ACTIVE") {
            agreement.customStatus = "نشط";
          } else if (agreement.status === "EXPIRED") {
            agreement.customStatus = "ملغي";
          } else {
            agreement.customStatus = "غير فعال";
          }
          property.rentAgreements.push(agreement);
        });
      });
    });

    return { data: properties };
  } catch (error) {
    console.error("Error fetching rent agreements report data", error);
    return { data: [] };
  }
}
