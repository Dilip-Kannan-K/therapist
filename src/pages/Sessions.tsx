
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Video, Mic, Send, FileText, UserCircle } from "lucide-react";

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
  const [clients, setClients] = useState(mockClients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [sessionMode, setSessionMode] = useState<"chat" | "video" | "audio">("chat");
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  
  const selectedClient = selectedClientId 
    ? clients.find(client => client.id === selectedClientId) 
    : null;
  
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setSessionMode("chat"); // Default to chat mode when selecting a client
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedClientId) return;
    
    const updatedClients = clients.map(client => {
      if (client.id === selectedClientId) {
        return {
          ...client,
          messages: [
            ...client.messages,
            {
              id: `m${client.messages.length + 1}`,
              sender: "therapist",
              content: newMessage,
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }
          ]
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    setNewMessage("");
  };
  
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedClientId) return;
    
    const updatedClients = clients.map(client => {
      if (client.id === selectedClientId) {
        return {
          ...client,
          notes: [
            {
              id: `n${client.notes.length + 1}`,
              date: new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              content: newNote
            },
            ...client.notes
          ]
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    setNewNote("");
  };
  
  // Render client selection view if no client is selected
  if (!selectedClientId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Sessions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <Card key={client.id} className="cursor-pointer hover:border-green transition-colors" onClick={() => handleSelectClient(client.id)}>
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
                <Button className="w-full bg-green hover:bg-green/90" onClick={() => handleSelectClient(client.id)}>
                  Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Render session interface for selected client
  return (
    <div className="container mx-auto py-4 h-[calc(100vh-64px)]">
      <div className="flex h-full">
        {/* Left sidebar - Client info and notes */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <Button 
              variant="outline" 
              className="mb-4 w-full" 
              onClick={() => setSelectedClientId(null)}
            >
              Back to Clients
            </Button>
            
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border">
                <img 
                  src={selectedClient.profilePicture} 
                  alt={selectedClient.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedClient.name}</h3>
                <p className="text-sm text-gray-500">Next session: {selectedClient.nextSession}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-grow overflow-hidden flex flex-col">
            <Tabs defaultValue="notes" className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="info">Client Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notes" className="flex-grow overflow-hidden flex flex-col p-0">
                <div className="p-4 border-b">
                  <Textarea 
                    placeholder="Add a new session note..." 
                    className="resize-none"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button 
                    className="w-full mt-2 bg-green hover:bg-green/90"
                    onClick={handleAddNote}
                  >
                    <FileText className="h-4 w-4 mr-2" /> Save Note
                  </Button>
                </div>
                
                <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                    {selectedClient.notes.map(note => (
                      <div key={note.id} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">{note.date}</p>
                        <p>{note.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="info" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Client Record</h3>
                    <p className="mt-1">This would contain complete client information, medical history, assessment records, etc. in a real application.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                    <p className="mt-1">Therapy progress indicators and charts would be displayed here.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Main content - Session interface */}
        <div className="flex-grow flex flex-col bg-gray-50">
          <div className="bg-white p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">Session with {selectedClient.name}</h2>
            
            <div className="flex space-x-2">
              <Button 
                variant={sessionMode === "chat" ? "default" : "outline"}
                size="sm"
                onClick={() => setSessionMode("chat")}
                className={sessionMode === "chat" ? "bg-green hover:bg-green/90" : ""}
              >
                <MessageSquare className="h-4 w-4 mr-1" /> Chat
              </Button>
              
              <Button 
                variant={sessionMode === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setSessionMode("video")}
                className={sessionMode === "video" ? "bg-green hover:bg-green/90" : ""}
              >
                <Video className="h-4 w-4 mr-1" /> Video
              </Button>
              
              <Button 
                variant={sessionMode === "audio" ? "default" : "outline"}
                size="sm"
                onClick={() => setSessionMode("audio")}
                className={sessionMode === "audio" ? "bg-green hover:bg-green/90" : ""}
              >
                <Mic className="h-4 w-4 mr-1" /> Audio
              </Button>
            </div>
          </div>
          
          {sessionMode === "chat" && (
            <div className="flex-grow flex flex-col">
              <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                  {selectedClient.messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === "therapist" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`
                        max-w-[70%] p-3 rounded-lg
                        ${message.sender === "therapist" 
                          ? "bg-green text-white rounded-br-none" 
                          : "bg-white border rounded-bl-none"}
                      `}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === "therapist" ? "text-green-50" : "text-gray-500"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 bg-white border-t">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} className="bg-green hover:bg-green/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {sessionMode === "video" && (
            <div className="flex-grow flex items-center justify-center p-8">
              <div className="text-center">
                <div className="bg-gray-200 w-full max-w-3xl aspect-video rounded-lg mb-4 flex items-center justify-center">
                  <Video className="h-24 w-24 text-gray-400" />
                  <p className="ml-4 text-gray-500 text-xl">Video session would appear here</p>
                </div>
                <p className="text-gray-500">This is a placeholder for the video session interface.</p>
              </div>
            </div>
          )}
          
          {sessionMode === "audio" && (
            <div className="flex-grow flex items-center justify-center p-8">
              <div className="text-center">
                <div className="bg-gray-200 w-full max-w-md h-48 rounded-lg mb-4 flex items-center justify-center">
                  <Mic className="h-24 w-24 text-gray-400" />
                </div>
                <p className="text-gray-500">This is a placeholder for the audio session interface.</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <Button variant="outline" className="rounded-full w-12 h-12 p-0">
                    <Mic className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
