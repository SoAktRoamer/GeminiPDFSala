import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { db, storage } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

interface UserFile {
  id: string;
  name: string;
  size: number;
  type: string;
  downloadURL: string;
  storagePath: string;
  createdAt: any;
}

export default function MyFiles({ onClose }: { onClose: () => void }) {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [uploadEta, setUploadEta] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, `users/${currentUser.uid}/files`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data: UserFile[] = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() } as UserFile));
      setFiles(data);
    }, (err) => {
      console.error(err);
    });
    return unsub;
  }, [currentUser]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    
    // Create unique path
    const fileId = Date.now().toString();
    const storagePath = `user_uploads/${currentUser.uid}/${fileId}-${file.name}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);
    const startTime = Date.now();

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        
        const elapsedTime = (Date.now() - startTime) / 1000; // seconds
        if (elapsedTime > 1 && progress > 0) {
           const bytesPerSecond = snapshot.bytesTransferred / elapsedTime;
           const remainingBytes = snapshot.totalBytes - snapshot.bytesTransferred;
           const secondsRemaining = remainingBytes / bytesPerSecond;
           
           setUploadSpeed(`${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`);
           
           if (secondsRemaining > 60) {
             setUploadEta(`${Math.floor(secondsRemaining / 60)}m ${Math.floor(secondsRemaining % 60)}s left`);
           } else {
             setUploadEta(`${Math.floor(secondsRemaining)}s left`);
           }
        }
      }, 
      (error) => {
        console.error(error);
        setError('Upload failed. Please try again.');
        setIsUploading(false);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, `users/${currentUser.uid}/files`), {
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            downloadURL,
            storagePath,
            createdAt: serverTimestamp()
          });
          setShowUpload(false);
        } catch (err) {
          setError('Failed to save file metadata.');
        }
        setIsUploading(false);
      }
    );
  };

  const handleDelete = async (file: UserFile) => {
    if (!currentUser) return;
    try {
      const storageRef = ref(storage, file.storagePath);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, `users/${currentUser.uid}/files`, file.id));
    } catch (e) {
      console.error(e);
      // Fallback if already deleted in storage
      await deleteDoc(doc(db, `users/${currentUser.uid}/files`, file.id));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">My Files</h2>
        <p className="text-slate-400 mb-8">Please sign in to access your saved files.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">My Files</h2>
        <div className="flex space-x-3">
          <button onClick={() => setShowUpload(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-500 transition-colors">
            <Icon name="UploadCloud" className="w-5 h-5" />
            <span>Add File</span>
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-800">
            Back
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        {files.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Icon name="FolderOpen" className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p>You haven't uploaded any files yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-sm text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium hidden md:table-cell">Type</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(f => (
                <tr key={f.id} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 font-medium text-slate-200 truncate max-w-[200px] md:max-w-sm">{f.name}</td>
                  <td className="p-4 text-sm text-slate-400 hidden md:table-cell truncate max-w-[150px]">{f.type}</td>
                  <td className="p-4 text-sm text-slate-400">{formatSize(f.size)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                       <a href={f.downloadURL} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-indigo-400 bg-slate-800 border border-slate-600 shadow-sm rounded-lg transition-colors">
                         <Icon name="DownloadCloud" className="w-4 h-4" />
                       </a>
                       <button onClick={() => handleDelete(f)} className="p-2 text-slate-300 hover:text-red-400 bg-slate-800 border border-slate-600 shadow-sm rounded-lg transition-colors">
                         <Icon name="Trash2" className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] bg-opacity-80 p-4 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl border border-slate-700">
            <button onClick={() => !isUploading && setShowUpload(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
              <Icon name="X" className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Upload File</h3>
            
            {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">{error}</div>}

            {!isUploading ? (
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileSelect} />
                <Icon name="Upload" className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-300 font-medium">Click to select a file</p>
                <p className="text-xs text-slate-500 mt-1">Any file type up to your upload limit</p>
              </div>
            ) : (
              <div className="text-center py-6">
                 <div className="w-full bg-slate-700/50 rounded-full h-2.5 mb-4">
                   <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                 </div>
                 <p className="text-lg font-bold text-white">{Math.round(uploadProgress)}%</p>
                 <div className="flex justify-between text-sm text-slate-400 mt-2 px-2">
                   <span>{uploadSpeed}</span>
                   <span>{uploadEta}</span>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
