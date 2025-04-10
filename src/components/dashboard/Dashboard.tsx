
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, MessageSquare, PieChart, UserSquare, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for dashboard
  const stats = {
    activeClients: 12,
    pendingRequests: 3,
    completedSessions: 24,
    upcomingSessions: 5,
    averageRating: 4.8,
    retention: 92
  };
  
  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold">Welcome, {user?.name || 'Therapist'}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your practice today.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Clients Card */}
        <Card className="card-dashboard animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-display">Active Clients</CardTitle>
            <Users className="h-5 w-5 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeClients}</div>
            <p className="text-muted-foreground text-sm mt-1">clients in therapy</p>
          </CardContent>
        </Card>
        
        {/* Session Requests Card */}
        <Card className="card-dashboard animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-display">Session Requests</CardTitle>
            <MessageSquare className="h-5 w-5 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingRequests}</div>
            <p className="text-muted-foreground text-sm mt-1">pending requests</p>
          </CardContent>
          <CardFooter className="pt-0">
            <button className="text-green text-sm flex items-center">
              View all requests
            </button>
          </CardFooter>
        </Card>
        
        {/* Upcoming Sessions Card */}
        <Card className="card-dashboard animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-display">Upcoming Sessions</CardTitle>
            <Calendar className="h-5 w-5 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-muted-foreground text-sm mt-1">sessions this week</p>
          </CardContent>
          <CardFooter className="pt-0">
            <button className="text-green text-sm flex items-center">
              View calendar
            </button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Today's Schedule Card */}
        <Card className="card-dashboard animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="text-xl font-display">Today's Schedule</CardTitle>
            <CardDescription>Upcoming sessions for today</CardDescription>
          </CardHeader>
          <CardContent>
            {[
              {
                time: '10:00 AM - 11:00 AM',
                client: 'Maria Thompson',
                type: 'Video'
              },
              {
                time: '1:30 PM - 2:30 PM',
                client: 'James Wilson',
                type: 'Audio'
              },
              {
                time: '4:00 PM - 5:00 PM',
                client: 'Emma Davis',
                type: 'Chat'
              }
            ].map((session, index) => (
              <div 
                key={index} 
                className="flex items-start mb-4 p-3 rounded-lg hover:bg-lilac-light transition-colors"
              >
                <div className="mr-4 bg-lilac p-2 rounded-full">
                  <Clock className="h-5 w-5 text-green" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{session.client}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-muted-foreground">{session.time}</span>
                    <span className="text-xs bg-green/10 text-green-dark px-2 py-1 rounded-full">
                      {session.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Performance Analytics Card */}
        <Card className="card-dashboard animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-xl font-display">Performance</CardTitle>
            <CardDescription>Your therapy practice metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Client Rating</span>
                <span className="font-medium">{stats.averageRating}/5.0</span>
              </div>
              <Progress value={stats.averageRating * 20} className="h-2" indicatorClassName="bg-green" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Client Retention</span>
                <span className="font-medium">{stats.retention}%</span>
              </div>
              <Progress value={stats.retention} className="h-2" indicatorClassName="bg-green" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Session Completion</span>
                <span className="font-medium">100%</span>
              </div>
              <Progress value={100} className="h-2" indicatorClassName="bg-green" />
            </div>
            
            <div className="pt-2">
              <button className="text-green text-sm flex items-center">
                <PieChart className="h-4 w-4 mr-1" />
                View detailed analytics
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Clients Card */}
      <Card className="card-dashboard animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-xl font-display">Recent Clients</CardTitle>
          <CardDescription>Your most recent client interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Sarah Johnson',
                lastSession: '2 days ago',
                nextSession: 'Tomorrow, 11:00 AM',
                progress: 75
              },
              {
                name: 'Michael Chen',
                lastSession: '4 days ago',
                nextSession: 'Friday, 3:00 PM',
                progress: 60
              },
              {
                name: 'Emily Wilson',
                lastSession: 'Yesterday',
                nextSession: 'Wednesday, 1:30 PM',
                progress: 90
              }
            ].map((client, index) => (
              <Card key={index} className="border border-lilac-light hover:border-green-light transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center mr-3">
                      <UserSquare className="h-5 w-5 text-green" />
                    </div>
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <p className="text-xs text-muted-foreground">Last session: {client.lastSession}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{client.progress}%</span>
                    </div>
                    <Progress value={client.progress} className="h-1.5" indicatorClassName="bg-green" />
                    <div className="pt-2">
                      <p className="text-xs">
                        <span className="font-medium">Next:</span> {client.nextSession}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
