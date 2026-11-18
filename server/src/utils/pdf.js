import PDFDocument from 'pdfkit';
export const buildInvoicePDF = (order, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${order.soNumber}.pdf`);
  doc.pipe(res);
  doc.fontSize(20).text(`INVOICE ${order.soNumber}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Customer: ${order.customer?.name}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();
  // NOTE: PDFKit's built-in fonts use WinAnsi encoding, which has no ₹ (U+20B9) glyph,
  // so the invoice uses the ASCII-safe "Rs." representation instead.
  order.items.forEach((i, idx) => {
    doc.text(`${idx + 1}. ${i.product?.name || i.product} x${i.quantity} @ Rs.${i.price} discount Rs.${i.discount || 0}`);
  });
  doc.moveDown();
  doc.text(`Subtotal: Rs.${order.subTotal?.toFixed(2)}`);
  doc.text(`Tax (${order.taxRate}%): Rs.${order.taxAmount?.toFixed(2)}`);
  doc.fontSize(14).text(`Total: Rs.${order.total?.toFixed(2)}`);
  doc.end();
};
