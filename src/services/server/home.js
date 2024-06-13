import prisma from "@/lib/prisma";

export async function getExpenses(page, limit, searchParams, params) {
  const propertyId = searchParams.get("propertyId");
  const currentMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  const currentMonthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  );

  const whereClause = {
    date: {
      gte: currentMonthStart,
      lte: currentMonthEnd,
    },
  };
  console.log(propertyId, "propertyId");
  if (propertyId) {
    whereClause.propertyId = parseInt(propertyId, 10);
  }

  const expenses = await prisma.expense.findMany({ where: whereClause });

  return {
    data: expenses,
  };
}

export async function getIncome(page, limit, searchParams, params) {
  const currentMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  const propertyId = searchParams.get("propertyId");
  const currentMonthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  );

  const whereClause = {
    date: {
      gte: currentMonthStart,
      lte: currentMonthEnd,
    },
  };

  if (propertyId) {
    whereClause.propertyId = parseInt(propertyId, 10);
  }

  const income = await prisma.income.findMany({ where: whereClause });

  return {
    data: income,
  };
}

export async function getRentedUnits(page, limit, searchParams, params) {
  const propertyId = searchParams.get("propertyId");
  const whereClause = { rentAgreements: { some: { status: "ACTIVE" } } };

  if (propertyId) {
    whereClause.propertyId = parseInt(propertyId, 10);
  }

  const units = await prisma.unit.findMany({ where: whereClause });
  return {
    data: units,
  };
}

export async function getNonRentedUnits(page, limit, searchParams, params) {
  const propertyId = searchParams.get("propertyId");
  const whereClause = { rentAgreements: { none: { status: "ACTIVE" } } };

  if (propertyId) {
    whereClause.propertyId = parseInt(propertyId, 10);
  }

  const units = await prisma.unit.findMany({ where: whereClause });

  return {
    data: units,
  };
}

export async function getPayments(page, limit, searchParams, params) {
  const currentMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  const currentMonthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  );

  const whereClause = {
    dueDate: {
      gte: currentMonthStart,
      lte: currentMonthEnd,
    },
  };
  const propertyId = searchParams.get("propertyId");
  if (propertyId) {
    whereClause.propertyId = parseInt(propertyId, 10);
  }

  const payments = await prisma.payment.findMany({
    where: whereClause,
    select: {
      id: true,
      amount: true,
      paidAmount: true,
      status: true,
      paymentType: true,
      property: {
        select: {
          name: true,
        },
      },
      unit: {
        select: {
          number: true,
        },
      },
      rentAgreement: {
        select: {
          rentAgreementNumber: true,
        },
      },
    },
  });

  return {
    data: payments,
  };
}
