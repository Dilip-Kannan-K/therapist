
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Check, Leaf, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const PasswordReset = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase letters
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase letters
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contains numbers or special characters
    if (/[0-9]|[^a-zA-Z0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordStrength < 75) {
      setError('Please choose a stronger password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await resetPassword(currentPassword, newPassword);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lilac p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green rounded-full p-2 mr-2">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold">HealerNest</h1>
        </div>
        
        <Card className="w-full shadow-lg border-t-4 border-t-green">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <LockKeyhole className="h-12 w-12 text-green" />
            </div>
            <CardTitle className="text-2xl font-display text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              For security reasons, please create a new password for your account.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-600 text-sm flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-primary pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="input-primary pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs">
                    <span>Password Strength</span>
                    <span>{getStrengthLabel(passwordStrength)}</span>
                  </div>
                  <Progress value={passwordStrength} className="h-2" indicatorClassName={getStrengthColor(passwordStrength)} />
                  
                  <ul className="text-xs space-y-1 text-gray-600 pt-2">
                    <li className="flex items-center">
                      <Check size={12} className={newPassword.length >= 8 ? 'text-green mr-1' : 'text-gray-400 mr-1'} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <Check size={12} className={/[A-Z]/.test(newPassword) ? 'text-green mr-1' : 'text-gray-400 mr-1'} />
                      At least 1 uppercase letter
                    </li>
                    <li className="flex items-center">
                      <Check size={12} className={/[0-9]|[^a-zA-Z0-9]/.test(newPassword) ? 'text-green mr-1' : 'text-gray-400 mr-1'} />
                      At least 1 number or special character
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-primary pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full btn-primary h-11 text-base font-medium"
                disabled={isLoading || newPassword !== confirmPassword || passwordStrength < 75}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Set New Password'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PasswordReset;
