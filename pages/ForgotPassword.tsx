
import React, { useState } from 'react';
import { Link, useNavigate } from '../components/Common';
import { Card, Button } from '../components/Common';
import { storageService } from '../services/storageService';
import { Mail, ArrowLeft, Key, Lock, CheckCircle, Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { User } from '../types';

export const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Email, 2: OTP, 3: New Pass, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Synchronous initialization for immediate render
  const [currentLogo, setCurrentLogo] = useState(() => storageService.getAppLogo());

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const user = storageService.findUserByEmail(email.trim());
      
      if (user) {
        // Generate 4-digit OTP
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(code);
        setTargetUser(user);
        setStep(2);
        
        // DEMO: Show code to user since we can't send real email
        alert(`[MAULI GATE DEMO]\n\nYour Password Reset Code is: ${code}\n\nPlease enter this code to reset your password.`);
      } else {
        setError('No account found with this email address.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp === generatedOtp) {
      setStep(3);
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (targetUser) {
      setIsLoading(true);
      setTimeout(() => {
        const updatedUser = { ...targetUser, password: newPassword };
        storageService.updateUser(updatedUser);
        setStep(4);
        setIsLoading(false);
      }, 800);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
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
                  placeholder="student@mcoet.mauligroup.org"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </div>
          </form>
        );
      
      case 2:
        return (
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div className="text-center mb-4">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2">
                 <Mail className="w-6 h-6"/>
               </div>
               <p className="text-sm text-slate-600">
                 We have sent a verification code to <strong>{email}</strong>.
                 <br/><span className="text-xs text-slate-400">(Check the alert popup for the code)</span>
               </p>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                Enter 4-Digit Code
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md border p-2 tracking-widest text-center font-bold text-lg"
                  placeholder="XXXX"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                Verify Code
              </Button>
            </div>
            
            <div className="text-center">
               <button type="button" onClick={() => setStep(1)} className="text-sm text-primary-600 hover:underline">Resend Code</button>
            </div>
          </form>
        );

      case 3:
        return (
          <form className="space-y-6" onSubmit={handlePasswordReset}>
            <div>
              <label htmlFor="new-pass" className="block text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="new-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-10 sm:text-sm border-slate-300 rounded-md border p-2"
                  placeholder="Min 6 chars"
                />
                <button
                   type="button"
                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
                   onClick={() => setShowPassword(!showPassword)}
                >
                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirm-pass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md border p-2"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                {isLoading ? 'Updating...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        );

      case 4:
        return (
          <div className="text-center py-4">
             <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
               <CheckCircle className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful</h3>
             <p className="text-slate-600 mb-6">Your password has been updated. You can now login with your new credentials.</p>
             <Link to="/login">
               <Button className="w-full">Proceed to Login</Button>
             </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
           {currentLogo && <img src={currentLogo} alt="Mauli Logo" className="w-16 h-16 object-contain" />}
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          {step === 4 ? 'All Set!' : 'Account Recovery'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {step === 1 && 'Enter your registered email to begin.'}
          {step === 2 && 'Verify your identity.'}
          {step === 3 && 'Secure your account.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStep()}

          {step !== 4 && (
            <div className="mt-6">
              <Link to="/login" className="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
    