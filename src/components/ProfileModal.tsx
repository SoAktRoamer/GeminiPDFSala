import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { currentUser, userProfile, refreshProfile, logout } = useAuth();
  
  const [name, setName] = useState(userProfile?.name || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!currentUser) return null;

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name,
        bio,
        photoURL
      }, { merge: true });
      await refreshProfile();
      setMessage('Profile updated successfully!');
    } catch (e) {
      console.error(e);
      setMessage('Error updating profile.');
    }
    setLoading(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50000) {
      alert("Please choose a smaller image (max 50KB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoURL(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid));
        await currentUser.delete();
        onClose();
      } catch (e) {
        console.error("Error deleting account", e);
        alert("Please log in again to delete your account.");
        logout();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] bg-opacity-80 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
          <Icon name="X" className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>

        {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">{message}</div>}

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
             <img src={photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                  alt="Avatar" className="w-20 h-20 rounded-full bg-slate-700 object-cover border border-slate-600" />
             <div>
               <label className="block text-sm font-medium text-indigo-400 cursor-pointer hover:underline">
                 Change Avatar
                 <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
               </label>
               <p className="text-xs text-slate-500 mt-1">Max size 50KB (Base64)</p>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email (Read Only)</label>
            <input 
              type="email" 
              disabled
              value={userProfile?.email || currentUser.email || ''}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-500 rounded-lg cursor-not-allowed opacity-70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Short Biography</label>
            <textarea 
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button onClick={handleDeleteAccount} className="px-4 py-2 border border-red-500/50 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
