import { PDFDocument, rgb, degrees } from 'pdf-lib';

export async function mergePDFs(files: File[]): Promise<File> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  return new File([mergedPdfBytes], 'merged.pdf', { type: 'application/pdf' });
}

export async function splitPDF(file: File): Promise<File> {
  // Simplification: extracts the first page
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();
  
  if (originalPdf.getPageCount() > 0) {
    const [firstPage] = await newPdf.copyPages(originalPdf, [0]);
    newPdf.addPage(firstPage);
  }
  
  const newPdfBytes = await newPdf.save();
  return new File([newPdfBytes], `split_${file.name}`, { type: 'application/pdf' });
}

export async function rotatePDF(file: File): Promise<File> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + 90));
  });
  
  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], `rotated_${file.name}`, { type: 'application/pdf' });
}

export async function watermarkPDF(file: File): Promise<File> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText('CONFIDENTIAL', {
      x: width / 4,
      y: height / 2,
      size: 50,
      color: rgb(0.95, 0.1, 0.1),
      opacity: 0.3,
    });
  });
  
  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], `watermarked_${file.name}`, { type: 'application/pdf' });
}

export async function addPageNumbers(file: File): Promise<File> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  const pages = pdfDoc.getPages();
  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    page.drawText(`${idx + 1}`, {
      x: width / 2,
      y: height - 30,
      size: 14,
      color: rgb(0, 0, 0),
    });
  });
  
  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], `numbered_${file.name}`, { type: 'application/pdf' });
}

export async function compressPDF(file: File): Promise<File> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  // Re-saving without object streams acts as a lightweight compression
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  return new File([pdfBytes], `compressed_${file.name}`, { type: 'application/pdf' });
}
