
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Leaf } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(username, password);
      // Redirect is handled by ProtectedRoute component
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
        
        <h2 className="text-center text-lg text-gray-600 mb-8 font-display">
          A safe place to learn and grow
        </h2>
        
        <Card className="w-full shadow-lg border-t-4 border-t-green">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your therapist credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-primary"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-primary"
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full btn-primary h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            For demo purposes: Try username "therapist1" with password "welcome123"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
