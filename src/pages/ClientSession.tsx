import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageSquare, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ClientInfo from "@/components/session/ClientInfo";
import ChatSession from "@/components/session/ChatSession";
import VideoSession from "@/components/session/VideoSession";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'voice';
}

interface SessionNote {
  id: string;
  date: string;
  content: string;
}

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
      { id: "m1", sender: "therapist", content: "Hello Jane, how are you feeling today?", timestamp: "10:01 AM", type: "text" as const },
      { id: "m2", sender: "client", content: "Hi Dr. Thomas, I'm feeling a bit better than last week. The exercises you suggested helped with my anxiety.", timestamp: "10:02 AM", type: "text" as const },
      { id: "m3", sender: "therapist", content: "I'm glad to hear that. Let's talk more about which exercises worked best for you.", timestamp: "10:03 AM", type: "text" as const },
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
      { id: "m1", sender: "therapist", content: "Hello Michael, how has your week been?", timestamp: "2:00 PM", type: "text" as const },
      { id: "m2", sender: "client", content: "It's been challenging but I had two job interviews this week.", timestamp: "2:01 PM", type: "text" as const },
      { id: "m3", sender: "therapist", content: "That's excellent progress! How did you feel during the interviews?", timestamp: "2:02 PM", type: "text" as const },
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
      { id: "m1", sender: "therapist", content: "Hello Emily, how have things been with your partner since our last session?", timestamp: "4:00 PM", type: "text" as const },
      { id: "m2", sender: "client", content: "We had a good conversation using the techniques you suggested. I felt heard for the first time in a while.", timestamp: "4:02 PM", type: "text" as const },
      { id: "m3", sender: "therapist", content: "That's wonderful progress! Can you share more about what techniques worked best?", timestamp: "4:03 PM", type: "text" as const },
    ]
  }
];

const ClientSession = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [activeSession, setActiveSession] = useState<"chat" | "video">("chat");
  
  useEffect(() => {
    const foundClient = mockClients.find(c => c.id === clientId);
    
    if (foundClient) {
      setClient(foundClient);
      setMessages(foundClient.messages as Message[]); 
      setNotes(foundClient.notes);
    }
  }, [clientId]);
  
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      sender: "therapist",
      content: content,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: 'text'
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
      <div className="flex gap-4 mb-4">
        <Button
          variant={activeSession === "chat" ? "default" : "outline"}
          onClick={() => setActiveSession("chat")}
          className={activeSession === "chat" ? "bg-green hover:bg-green/90" : ""}
        >
          <MessageSquare className="h-4 w-4 mr-2" /> Chat Session
        </Button>
        <Button
          variant={activeSession === "video" ? "default" : "outline"}
          onClick={() => setActiveSession("video")}
          className={activeSession === "video" ? "bg-green hover:bg-green/90" : ""}
        >
          <Video className="h-4 w-4 mr-2" /> Video Session
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-[calc(100%-48px)] rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="bg-white">
          <ClientInfo 
            client={client}
            notes={notes}
            onAddNote={handleAddNote}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={75}>
          {activeSession === "chat" ? (
            <ChatSession 
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <VideoSession
              mode="video"
              onChangeMode={() => {}}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ClientSession;
