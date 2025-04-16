
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, UserCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Note {
  id: string;
  date: string;
  content: string;
}

interface ClientInfoProps {
  client: {
    id: string;
    name: string;
    nextSession: string;
    profilePicture: string;
  };
  notes: Note[];
  onAddNote: (content: string) => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client, notes, onAddNote }) => {
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote("");
  };
  
  return (
    <div className="flex-grow overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b">
        <Button 
          variant="outline" 
          className="mb-4 w-full" 
          onClick={() => navigate("/sessions")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Clients
        </Button>
        
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
      
      <div className="flex-grow overflow-hidden flex flex-col h-[calc(100%-88px)]">
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
                {notes.map(note => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">{note.date}</p>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="info" className="flex-grow overflow-hidden p-0">
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
  );
};

export default ClientInfo;
