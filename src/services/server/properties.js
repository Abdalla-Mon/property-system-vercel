import prisma from "@/lib/prisma";

export async function createProperty(data, extraData) {
  const { electricityMeters, units } = extraData;

  const newProperty = await prisma.property.create({
    data: {
      ...data,
      electricityMeters: {
        create: electricityMeters
          ? electricityMeters.map((meter) => ({ ...meter }))
          : [],
      },
      units: {
        create: units ? units.map((unit) => ({ ...unit })) : [],
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

export async function updateProperty(id, data, extraData) {
  const { electricMetrics, units, ...propertyData } = data;

  const updatedProperty = await prisma.property.update({
    where: { id },
    data: {
      ...propertyData,
      electricMetrics: {
        deleteMany: {}, // Remove existing electricMetrics
        create: electricMetrics ? electricMetrics : [],
      },
      units: {
        deleteMany: {}, // Remove existing units
        create: units ? units.map((unit) => ({ ...unit })) : [],
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
