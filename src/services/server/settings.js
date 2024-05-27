import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance

// State
export async function createState(data) {
  const { extraData: cities, ...stateData } = data;

  const newState = await prisma.state.create({
    data: {
      ...stateData,
      cities: {
        create: cities.map((city) => ({
          name: city.name,
          location: city.location,
          districts: {
            create: city.districts.map((district) => ({
              name: district.name,
              location: district.location,
            })),
          },
        })),
      },
    },
    include: {
      cities: {
        include: {
          districts: true,
        },
      },
    },
  });
  return { ...newState, citiesLength: newState.cities.length };
}

export async function getStates(page, limit) {
  const offset = (page - 1) * limit;
  const states = await prisma.state.findMany({
    skip: offset,
    take: limit,
    include: {
      cities: {
        include: {
          districts: true,
        },
      },
    },
  });
  const totalStates = await prisma.state.count();
  const totalPages = Math.ceil(totalStates / limit);

  return {
    data: states,
    totalPages,
    total: totalStates,
  };
}

export async function updateState(id, data) {
  const { extraData: cities, ...stateData } = data;

  const updatedState = await prisma.state.update({
    where: { id },
    data: {
      ...stateData,
      cities: {
        deleteMany: {},
        create: cities.map((city) => ({
          name: city.name,
          location: city.location,
          districts: {
            create: city.districts.map((district) => ({
              name: district.name,
              location: district.location,
            })),
          },
        })),
      },
    },
    include: {
      cities: {
        include: {
          districts: true,
        },
      },
    },
  });

  return { ...updatedState, citiesLength: updatedState.cities.length };
}

export async function deleteState(id) {
  return await prisma.state.delete({
    where: { id },
  });
}

// Property Type
export async function createPropertyType(data) {
  const newPropertyType = await prisma.propertyType.create({
    data: {
      ...data,
    },
  });
  return newPropertyType;
}

export async function getPropertyTypes(page, limit) {
  const offset = (page - 1) * limit;
  const propertyTypes = await prisma.propertyType.findMany({
    skip: offset,
    take: limit,
  });
  const totalPropertyTypes = await prisma.propertyType.count();
  const totalPages = Math.ceil(totalPropertyTypes / limit);

  return {
    data: propertyTypes,
    totalPages,
    total: totalPropertyTypes,
  };
}

export async function updatePropertyType(id, data) {
  const updatedPropertyType = await prisma.propertyType.update({
    where: { id },
    data: {
      ...data,
    },
  });

  return updatedPropertyType;
}

export async function deletePropertyType(id) {
  return await prisma.propertyType.delete({
    where: { id },
  });
}

export async function createUnitType(data) {
  const newUnitType = await prisma.unitType.create({
    data: {
      ...data,
    },
  });
  return newUnitType;
}

export async function getUnitTypes(page, limit) {
  const offset = (page - 1) * limit;
  const unitTypes = await prisma.unitType.findMany({
    skip: offset,
    take: limit,
  });
  const totalUnitTypes = await prisma.unitType.count();
  const totalPages = Math.ceil(totalUnitTypes / limit);

  return {
    data: unitTypes,
    totalPages,
    total: totalUnitTypes,
  };
}

export async function updateUnitType(id, data) {
  const updatedUnitType = await prisma.unitType.update({
    where: { id },
    data: {
      ...data,
    },
  });
  return updatedUnitType;
}

export async function deleteUnitType(id) {
  return await prisma.unitType.delete({
    where: { id },
  });
}

// Bank
export async function createBank(data) {
  return await prisma.bank.create({ data });
}

export async function getBanks(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [banks, total] = await prisma.$transaction([
    prisma.Bank.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.bank.count(),
  ]);

  return {
    data: banks,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateBank(id, data) {
  id = +id;
  return await prisma.bank.update({
    where: { id },
    data,
  });
}

export async function deleteBank(id) {
  return await prisma.bank.delete({
    where: { id },
  });
}

// Contract Expense
export async function createContractExpense(data) {
  data = {
    name: data.name,
    value: +data.value,
  };
  return await prisma.contractExpense.create({ data });
}

export async function getContractExpenses(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [contractExpenses, total] = await prisma.$transaction([
    prisma.contractExpense.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.contractExpense.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: contractExpenses,
    total,
    totalPages,
  };
}

export async function updateContractExpense(id, data) {
  data = {
    name: data.name,
    value: +data.value,
  };
  return await prisma.contractExpense.update({
    where: { id },
    data,
  });
}

export async function deleteContractExpense(id) {
  return await prisma.contractExpense.delete({
    where: { id },
  });
}

// Property Expense Type
export async function createPropertyExpenseType(data) {
  return await prisma.propertyExpenseType.create({ data });
}

export async function getPropertyExpenseTypes(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [propertyExpenseTypes, total] = await prisma.$transaction([
    prisma.propertyExpenseType.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.propertyExpenseType.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: propertyExpenseTypes,
    total,
    totalPages,
  };
}

export async function updatePropertyExpenseType(id, data) {
  return await prisma.propertyExpenseType.update({
    where: { id },
    data,
  });
}

export async function deletePropertyExpenseType(id) {
  return await prisma.propertyExpenseType.delete({
    where: { id },
  });
}

// Collector
export async function createCollector(data) {
  return await prisma.collector.create({ data });
}

export async function getCollectors(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [collectors, total] = await prisma.$transaction([
    prisma.collector.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.collector.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: collectors,
    total,
    totalPages,
  };
}

export async function updateCollector(id, data) {
  return await prisma.collector.update({
    where: { id },
    data,
  });
}

export async function deleteCollector(id) {
  return await prisma.collector.delete({
    where: { id },
  });
}

export async function createRentAgreementType(data) {
  const { extraData: description, ...typesData } = data;
  console.log(description, "description");
  data = {
    ...typesData,
    description,
  };
  return await prisma.rentAgreementType.create({ data });
}

export async function getRentAgreementTypes(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [types, total] = await prisma.$transaction([
    prisma.rentAgreementType.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.rentAgreementType.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: types,
    total,
    totalPages,
  };
}

export async function updateRentAgreementType(id, data) {
  const { extraData: description, ...typesData } = data;
  data = {
    ...typesData,
    description,
  };
  return await prisma.rentAgreementType.update({
    where: { id },
    data,
  });
}

export async function deleteRentAgreementType(id) {
  return await prisma.rentAgreementType.delete({
    where: { id },
  });
}
