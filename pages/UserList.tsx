import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/Common';
import { storageService } from '../services/storageService';
import { User, Role } from '../types';
import { Trash2, User as UserIcon, ShieldCheck, Mail, BookOpen, Calendar, Search } from 'lucide-react';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = storageService.getCurrentUser();

  useEffect(() => {
    setUsers(storageService.getUsers());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this user from the portal? This action cannot be undone.')) {
      storageService.deleteUser(id);
      setUsers(storageService.getUsers());
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.branch && user.branch.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (currentUser?.role !== Role.ADMIN) {
    return <div className="p-8 text-center text-red-500">Access Denied. Administrator privileges required.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Student Management</h1>
          <p className="text-slate-500">View and manage registered users of Mauli GATE Portal.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Branch / Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-slate-900 flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-400"/> {user.email}</div>
                      {user.phone && <div className="text-sm text-slate-500">{user.phone}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col items-start gap-1">
                        {user.role === Role.ADMIN ? (
                          <Badge color="purple"><ShieldCheck className="w-3 h-3 mr-1"/> Administrator</Badge>
                        ) : (
                          <Badge color="blue"><UserIcon className="w-3 h-3 mr-1"/> Student</Badge>
                        )}
                        {user.branch && (
                          <span className="text-xs text-slate-600 flex items-center bg-slate-100 px-2 py-0.5 rounded">
                             <BookOpen className="w-3 h-3 mr-1" /> {user.branch}
                          </span>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center">
                       <Calendar className="w-3 h-3 mr-1" />
                       {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.email !== currentUser?.email && (
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-500">
             No users found matching your search.
          </div>
        )}
      </Card>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
         <p className="text-sm text-blue-800">
           <strong>Note:</strong> Deleting a student account will permanently remove their exam history, syllabus progress, and profile data from the local database.
         </p>
      </div>
    </div>
  );
};