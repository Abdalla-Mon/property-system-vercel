import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance

export async function createRenter(data) {
  const newRenter = await prisma.client.create({
    data: {
      ...data,
      role: "RENTER",
    },
  });
  return newRenter;
}

export async function getRenters(page, limit) {
  const offset = (page - 1) * limit;
  const renters = await prisma.client.findMany({
    where: { role: "RENTER" },
    skip: offset,
    take: limit,
  });
  const totalRenters = await prisma.client.count({ where: { role: "RENTER" } });
  const totalPages = Math.ceil(totalRenters / limit);

  return {
    data: renters,
    totalPages,
    total: totalRenters,
  };
}

export async function updateRenter(id, data) {
  const updatedRenter = await prisma.client.update({
    where: { id },
    data: {
      ...data,
    },
  });
  return updatedRenter;
}

export async function deleteRenter(id) {
  return await prisma.client.delete({
    where: { id },
  });
}

export async function createOwner(data) {
  console.log(data, "data");
  const newOwner = await prisma.client.create({
    data: {
      ...data,
      role: "OWNER",
    },
  });
  return newOwner;
}

export async function getOwners(page, limit) {
  const offset = (page - 1) * limit;
  const owners = await prisma.client.findMany({
    where: { role: "OWNER" },
    skip: offset,
    take: limit,
  });
  const totalOwners = await prisma.client.count({ where: { role: "OWNER" } });
  const totalPages = Math.ceil(totalOwners / limit);

  return {
    data: owners,
    totalPages,
    total: totalOwners,
  };
}

export async function updateOwner(id, data) {
  const updatedOwner = await prisma.client.update({
    where: { id },
    data: {
      ...data,
    },
  });
  return updatedOwner;
}

export async function deleteOwner(id) {
  return await prisma.client.delete({
    where: { id },
  });
}
