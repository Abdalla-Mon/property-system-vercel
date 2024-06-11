import prisma from "@/lib/prisma";

export async function getReports(page, limit, searchParams, params) {
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters"))
    : {};
  const { propertyId, startDate, endDate } = filters;
  const reportData = {
    name: "",
    location: "",
    builtArea: 0,
    price: 0,
    numElevators: 0,
    numParkingSpaces: 0,
    units: [],
    income: [],
    expenses: [],
  };

  try {
    const property = await prisma.property.findUnique({
      where: { id: +propertyId },
      include: {
        units: {
          include: {
            rentAgreements: true,
          },
        },
        client: true,
        incomes: {
          where: {
            date: {
              gte: new Date(startDate),
              lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1),
              ),
            },
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
        },
      },
    });

    if (property) {
      reportData.name = property.name;
      reportData.client = property.client;
      reportData.location = property.location;
      reportData.builtArea = property.builtArea;
      reportData.price = property.price;
      reportData.numElevators = property.numElevators;
      reportData.numParkingSpaces = property.numParkingSpaces;
      reportData.units = property.units.map((unit) => ({
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
          status: agreement.status,
        })),
      }));
      reportData.income = property.incomes.map((income) => ({
        date: income.date,
        amount: income.amount,
      }));
      reportData.expenses = property.expenses.map((expense) => ({
        date: expense.date,
        amount: expense.amount,
      }));
    }
  } catch (error) {
    console.error("Error fetching property report data", error);
  }

  return { data: reportData };
}
