import prisma from "@/lib/prisma";

export async function createProperty(data) {
  const { extraData } = data;
  const { electricityMeters, units } = extraData;
  delete data.stateId;
  delete data.extraData;

  const buildingGuard = {
    name: data.buildingGuardName,
    number: +data.buildingGuardPhone,
    nationalId: data.buildingGuardId,
  };

  const newProperty = await prisma.property.create({
    data: {
      name: data.name,
      propertyId: data.propertyId,
      voucherNumber: data.voucherNumber,
      street: data.street,
      plateNumber: data.plateNumber,
      price: +data.price,
      dateOfBuilt: data.dateOfBuilt,
      bankAccountNumber: data.bankAccountNumber,
      managementCommission: +data.managementCommission,
      numElevators: +data.numElevators,
      numParkingSpaces: +data.numParkingSpaces,
      builtArea: +data.builtArea,
      location: data.location || "",
      electricityMeters: {
        create: electricityMeters
          ? electricityMeters.map((meter) => ({ ...meter }))
          : [],
      },
      units: {
        create: units
          ? units.map((unit) => ({
              ...unit,

              floor: 0,
            }))
          : [],
      },
      buildingGuard: {
        create: buildingGuard ? buildingGuard : {},
      },
      type: {
        connect: {
          id: +data.typeId,
        },
      },
      city: {
        connect: {
          id: +data.cityId,
        },
      },

      bank: {
        connect: {
          id: +data.bankId,
        },
      },
      client: {
        connect: {
          id: +data.clientId,
        },
      },
    },
  });

  return newProperty;
}

export async function getProperties(page, limit) {
  const offset = (page - 1) * limit;
  const properties = await prisma.property.findMany({
    skip: offset,
    take: limit,
    include: {
      units: true,
    },
  });
  const totalProperties = await prisma.property.count();
  const totalPages = Math.ceil(totalProperties / limit);

  const data = properties.map((property) => ({
    ...property,
    unitsLength: property.units.length,
  }));

  return {
    data,
    totalPages,
    total: totalProperties,
  };
}

export async function getPropertyById(id) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      units: true,
    },
  });

  if (property) {
    return {
      ...property,
      unitsLength: property.units.length,
    };
  }

  return null;
}

export async function updateProperty(id, data) {
  const { extraData } = data;
  const { electricityMeters, units } = extraData;
  delete data.stateId;
  delete data.extraData;

  const buildingGuard = {
    name: data.buildingGuardName,
    number: +data.buildingGuardPhone,
    nationalId: data.buildingGuardId,
  };

  const updatedProperty = await prisma.property.update({
    where: { id },
    data: {
      name: data.name,
      propertyId: data.propertyId,
      voucherNumber: data.voucherNumber,
      street: data.street,
      plateNumber: data.plateNumber,
      price: +data.price,
      dateOfBuilt: data.dateOfBuilt,
      bankAccountNumber: data.bankAccountNumber,
      managementCommission: +data.managementCommission,
      numElevators: +data.numElevators,
      numParkingSpaces: +data.numParkingSpaces,
      builtArea: +data.builtArea,
      location: data.location || "",
      electricityMeters: {
        deleteMany: {}, // Remove existing electricityMeters
        create: electricityMeters
          ? electricityMeters.map((meter) => ({ ...meter }))
          : [],
      },
      units: {
        deleteMany: {}, // Remove existing units
        create: units
          ? units.map((unit) => ({
              ...unit,
              floor: 0,
            }))
          : [],
      },
      buildingGuard: {
        deleteMany: {}, // Remove existing buildingGuard
        create: buildingGuard ? buildingGuard : {},
      },
      type: {
        connect: {
          id: +data.typeId,
        },
      },
      city: {
        connect: {
          id: +data.cityId,
        },
      },
      bank: {
        connect: {
          id: +data.bankId,
        },
      },
      client: {
        connect: {
          id: +data.clientId,
        },
      },
    },
  });

  return updatedProperty;
}

export async function deleteProperty(id) {
  return await prisma.property.delete({
    where: { id },
  });
}
