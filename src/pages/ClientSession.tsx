import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageSquare, Video, FileText, UserCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatSession from "@/components/session/ChatSession";
import VideoSession from "@/components/session/VideoSession";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text';
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
  const [newNote, setNewNote] = useState("");
  
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
  
  const handleAddNote = () => {
    if (!newNote.trim() || !client) return;
    
    const newNoteObj = {
      id: `n${notes.length + 1}`,
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: newNote
    };
    
    setNotes(prev => [newNoteObj, ...prev]);
    setNewNote("");
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

      <div className="h-[calc(100vh-156px)] rounded-lg border flex overflow-hidden">
        <div className="w-1/4 min-w-[250px] bg-white flex flex-col h-full overflow-auto border-r">
          <div className="p-4 border-b">
            <Link to="/sessions">
              <Button 
                variant="outline" 
                className="mb-4 w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Clients
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border">
                <img 
                  src={client.profilePicture} 
                  alt={client.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{client.name}</h3>
                <p className="text-sm text-gray-500">Next session: {client.nextSession}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-grow overflow-auto flex flex-col">
            <Tabs defaultValue="notes" className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="info">Client Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notes" className="flex-grow overflow-auto flex flex-col p-0">
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
                    {notes.map(note => (
                      <div key={note.id} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">{note.date}</p>
                        <p>{note.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="info" className="flex-grow overflow-auto p-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Client Record</h3>
                      <div className="mt-2 bg-gray-50 p-3 rounded-md">
                        <h4 className="font-medium mb-2">Personal Information</h4>
                        <p className="mb-2"><span className="font-medium">Full Name:</span> {client.name}</p>
                        <p className="mb-2"><span className="font-medium">Date of Birth:</span> January 15, 1985</p>
                        <p className="mb-2"><span className="font-medium">Contact:</span> client@example.com | (555) 123-4567</p>
                        <p className="mb-2"><span className="font-medium">Address:</span> 123 Main Street, Anytown, ST 12345</p>
                        <p className="mb-4"><span className="font-medium">Emergency Contact:</span> Jane Doe (555) 987-6543</p>
                        
                        <h4 className="font-medium mb-2">Medical History</h4>
                        <p className="mb-2">Patient reports history of generalized anxiety disorder (GAD) diagnosed in 2018. Previously treated with SSRIs under Dr. Johnson from 2018-2020.</p>
                        <p className="mb-2">No known allergies to medications. Currently taking Lexapro 10mg daily (prescribed by PCP).</p>
                        <p className="mb-4">Family history significant for depression (mother) and alcohol use disorder (father).</p>
                        
                        <h4 className="font-medium mb-2">Assessment</h4>
                        <p className="mb-2">Initial intake completed on March 15, 2025. Patient presents with symptoms of anxiety and sleep disturbance following job change.</p>
                        <p className="mb-2">PHQ-9 Score: 12 (moderate depression)</p>
                        <p className="mb-2">GAD-7 Score: 15 (moderate anxiety)</p>
                        <p className="mb-4">Sleep quality reported as poor, with difficulty falling asleep and early morning awakening.</p>
                        
                        <h4 className="font-medium mb-2">Treatment Plan</h4>
                        <p className="mb-2">1. Weekly CBT sessions focusing on anxiety management techniques</p>
                        <p className="mb-2">2. Sleep hygiene education and implementation</p>
                        <p className="mb-2">3. Mindfulness training for stress reduction</p>
                        <p className="mb-4">4. Coordination with PCP regarding medication management</p>
                        
                        <h4 className="font-medium mb-2">Session History</h4>
                        <p className="mb-1">Session 1 (March 15, 2025): Initial assessment and treatment planning</p>
                        <p className="mb-1">Session 2 (March 22, 2025): Introduced CBT framework and began anxiety tracking</p>
                        <p className="mb-1">Session 3 (March 29, 2025): Reviewed anxiety triggers and developed initial coping strategies</p>
                        <p className="mb-1">Session 4 (April 5, 2025): Worked on catastrophic thinking patterns and sleep hygiene implementation</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                      <div className="mt-2 bg-gray-50 p-3 rounded-md">
                        <p className="mb-2">Client has shown moderate improvement in anxiety symptoms since beginning treatment. Sleep quality has improved from initial reporting, with sleep onset latency reduced from 60+ minutes to approximately 30 minutes.</p>
                        <p className="mb-2">Client reports successful implementation of deep breathing techniques during acute anxiety episodes at work. Still struggling with anticipatory anxiety regarding performance reviews.</p>
                        <p className="mb-2">PHQ-9 scores: 12 → 10 → 8 (trending toward improvement)</p>
                        <p className="mb-2">GAD-7 scores: 15 → 14 → 11 (trending toward improvement)</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-w-0 h-full bg-gray-50">
          {activeSession === "chat" ? (
            <ChatSession 
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full w-full flex flex-col flex-grow">
              <VideoSession
                mode="video"
                onChangeMode={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSession;
