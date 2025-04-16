
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, Video, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Import our new components
import ClientInfo from "@/components/session/ClientInfo";
import ChatSession from "@/components/session/ChatSession";
import VideoSession from "@/components/session/VideoSession";

// Mock data for clients - same as in Sessions.tsx
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
      { id: "m1", sender: "therapist", content: "Hello Jane, how are you feeling today?", timestamp: "10:01 AM", type: "text" },
      { id: "m2", sender: "client", content: "Hi Dr. Thomas, I'm feeling a bit better than last week. The exercises you suggested helped with my anxiety.", timestamp: "10:02 AM", type: "text" },
      { id: "m3", sender: "therapist", content: "I'm glad to hear that. Let's talk more about which exercises worked best for you.", timestamp: "10:03 AM", type: "text" },
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
      { id: "m1", sender: "therapist", content: "Hello Michael, how has your week been?", timestamp: "2:00 PM", type: "text" },
      { id: "m2", sender: "client", content: "It's been challenging but I had two job interviews this week.", timestamp: "2:01 PM", type: "text" },
      { id: "m3", sender: "therapist", content: "That's excellent progress! How did you feel during the interviews?", timestamp: "2:02 PM", type: "text" },
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
      { id: "m1", sender: "therapist", content: "Hello Emily, how have things been with your partner since our last session?", timestamp: "4:00 PM", type: "text" },
      { id: "m2", sender: "client", content: "We had a good conversation using the techniques you suggested. I felt heard for the first time in a while.", timestamp: "4:02 PM", type: "text" },
      { id: "m3", sender: "therapist", content: "That's wonderful progress! Can you share more about what techniques worked best?", timestamp: "4:03 PM", type: "text" },
    ]
  }
];

// Type definitions
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'voice';
  voiceUrl?: string;
  duration?: number;
}

interface SessionNote {
  id: string;
  date: string;
  content: string;
}

const ClientSession = () => {
  const { clientId } = useParams();
  
  const [client, setClient] = useState<any | null>(null);
  const [sessionMode, setSessionMode] = useState<"chat" | "video" | "audio">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<SessionNote[]>([]);
  
  useEffect(() => {
    // Find client by ID
    const foundClient = mockClients.find(c => c.id === clientId);
    
    if (foundClient) {
      setClient(foundClient);
      setMessages(foundClient.messages);
      setNotes(foundClient.notes);
    }
  }, [clientId]);
  
  const handleSendMessage = (content: string, type: 'text' | 'voice', voiceUrl?: string, duration?: number) => {
    if ((type === 'text' && !content.trim()) || (type === 'voice' && !voiceUrl)) return;
    
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      sender: "therapist",
      content: content,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: type,
      voiceUrl: voiceUrl,
      duration: duration
    };
    
    setMessages(prev => [...prev, newMsg]);
  };
  
  const handleAddNote = (content: string) => {
    if (!content.trim() || !client) return;
    
    const newNote = {
      id: `n${notes.length + 1}`,
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: content
    };
    
    setNotes(prev => [newNote, ...prev]);
  };
  
  if (!client) {
    return <div className="container mx-auto py-8 px-4 text-center">Client not found.</div>;
  }
  
  return (
    <div className="container mx-auto py-4 h-[calc(100vh-64px)]">
      <Tabs defaultValue="session" className="w-full h-full">
        <TabsList className="mb-4">
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="video">Video/Audio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="session" className="h-[calc(100%-40px)]">
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
            {/* Left sidebar - Client info and notes */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="bg-white">
              <ClientInfo 
                client={client}
                notes={notes}
                onAddNote={handleAddNote}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Main content - Chat session */}
            <ResizablePanel defaultSize={75}>
              <ChatSession 
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        
        <TabsContent value="video" className="h-[calc(100%-40px)]">
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
            {/* Left sidebar - Client info and notes */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="bg-white">
              <ClientInfo 
                client={client}
                notes={notes}
                onAddNote={handleAddNote}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Main content - Video/Audio session */}
            <ResizablePanel defaultSize={75}>
              <VideoSession
                mode={sessionMode === "chat" ? "video" : sessionMode}
                onChangeMode={(mode) => setSessionMode(mode)}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientSession;
