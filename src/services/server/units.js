import prisma from "@/lib/prisma";

export async function createUnit(data) {
  const createData = {
    name: data.name,
    number: data.number,
    yearlyRentPrice: +data.yearlyRentPrice,
    electricityMeter: data.electricityMeter,
    numBedrooms: +data.numBedrooms,
    floor: +data.floor,
    numBathrooms: +data.numBathrooms,
    numACs: +data.numACs,
    numLivingRooms: +data.numLivingRooms,
    numKitchens: +data.numKitchens,
    numSaloons: +data.numSaloons,
    unitId: data.unitId,
    notes: data.notes,
    type: {
      connect: {
        id: +data.typeId,
      },
    },
    property: {
      connect: {
        id: +data.propertyId,
      },
    },
  };

  const newUnit = await prisma.unit.create({
    data: createData,
    include: {
      type: {
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
      rentAgreements: true,
    },
  });
  return newUnit;
}

export async function getUnits(page, limit) {
  const offset = (page - 1) * limit;
  const units = await prisma.unit.findMany({
    skip: offset,
    take: limit,
    include: {
      type: {
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
      property: {
        select: {
          id: true,
          name: true,
        },
      },
      rentAgreements: true,
    },
  });

  const totalUnits = await prisma.unit.count();

  const totalPages = Math.ceil(totalUnits / limit);

  return {
    data: units,
    totalPages,
    total: totalUnits,
  };
}

// Get a single unit by ID
export async function getUnitById(page, limit, searchParams, params) {
  const id = +params.id;

  const unit = await prisma.unit.findUnique({
    where: { id: +id },
    include: {
      type: {
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
      property: {
        select: {
          id: true,
          name: true,
        },
      },
      rentAgreements: true,
    },
  });
  return {
    data: unit,
  };
}

// Update a unit by ID
export async function updateUnit(id, data) {
  const updateData = {
    name: data.name,
    number: data.number,
    yearlyRentPrice: +data.yearlyRentPrice,
    electricityMeter: data.electricityMeter,
    numBedrooms: +data.numBedrooms,
    floor: +data.floor,
    numBathrooms: +data.numBathrooms,
    numACs: +data.numACs,
    numLivingRooms: +data.numLivingRooms,
    numKitchens: +data.numKitchens,
    numSaloons: +data.numSaloons,
    unitId: data.unitId,
    notes: data.notes,
    type: {
      connect: {
        id: +data.typeId,
      },
    },
    client: data.clientId
      ? {
          connect: {
            id: +data.clientId,
          },
        }
      : {
          disconnect: true,
        },
  };

  const updatedUnit = await prisma.unit.update({
    where: { id: +id },
    data: updateData,
    include: {
      type: {
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
    },
  });

  return updatedUnit;
}

// Delete a unit by ID
export async function deleteUnit(id) {
  const deletedUnit = await prisma.unit.delete({
    where: { id: +id },
  });

  return deletedUnit;
}
