import prisma from "@/lib/prisma";

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
        incomes: {
          where: {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
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
              gte: new Date(startDate),
              lte: new Date(endDate),
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
              gte: new Date(startDate),
              lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate()),
              ),
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
                  gte: new Date(startDate),
                  lte: new Date(
                    new Date(endDate).setDate(new Date(endDate).getDate()),
                  ),
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
                  gte: new Date(startDate),
                  lte: new Date(
                    new Date(endDate).setDate(new Date(endDate).getDate() + 1),
                  ),
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
                  gte: new Date(startDate),
                  lte: new Date(
                    new Date(endDate).setDate(new Date(endDate).getDate() + 1),
                  ),
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
              gte: new Date(startDate),
              lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1),
              ),
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
              gte: new Date(startDate),
              lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1),
              ),
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
