
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/Common';
import { storageService } from '../services/storageService';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentLogo, setCurrentLogo] = useState('');

  useEffect(() => {
    setCurrentLogo(storageService.getAppLogo());
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock functionality
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
           {currentLogo && <img src={currentLogo} alt="Mauli Logo" className="w-16 h-16 object-contain" />}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your email to receive reset instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md border p-2"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  Send Reset Link
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Check your email</h3>
              <p className="mt-2 text-sm text-slate-500">
                We have sent a password reset link to {email}
              </p>
              <div className="mt-6">
                <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full">
                  Try another email
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link to="/login" className="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
