import PDFDocument from 'pdfkit';
import { Writable } from 'stream';

export interface InvoiceData {
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  providerName: string;
  orderDate: string;
  amount: number;
  transactionId: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  taxAndDelivery: number;
}

export const generateInvoicePdf = async (data: InvoiceData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.on('error', (err) => {
        reject(err);
      });

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('FoodHub Invoice', { align: 'center' })
        .moveDown();

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice ID: ${data.invoiceId}`)
        .text(`Date: ${new Date(data.orderDate).toLocaleString()}`)
        .text(`Transaction ID: ${data.transactionId}`)
        .moveDown();

      // Customer and Provider details
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill To:')
        .font('Helvetica')
        .text(data.customerName)
        .text(data.customerEmail)
        .moveDown();

      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Order From:')
        .font('Helvetica')
        .text(data.providerName)
        .moveDown();

      // Items Table
      doc.font('Helvetica-Bold');
      const tableTop = doc.y;
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 350, tableTop);
      doc.text('Price', 400, tableTop);
      doc.text('Total', 480, tableTop);
      
      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
      doc.moveDown();

      doc.font('Helvetica');
      let y = doc.y + 10;
      data.items.forEach(item => {
        const total = item.quantity * item.price;
        doc.text(item.name, 50, y);
        doc.text(item.quantity.toString(), 350, y);
        doc.text(`BDT ${item.price.toFixed(2)}`, 400, y);
        doc.text(`BDT ${total.toFixed(2)}`, 480, y);
        y += 20;
      });

      doc.moveTo(50, y + 5).lineTo(550, y + 5).stroke();
      doc.y = y + 15;

      // Totals
      doc.font('Helvetica-Bold');
      
      let totalY = doc.y;
      doc.text(`Subtotal:`, 400, totalY);
      doc.text(`BDT ${data.subtotal.toFixed(2)}`, 480, totalY);
      
      totalY = doc.y;
      doc.text(`Tax & Delivery:`, 370, totalY);
      doc.text(`BDT ${data.taxAndDelivery.toFixed(2)}`, 480, totalY);

      doc.moveTo(350, doc.y + 5).lineTo(550, doc.y + 5).stroke();
      doc.moveDown();

      totalY = doc.y + 10;
      doc.fontSize(14).text(`Grand Total:`, 370, totalY);
      doc.text(`BDT ${data.amount.toFixed(2)}`, 480, totalY);

      // Footer
      doc
        .fontSize(10)
        .font('Helvetica-Oblique')
        .text('Thank you for ordering with FoodHub!', 50, 700, { align: 'center', width: 500 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
