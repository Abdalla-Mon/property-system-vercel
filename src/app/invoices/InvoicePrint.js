import React, { forwardRef } from "react";

const InvoicePrint = forwardRef(({ invoice }, ref) => (
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
        {new Date(invoice.createdAt).toLocaleDateString()}
      </div>
    </div>
    <div style={{ marginBottom: "20px" }}>
      <h3>وصف الفاتورة:</h3>
      <p>{invoice.description}</p>
    </div>
    <div style={{ marginBottom: "20px" }}>
      <h3>المبلغ:</h3>
      <p>{invoice.amount}</p>
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
      <p>{invoice.rentAgreement ? invoice.rentAgreement.unit.number : "N/A"}</p>
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
  </div>
));

export default InvoicePrint;
