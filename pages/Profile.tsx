import React, { useState, useEffect } from 'react';
import { useNavigate } from '../components/Common';
import { Card, Button, Badge } from '../components/Common';
import { storageService } from '../services/storageService';
import { User, Subject, Role } from '../types';
import { User as UserIcon, Mail, Phone, BookOpen, Camera, Save, LogOut, Upload, Link, RefreshCcw } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: '',
    bio: ''
  });
  
  // Logo Management State - Synchronous init
  const [appLogo, setAppLogo] = useState(() => storageService.getAppLogo());
  const [newLogoUrl, setNewLogoUrl] = useState('');

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        phone: currentUser.phone || '',
        branch: currentUser.branch || '',
        bio: currentUser.bio || ''
      });
    }
  }, []);

  const handleSave = () => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      branch: formData.branch,
      bio: formData.bio
    };

    storageService.updateUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    storageService.logout();
    navigate('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
           const updatedUser = { ...user, avatar: event.target.result as string };
           storageService.updateUser(updatedUser);
           setUser(updatedUser);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // --- Logo Handlers ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          storageService.setAppLogo(url);
          setAppLogo(url);
          setNewLogoUrl('');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLogoUrlSave = () => {
    if (newLogoUrl.trim()) {
      storageService.setAppLogo(newLogoUrl.trim());
      setAppLogo(newLogoUrl.trim());
      setNewLogoUrl('');
    }
  };

  const handleLogoReset = () => {
    storageService.resetAppLogo();
    setAppLogo(storageService.getAppLogo());
    setNewLogoUrl('');
  };

  if (!user) return <div>Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">
              {user.role === Role.ADMIN ? 'Administrator Profile' : 'Student Profile'}
            </h1>
            <p className="text-slate-500">Manage your personal information and preferences.</p>
         </div>
         
         {!isEditing && (
           <div className="flex gap-3">
             <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
             <Button variant="danger" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
             </Button>
           </div>
         )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Basic Info */}
          <div className="space-y-6">
            <Card className="col-span-1 p-6 text-center h-fit">
               <div className="relative inline-block mx-auto mb-4">
                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 shadow-md mx-auto">
                   {user.avatar ? (
                     <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-primary-800 text-white flex items-center justify-center text-4xl font-bold">
                       {user.name.charAt(0)}
                     </div>
                   )}
                 </div>
                 <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer border hover:bg-slate-50 transition-colors">
                   <Camera className="w-4 h-4 text-primary-700" />
                   <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                 </label>
               </div>
               
               <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
               <p className="text-sm text-slate-500 mb-2">{user.email}</p>
               <Badge color="brown">{user.role}</Badge>
            </Card>

            {/* Admin Branding Control */}
            {user.role === Role.ADMIN && (
              <Card className="p-6 border-t-4 border-t-primary-600">
                 <div className="flex items-center gap-2 mb-4">
                   <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
                     <Upload className="w-5 h-5"/>
                   </div>
                   <h3 className="font-bold text-slate-900">System Branding</h3>
                 </div>
                 
                 <div className="mb-6 text-center p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Current Logo</p>
                    <img src={appLogo} alt="Current Logo" className="h-16 w-auto mx-auto object-contain" />
                 </div>

                 <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Upload File</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    </div>
                    
                    <div className="relative">
                       <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-slate-200"></div>
                       </div>
                       <div className="relative flex justify-center text-xs uppercase">
                         <span className="bg-white px-2 text-slate-400 font-bold">OR</span>
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="https://..."
                          value={newLogoUrl}
                          onChange={(e) => setNewLogoUrl(e.target.value)}
                          className="flex-1 text-sm border-slate-300 rounded focus:ring-primary-500 focus:border-primary-500 p-2 border"
                        />
                        <Button size="sm" onClick={handleLogoUrlSave} disabled={!newLogoUrl}>
                          <Save className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogoReset}>
                       <RefreshCcw className="w-3 h-3 mr-2"/> Reset to Default
                    </Button>
                 </div>
              </Card>
            )}
          </div>

          {/* Right Column: Details Form */}
          <Card className="col-span-1 md:col-span-2 p-8">
             <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b pb-2 mb-4">
                   <UserIcon className="w-5 h-5 text-primary-600" />
                   <h3 className="text-lg font-bold text-slate-800">Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <p className="p-2 bg-slate-50 rounded text-slate-800 font-medium">{user.name}</p>
                      )}
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email (Read-only)</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="text" 
                          value={user.email} 
                          disabled 
                          className="w-full pl-9 p-2 border rounded bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        {isEditing ? (
                          <input 
                            type="tel" 
                            value={formData.phone}
                            placeholder="+91 9876543210"
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-9 p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                          />
                        ) : (
                          <p className="pl-9 p-2 bg-slate-50 rounded text-slate-800 font-medium">{user.phone || 'Not set'}</p>
                        )}
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Branch / Stream</label>
                      <div className="relative">
                        <BookOpen className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        {isEditing ? (
                          <select 
                            value={formData.branch}
                            onChange={e => setFormData({...formData, branch: e.target.value})}
                            className="w-full pl-9 p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                          >
                             <option value="">Select Branch</option>
                             {Object.values(Subject).filter(s => s !== Subject.GEN).map(s => (
                               <option key={s} value={s}>{s}</option>
                             ))}
                          </select>
                        ) : (
                          <p className="pl-9 p-2 bg-slate-50 rounded text-slate-800 font-medium">{user.branch || 'Not set'}</p>
                        )}
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Bio / Academic Goals</label>
                   {isEditing ? (
                     <textarea 
                       rows={3}
                       value={formData.bio}
                       onChange={e => setFormData({...formData, bio: e.target.value})}
                       className="w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                       placeholder="Tell us about your GATE goals..."
                     />
                   ) : (
                     <p className="p-2 bg-slate-50 rounded text-slate-800 font-medium min-h-[80px]">{user.bio || 'No bio added.'}</p>
                   )}
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4 space-x-3 border-t">
                     <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                     <Button onClick={handleSave}>
                       <Save className="w-4 h-4 mr-2" /> Save Changes
                     </Button>
                  </div>
                )}
             </div>
          </Card>
       </div>
    </div>
  );
};