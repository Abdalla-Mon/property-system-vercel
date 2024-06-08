export async function createNewBankAccount(data, params, searchParams) {
  const renterId = searchParams.get("renterId");
  console.log(renterId, "renterId");
  const bankAccount = await prisma.bankAccount.create({
    data: {
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      bankId: data.bankId,
      clientId: +renterId,
    },
  });
  return {
    id: bankAccount.id,
    name: bankAccount.accountNumber,
  };
}

export async function updatePayment(id, data) {
  let payment;
  const restPayment =
    +data.amount - (+data.currentPaidAmount + +data.paidAmount);
  console.log(
    +data.paidAmount + +data.currentPaidAmount,
    "+data.paidAmount + +data.currentPaidAmount",
  );
  console.log(data, "coming data");
  if (restPayment > 0) {
    payment = await prisma.payment.update({
      where: { id: +id },
      data: {
        paidAmount: +data.paidAmount + +data.currentPaidAmount,
        status: "PENDING",
      },
    });
  } else {
    payment = await prisma.payment.update({
      where: { id: +id },
      data: {
        paidAmount: +data.paidAmount + +data.currentPaidAmount,
        status: "PAID",
      },
    });
    await prisma.installment.update({
      where: { id: +payment.installmentId },
      data: {
        status: true,
      },
    });
  }

  return payment;
}

// model Invoice {
//   id                Int      @id @default(autoincrement())
//   amount            Float
//   description       String
//   title             String?
//         bankAccountId         Int?
//               bankAccount       BankAccount? @relation(fields: [bankAccountId], references: [id], onDelete: SetNull)
//   propertyId        Int?
//         property          Property? @relation(fields: [propertyId], references: [id], onDelete: SetNull)
//   clientId          Int
//   client            Client @relation(fields: [clientId], references: [id], onDelete: Cascade)
//   rentAgreementId   Int?
//         rentAgreement     RentAgreement? @relation(fields: [rentAgreementId], references: [id], onDelete: SetNull)
//   installmentId     Int?
//         installment       Installment? @relation(fields: [installmentId], references: [id], onDelete: SetNull)
//   maintenanceId     Int?
//         maintenance       Maintenance? @relation(fields: [maintenanceId], references: [id], onDelete: SetNull)
//   maintenanceInstallmentId Int?
//         maintenanceInstallment MaintenanceInstallment? @relation(fields: [maintenanceInstallmentId], references: [id], onDelete: SetNull)
//   contractExpenseId Int?
//         contractExpense   ContractExpenseToRentAgreement? @relation(fields: [contractExpenseId], references: [id], onDelete: SetNull)
//   paymentId         Int?
//         payment           Payment? @relation(fields: [paymentId], references: [id], onDelete: SetNull)
//   incomes           Income[]
//   expenses          Expense[]
//   createdAt         DateTime @default(now())
//   updatedAt         DateTime @updatedAt
// }