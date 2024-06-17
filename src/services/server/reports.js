import prisma from "@/lib/prisma";
import { PaymentStatus, PaymentType } from "@/app/constants/Enums";
import { endOfDay, startOfDay } from "@/helpers/functions/dates";
import { isBefore, isAfter, addMonths } from "date-fns"; // Make sure to import these functions

export async function getReports(page, limit, searchParams, params) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { propertyIds, startDate, endDate } = filters;
  const reportData = [];

  const statusTranslations = {
    ACTIVE: "نشط",
    EXPIRED: "منتهي ",
    CANCELED: "ملغاة",
  };
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
        })),
        expenses: property.expenses.map((expense) => ({
          date: expense.date,
          amount: expense.amount,
          description: expense.description,
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
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
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
          },
        },
      },
    });

    return { data: owners };
  } catch (error) {
    console.error("Error fetching owners' report data", error);
  }
}

export async function getPaymentsReport(page, limit, searchParams, params) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { unitIds, paymentTypes, paymentStatus } = filters;

  try {
    let whereCondition = {
      unitId: { in: unitIds.map((id) => parseInt(id, 10)) },
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
        unit: {
          select: {
            number: true,
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
      paymentType: PaymentType[payment.paymentType],
      isFullPaid: payment.amount === payment.paidAmount ? "نعم" : "لا",
      paidAmount: payment.paidAmount,
      amount: payment.amount,
      unitNumber: payment.unit?.number,
      rentAgreementNumber: payment.rentAgreement?.rentAgreementNumber,
    }));

    return { data: formattedPayments };
  } catch (error) {
    console.error("Error fetching payments report data", error);
    return { data: [] }; // Ensure a consistent return format
  }
}

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
  const { propertyIds } = filters;
  const today = new Date();
  const nextMonth = addMonths(today, 1);

  try {
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIds },
      },
      select: {
        id: true,
        name: true,
        units: {
          select: {
            id: true,
            number: true,
            rentAgreements: {
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

    // Process rent agreements to add custom status
    properties.forEach((property) => {
      property.units.forEach((unit) => {
        unit.rentAgreements.forEach((agreement) => {
          if (agreement.status === "ACTIVE") {
            if (isAfter(agreement.endDate, nextMonth)) {
              agreement.customStatus = "نشط";
            } else if (
              isAfter(agreement.endDate, today) &&
              isBefore(agreement.endDate, nextMonth)
            ) {
              agreement.customStatus = "نشط (قارب علي الانتهاء)";
            } else if (isBefore(agreement.endDate, today)) {
              agreement.customStatus = "بحاجه الي الغاءه";
            }
          } else if (agreement.status === "EXPIRED") {
            agreement.customStatus = "ملغي";
          } else {
            agreement.customStatus = "غير فعال";
          }
        });
      });
    });

    return { data: properties };
  } catch (error) {
    console.error("Error fetching rent agreements report data", error);
    return { data: [] };
  }
}
