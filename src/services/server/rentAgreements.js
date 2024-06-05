import { convertToISO } from "@/helpers/functions/convertDateToIso";

const RentCollectionType = {
  TWO_MONTHS: 6,
  THREE_MONTHS: 4,
  FOUR_MONTHS: 3,
  SIX_MONTHS: 2,
  ONE_YEAR: 1,
};

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
    // Delete related invoices
    await prisma.invoice.deleteMany({
      where: {
        rentAgreementId: id,
      },
    });

    // Delete related installments
    await prisma.installment.deleteMany({
      where: {
        rentAgreementId: id,
      },
    });
    await prisma.contractExpenseToRentAgreement.deleteMany({
      where: {
        rentAgreementId: +id,
      },
    });
    // Delete the rent agreement
    await prisma.rentAgreement.delete({
      where: { id },
    });

    console.log(`Rent agreement with id ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting rent agreement with id ${id}:`, error);
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

// rent creation with invioces
export async function createRentAgreement(data) {
  try {
    const rentAgreementType = await prisma.RentAgreementType.findUnique({
      where: {
        id: +data.typeId,
      },
    });

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
        customDescription: rentAgreementType.description,
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

    return {
      data: newRentAgreement,
      message: "تمت اضافه عقد الايجار بنجاح",
      status: 200,
    };
  } catch (error) {
    console.error("Error creating rent agreement:", error);
    throw error;
  }
}

export async function createInstallmentsAndInvoices(rentAgreement) {
  try {
    const installmentAmount =
      rentAgreement.totalPrice /
      RentCollectionType[rentAgreement.rentCollectionType];
    const installments = Array(
      RentCollectionType[rentAgreement.rentCollectionType],
    )
      .fill()
      .map((_, i) => {
        const startDate = new Date(rentAgreement.startDate);
        const dueDate = new Date(
          startDate.setMonth(
            startDate.getMonth() +
              i * (12 / RentCollectionType[rentAgreement.rentCollectionType]),
          ),
        );
        const endDate = new Date(
          dueDate.setMonth(
            dueDate.getMonth() +
              12 / RentCollectionType[rentAgreement.rentCollectionType],
          ),
        );
        return {
          startDate: convertToISO(new Date(rentAgreement.startDate)),
          dueDate: convertToISO(dueDate),
          endDate: convertToISO(endDate),
          status: false,
          rentAgreementId: rentAgreement.id,
          amount: installmentAmount,
        };
      });

    for (let i = 0; i < installments.length; i++) {
      const installment = installments[i];
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
          description: `دفعه رقم ${i + 1} لعقد الإيجار رقم ${rentAgreement.rentAgreementNumber}`,
          dueDate: dueDate,
          status: "PENDING",
          title: `الدفعة رقم ${i + 1}`,
          clientId: rentAgreement.unit.property.client.id,
          propertyId: rentAgreement.unit.property.id,
          rentAgreementId: rentAgreement.id,
          installmentId: createdInstallment.id,
          invoiceType: "RENT",
        },
      });
    }
    return {
      data: {},
      message: "تمت اضافه الدفعات بنجاح",
    };
  } catch (error) {
    console.error("Error creating installments and invoices:", error);
    throw error;
  }
}

export async function createFeeInvoices(rentAgreement) {
  try {
    const feeInvoices = [
      {
        amount: (rentAgreement.tax * rentAgreement.totalPrice) / 100,
        description: `ضريبة عقد الإيجار #${rentAgreement.rentAgreementNumber}`,
        dueDate: rentAgreement.startDate,
        title: "ضريبة",
        clientId: rentAgreement.unit.property.client.id,
        status: "PENDING",
        propertyId: rentAgreement.unit.property.id,
        rentAgreementId: rentAgreement.id,
        invoiceType: "TAX",
      },
      {
        amount: rentAgreement.insuranceFees,
        description: `رسوم التأمين لعقد الإيجار #${rentAgreement.rentAgreementNumber}`,
        dueDate: rentAgreement.startDate,
        title: "رسوم التأمين",
        clientId: rentAgreement.unit.property.client.id,
        status: "PENDING",
        propertyId: rentAgreement.unit.property.id,
        rentAgreementId: rentAgreement.id,
        invoiceType: "INSURANCE",
      },
      {
        amount: rentAgreement.registrationFees,
        description: `رسوم التسجيل لعقد الإيجار #${rentAgreement.rentAgreementNumber}`,
        dueDate: rentAgreement.startDate,
        title: "رسوم التسجيل",
        clientId: rentAgreement.unit.property.client.id,
        status: "PENDING",
        propertyId: rentAgreement.unit.property.id,
        rentAgreementId: rentAgreement.id,
        invoiceType: "REGISTRATION",
      },
    ];

    for (const invoice of feeInvoices) {
      if (invoice.amount > 0) {
        await prisma.invoice.create({
          data: invoice,
        });
      }
    }
    return {
      data: {},
      message: "تمت اضافه فواتير الرسوم  بنجاح",
    };
  } catch (error) {
    console.error("Error creating fee invoices:", error);
    throw error;
  }
}

export async function createContractExpenseInvoices({
  rentAgreement,
  contractExpenses,
}) {
  try {
    for (const contractExpense of contractExpenses) {
      await prisma.ContractExpenseToRentAgreement.create({
        data: {
          rentAgreementId: rentAgreement.id,
          contractExpenseId: +contractExpense.id,
        },
      });

      await prisma.invoice.create({
        data: {
          amount: contractExpense.value,
          description: `مصروف عقار بقيمة ${contractExpense.value} للعقار ${rentAgreement.unit.property.name}`,
          dueDate: rentAgreement.startDate,
          title: contractExpense.name,
          clientId: rentAgreement.unit.property.client.id,
          propertyId: rentAgreement.unit.property.id,
          status: "PENDING",
          rentAgreementId: rentAgreement.id,
          invoiceType: "OTHER",
        },
      });
    }
    return {
      data: {},
      message: "تمت اضافه فواتير مصروفات العقود بنجاح",
    };
  } catch (error) {
    console.error("Error creating contract expense invoices:", error);
    throw error;
  }
}