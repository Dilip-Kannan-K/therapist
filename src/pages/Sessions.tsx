
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

// Mock data for clients
const mockClients = [
  {
    id: "1",
    name: "Jane Smith",
    lastSession: "April 5, 2025",
    nextSession: "April 12, 2025",
    profilePicture: "/placeholder.svg",
    notes: [
      { id: "n1", date: "April 5, 2025", content: "Discussed work-related anxiety triggers and coping mechanisms." },
      { id: "n2", date: "March 29, 2025", content: "Reviewed progress on mindfulness exercises. Client reports improvement in sleep quality." }
    ],
    messages: [
      { id: "m1", sender: "therapist", content: "Hello Jane, how are you feeling today?", timestamp: "10:01 AM" },
      { id: "m2", sender: "client", content: "Hi Dr. Thomas, I'm feeling a bit better than last week. The exercises you suggested helped with my anxiety.", timestamp: "10:02 AM" },
      { id: "m3", sender: "therapist", content: "I'm glad to hear that. Let's talk more about which exercises worked best for you.", timestamp: "10:03 AM" },
    ]
  },
  {
    id: "2",
    name: "Michael Johnson",
    lastSession: "April 7, 2025",
    nextSession: "April 14, 2025",
    profilePicture: "/placeholder.svg",
    notes: [
      { id: "n1", date: "April 7, 2025", content: "Discussed job search progress. Client is showing positive outlook despite challenges." },
      { id: "n2", date: "March 31, 2025", content: "Explored feelings around job loss. Identified negative thought patterns to address." }
    ],
    messages: [
      { id: "m1", sender: "therapist", content: "Hello Michael, how has your week been?", timestamp: "2:00 PM" },
      { id: "m2", sender: "client", content: "It's been challenging but I had two job interviews this week.", timestamp: "2:01 PM" },
      { id: "m3", sender: "therapist", content: "That's excellent progress! How did you feel during the interviews?", timestamp: "2:02 PM" },
    ]
  },
  {
    id: "3",
    name: "Emily Davis",
    lastSession: "April 3, 2025",
    nextSession: "April 10, 2025",
    profilePicture: "/placeholder.svg",
    notes: [
      { id: "n1", date: "April 3, 2025", content: "Discussed recent conflict with partner. Working on communication strategies." },
      { id: "n2", date: "March 27, 2025", content: "Explored childhood experiences that may contribute to trust issues." }
    ],
    messages: [
      { id: "m1", sender: "therapist", content: "Hello Emily, how have things been with your partner since our last session?", timestamp: "4:00 PM" },
      { id: "m2", sender: "client", content: "We had a good conversation using the techniques you suggested. I felt heard for the first time in a while.", timestamp: "4:02 PM" },
      { id: "m3", sender: "therapist", content: "That's wonderful progress! Can you share more about what techniques worked best?", timestamp: "4:03 PM" },
    ]
  }
];

const Sessions = () => {
  const [clients] = useState(mockClients);
  const navigate = useNavigate();
  
  const handleConnectClient = (clientId: string) => {
    navigate(`/client-session/${clientId}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Sessions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <Card key={client.id} className="cursor-pointer hover:border-green transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border">
                  <img 
                    src={client.profilePicture} 
                    alt={client.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Last Session</p>
                  <p>{client.lastSession}</p>
                </div>
                <div>
                  <p className="text-gray-500">Next Session</p>
                  <p>{client.nextSession}</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full bg-green hover:bg-green/90" 
                onClick={() => handleConnectClient(client.id)}
              >
                Connect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
