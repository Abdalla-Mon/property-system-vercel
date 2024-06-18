import React, { forwardRef } from "react";

const InvoicePrint = forwardRef(({ invoice }, ref) => {
  const renderSpecificDetails = (invoiceType) => {
    switch (invoiceType) {
      case "RENT":
        return (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h3>رقم الإيجار:</h3>
              <p>
                {invoice.rentAgreement
                  ? invoice.rentAgreement.rentAgreementNumber
                  : "N/A"}
              </p>
            </div>
          </>
        );
      case "TAX":
        return (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h3>النوع :</h3>
              <p>ضريبة عقد الايجار</p>
            </div>
          </>
        );
      case "INSURANCE":
        return (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h3> النوع:</h3>
              <p>تأمين العقار</p>
            </div>
          </>
        );
      case "REGISTRATION":
        return (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h3> النوع:</h3>
              <p>رسوم تسجيل العقار</p>
            </div>
          </>
        );
      case "MAINTENANCE":
        return (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h3>تفاصيل الصيانة:</h3>
              <p>
                {invoice.maintenance ? invoice.maintenance.description : "N/A"}
              </p>
            </div>
          </>
        );
      case "OTHER_EXPENSE":
      case "OTHER":
      default:
        return (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h3>نوع المصروف:</h3>
              <p>مصروف آخر</p>
            </div>
          </>
        );
    }
  };

  return (
    <div
      ref={ref}
      style={{
        padding: "20px",
        width: "210mm", // A4 width
        maxWidth: "210mm",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1>فاتورة</h1>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          رقم الفاتورة: {invoice.id}
        </div>
      </div>
      <div
        style={{
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "16px" }}>
          <strong>التاريخ:</strong>{" "}
          {new Date(invoice.createdAt).toLocaleDateString("ar-AE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>وصف الفاتورة:</h3>
        <p>{invoice.description}</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>المبلغ:</h3>
        <p>
          {invoice.amount
            ? new Intl.NumberFormat("ar-AE", {
                style: "currency",
                currency: "AED",
              }).format(invoice.amount)
            : "N/A"}
        </p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>المالك:</h3>
        <p>{invoice.owner ? invoice.owner.name : "N/A"}</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>المستأجر:</h3>
        <p>{invoice.renter ? invoice.renter.name : "N/A"}</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>الوحدة:</h3>
        <p>
          {invoice.rentAgreement ? invoice.rentAgreement.unit.number : "N/A"}
        </p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>العقار:</h3>
        <p>{invoice.property ? invoice.property.name : "N/A"}</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>نوع الدفع:</h3>
        <p>
          {invoice.paymentTypeMethod
            ? invoice.paymentTypeMethod === "CASH"
              ? "نقداً"
              : invoice.paymentTypeMethod === "BANK"
                ? "بنك"
                : invoice.paymentTypeMethod === "CHEQUE"
                  ? "شيك"
                  : "N/A"
            : "N/A"}
        </p>
      </div>
      {renderSpecificDetails(invoice.invoiceType)}
    </div>
  );
});

export default InvoicePrint;
