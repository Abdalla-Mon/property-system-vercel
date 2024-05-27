import prisma from '@/lib/prisma'; // Adjust the path to your Prisma instance

export async function createProperty(data) {
    return await prisma.property.create({ data });
}

export async function getPropertyById(id) {
    return await prisma.property.findUnique({
        where: { id },
        include: {
            client: {
                select: { name: true, id: true }
            },
            units: true
        }
    });
}

export async function getProperties({ page = 1, limit = 10, filters = {}, sort = '' }) {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            filters.dateFrom && filters.dateTo ? {
                dateOfBuilt: {
                    gte: new Date(filters.dateFrom),
                    lte: new Date(filters.dateTo)
                }
            } : {}
        ]
    };

    let orderBy = {};
    if (sort) {
        const [field, order] = sort.split('_');
        orderBy[field] = order;
    }

    const properties = await prisma.property.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        include: {
            client: {
                select: { name: true, id: true }
            },
            _count: {
                select: { units: true }
            }
        }
    });

    const totalItems = await prisma.property.count({ where });

    return { properties, totalItems };
}

export async function updateProperty(id, data) {
    return await prisma.property.update({
        where: { id },
        data
    });
}

export async function deleteProperty(id) {
    return await prisma.property.delete({
        where: { id }
    });
}
