import { convertToISO } from "@/helpers/functions/convertDateToIso";

export async function getRentAgreements(page, limit) {
  const offset = (page - 1) * limit;
  const rentAgreements = await prisma.rentAgreement.findMany({
    skip: offset,
    take: limit,
    include: {
      contractExpenses: true,
      renter: {
        select: {
          id: true,
          name: true,
        },
      },
      unit: {
        select: {
          id: true,
          unitId: true,
          property: {
            select: {
              id: true,
              name: true,
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
    },
  });

  const total = await prisma.rentAgreement.count();
  return {
    data: rentAgreements,
    page,
    total,
  };
}

export async function createRentAgreement(data) {
  const { extraData } = data;
  const { contractExpenses } = extraData;

  try {
    const newRentAgreement = await prisma.rentAgreement.create({
      data: {
        rentAgreementNumber: data.rentAgreementNumber,
        startDate: convertToISO(data.startDate),
        endDate: convertToISO(data.endDate),
        tax: +data.tax,
        registrationFees: +data.registrationFees,
        insuranceFees: +data.insuranceFees,
        totalPrice: +data.totalPrice,
        rentCollectionType: data.rentCollectionType,
        totalContractPrice: 0,
        renter: {
          connect: {
            id: +data.renterId,
          },
        },
        type: {
          connect: {
            id: +data.typeId,
          },
        },
        unit: {
          connect: {
            id: +data.unitId,
          },
        },
      },
      include: {
        contractExpenses: true,
        renter: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            unitId: true,
            propertyId: true,
            property: {
              select: {
                id: true,
                name: true,
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
      },
    });

    const installmentAmount =
      newRentAgreement.totalPrice /
      RentCollectionType[newRentAgreement.rentCollectionType];
    const installments = Array(
      RentCollectionType[newRentAgreement.rentCollectionType],
    )
      .fill()
      .map((_, i) => {
        const startDate = new Date(newRentAgreement.startDate);
        const dueDate = new Date(
          startDate.setMonth(
            startDate.getMonth() +
              i *
                (12 / RentCollectionType[newRentAgreement.rentCollectionType]),
          ),
        );
        const endDate = new Date(
          dueDate.setMonth(
            dueDate.getMonth() +
              12 / RentCollectionType[newRentAgreement.rentCollectionType],
          ),
        );
        return {
          startDate: convertToISO(new Date(newRentAgreement.startDate)),
          dueDate: convertToISO(dueDate),
          endDate: convertToISO(endDate),
          status: false,
          rentAgreementId: newRentAgreement.id,
          amount: installmentAmount,
        };
      });

    for (const installment of installments) {
      const dueDate = new Date(installment.dueDate);
      const amount = installment.amount;
      delete installment.dueDate;
      delete installment.amount;

      const createdInstallment = await prisma.installment.create({
        data: installment,
      });

      await prisma.invoice.create({
        data: {
          amount: amount,
          description: `Installment payment for Rent Agreement #${newRentAgreement.rentAgreementNumber}`,
          dueDate: dueDate,
          status: "PENDING",
          clientId: newRentAgreement.unit.property.client.id,
          propertyId: newRentAgreement.unit.property.id,
          rentAgreementId: newRentAgreement.id,
          installmentId: createdInstallment.id,
        },
      });
    }

    for (const contractExpense of contractExpenses) {
      await prisma.ContractExpenseToRentAgreement.create({
        data: {
          rentAgreementId: newRentAgreement.id,
          contractExpenseId: +contractExpense.id,
        },
      });
    }

    return newRentAgreement;
  } catch (error) {
    console.error("Error creating rent agreement:", error);
    throw error;
  }
}

export async function updateRentAgreement(data) {
  const { extraData } = data;
  const { contractExpenses } = extraData;

  try {
    const updatedRentAgreement = await prisma.$transaction(async (prisma) => {
      const updatedAgreement = await prisma.rentAgreement.update({
        where: {
          id: +data.id,
        },
        data: {
          rentAgreementNumber: data.rentAgreementNumber,
          startDate: convertToISO(data.startDate),
          endDate: convertToISO(data.endDate),
          tax: +data.tax,
          registrationFees: +data.registrationFees,
          insuranceFees: +data.insuranceFees,
          totalPrice: +data.totalPrice,
          rentCollectionType: data.rentCollectionType,
          renter: {
            connect: {
              id: +data.renterId,
            },
          },
          type: {
            connect: {
              id: +data.typeId,
            },
          },
          unit: {
            connect: {
              id: +data.unitId,
            },
          },
        },
        include: {
          type: {
            select: {
              id: true,
              title: true,
            },
          },
          contractExpenses: true,
          installments: true,
          renter: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              unitId: true,
              property: {
                select: {
                  id: true,
                  name: true,
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
        },
      });

      // Delete existing ContractExpenseToRentAgreement records
      await prisma.contractExpenseToRentAgreement.deleteMany({
        where: {
          rentAgreementId: updatedAgreement.id,
        },
      });

      // Create new ContractExpenseToRentAgreement records
      for (const contractExpense of contractExpenses) {
        await prisma.contractExpenseToRentAgreement.create({
          data: {
            rentAgreementId: updatedAgreement.id,
            contractExpenseId: +contractExpense.id,
          },
        });
      }

      return updatedAgreement;
    });

    return updatedRentAgreement;
  } catch (error) {
    console.error("Error updating rent agreement:", error);
    throw error;
  }
}

export async function deleteRentAgreement(id) {
  try {
    const deletedRentAgreement = await prisma.rentAgreement.delete({
      where: {
        id: +id,
      },
    });
    return deletedRentAgreement;
  } catch (error) {
    console.error("Error deleting rent agreement:", error);
    throw error;
  }
}

export async function getRentAgreementById(page, limit, serachParams, params) {
  const { id } = params;
  try {
    const rentAgreement = await prisma.rentAgreement.findUnique({
      where: { id: +id },
      include: {
        type: {
          select: {
            id: true,
            title: true,
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
          },
        },
        contractExpenses: {
          select: {
            contractExpense: true,
          },
        },
        unit: {
          select: {
            id: true,
            unitId: true,
            property: {
              select: {
                id: true,
                name: true,
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
      },
    });

    return {
      data: rentAgreement,
    };
  } catch (error) {
    console.error("Error fetching rent agreement:", error);
    throw error;
  }
}
