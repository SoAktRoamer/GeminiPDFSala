import { ReactNode } from 'react';

export type ToolCategory = 'AI Tools' | 'Organize PDF' | 'Optimize PDF' | 'Convert to PDF' | 'Convert from PDF' | 'Edit PDF' | 'PDF Security';

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  isAI?: boolean;
}

export const TOOLS: ToolDef[] = [
  { id: 'ai-chat', name: 'AI PDF Chat', description: 'Chat with your PDF and ask questions.', category: 'AI Tools', icon: 'MessageSquare', isAI: true },
  { id: 'ai-summarize', name: 'AI PDF Summarizer', description: 'Get a 5-bullet summary of your PDF instantly.', category: 'AI Tools', icon: 'FileText', isAI: true },
  { id: 'ai-humanize', name: 'Free AI Humanizer', description: 'Humanize AI Text in Seconds.', category: 'AI Tools', icon: 'UserCircle', isAI: true },
  { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one.', category: 'Organize PDF', icon: 'Layers' },
  { id: 'split', name: 'Split PDF', description: 'Extract the first page from your PDF.', category: 'Organize PDF', icon: 'Scissors' },
  { id: 'rotate', name: 'Rotate PDF', description: 'Rotate all pages by 90 degrees.', category: 'Organize PDF', icon: 'RotateCw' },
  { id: 'organize', name: 'Organize PDF', description: 'Reorder or delete pages in your document.', category: 'Organize PDF', icon: 'ListOrdered' },
  { id: 'compress', name: 'Compress PDF', description: 'Reduce the file size of your PDF.', category: 'Optimize PDF', icon: 'Minimize2' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable DOCX.', category: 'Convert from PDF', icon: 'FileText' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF data to XLSX spreadsheets.', category: 'Convert from PDF', icon: 'Grid' },
  { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', description: 'Turn your PDF into a PPTX presentation.', category: 'Convert from PDF', icon: 'Monitor' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Extract images or convert each page to JPG.', category: 'Convert from PDF', icon: 'Image' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', category: 'Convert to PDF', icon: 'File' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF.', category: 'Convert to PDF', icon: 'Grid' },
  { id: 'ppt-to-pdf', name: 'PowerPoint to PDF', description: 'Convert PowerPoint to PDF.', category: 'Convert to PDF', icon: 'Monitor' },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert webpages to PDF documents.', category: 'Convert to PDF', icon: 'Globe' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds.', category: 'Convert to PDF', icon: 'Image' },
  { id: 'edit', name: 'Edit PDF', description: 'Add text, images, shapes or freehand annotations to a PDF.', category: 'Edit PDF', icon: 'Edit3' },
  { id: 'watermark', name: 'Watermark PDF', description: 'Stamp an image or text over your PDF in seconds.', category: 'Edit PDF', icon: 'Droplet' },
  { id: 'page-numbers', name: 'Page Numbers', description: 'Add page numbers into PDFs with ease.', category: 'Edit PDF', icon: 'Hash' },
  { id: 'sign', name: 'Sign PDF', description: 'Sign yourself or request electronic signatures from others.', category: 'PDF Security', icon: 'PenTool' },
  { id: 'protect', name: 'Protect PDF', description: 'Encrypt your PDF with a password.', category: 'PDF Security', icon: 'Lock' },
  { id: 'unlock', name: 'Unlock PDF', description: 'Remove PDF password security.', category: 'PDF Security', icon: 'Unlock' },
];

export const CATEGORIES: ToolCategory[] = [
  'AI Tools',
  'Organize PDF',
  'Optimize PDF',
  'Convert to PDF',
  'Convert from PDF',
  'Edit PDF',
  'PDF Security'
];
