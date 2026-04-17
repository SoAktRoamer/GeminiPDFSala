import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { mergePDFs, splitPDF, compressPDF, rotatePDF, watermarkPDF, addPageNumbers } from '../lib/pdfLibHelper';

export default function GenericPDFTool({ toolId }: { toolId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const allowMultiple = toolId === 'merge';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResultFile(null);
      setError('');
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError('');

    try {
      let output: File;
      switch (toolId) {
        case 'merge':
          if (files.length < 2) throw new Error("Please select at least 2 PDFs to merge.");
          output = await mergePDFs(files);
          break;
        case 'split':
          output = await splitPDF(files[0]);
          break;
        case 'compress':
          output = await compressPDF(files[0]);
          break;
        case 'rotate':
          output = await rotatePDF(files[0]);
          break;
        case 'watermark':
          output = await watermarkPDF(files[0]);
          break;
        case 'page-numbers':
          output = await addPageNumbers(files[0]);
          break;
        default:
          // Mock processing for unsupported/stubbed client-side features
          await new Promise(r => setTimeout(r, 1500));
          output = new File(['mock content'], `processed_${files[0].name.replace('.pdf', '')}.pdf`, { type: 'application/pdf' });
      }
      setResultFile(output);
    } catch (e: any) {
      setError(e.message || 'An error occurred during processing.');
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    if (!resultFile) return;
    const url = URL.createObjectURL(resultFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto w-full">
      {!resultFile ? (
        <>
          <label className="w-full border-2 border-dashed border-red-500/30 rounded-2xl flex flex-col items-center justify-center bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer p-16 text-center shadow-sm">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png" 
              multiple={allowMultiple} 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <Icon name="PlusCircle" className="w-16 h-16 text-red-500 mb-6" />
            <p className="font-bold text-white text-2xl mb-2">Select {allowMultiple ? 'PDF files' : 'a file'}</p>
            <p className="text-slate-400">or drop {allowMultiple ? 'files' : 'file'} here</p>
          </label>

          {files.length > 0 && (
            <div className="w-full mt-8">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm">
                <h4 className="text-slate-300 font-semibold mb-2 text-sm uppercase tracking-wider">Selected Files</h4>
                <ul className="space-y-2 mb-4">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-300 bg-slate-700 px-3 py-2 rounded">
                      <Icon name="File" className="w-4 h-4 mr-2 text-slate-400" />
                      {f.name}
                    </li>
                  ))}
                </ul>

                {error && <div className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 p-2 rounded">{error}</div>}

                <div className="flex justify-center">
                  <button 
                    onClick={handleProcess}
                    disabled={processing}
                    className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                  >
                    {processing ? (
                      <>
                        <Icon name="Loader2" className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Settings" className="w-5 h-5" />
                        <span>Execute</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full border border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-800 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <Icon name="Check" className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="font-bold text-white text-3xl mb-4">Task Complete!</h3>
          <p className="text-slate-400 mb-8 max-w-md">Your file has been successfully processed and is ready for download.</p>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleDownload}
              className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-500 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Icon name="Download" className="w-5 h-5" />
              <span>Download File</span>
            </button>
            <button 
              onClick={() => { setFiles([]); setResultFile(null); }}
              className="bg-slate-700 border border-slate-600 text-slate-300 px-8 py-3 rounded-full font-bold text-lg hover:bg-slate-600 transition-colors shadow-sm"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
