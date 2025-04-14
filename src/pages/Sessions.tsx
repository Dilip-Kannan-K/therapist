
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UserCircle, Calendar, Clock, RefreshCcw, X } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  const navigate = useNavigate();
  
  // States for the cancel/reschedule dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [cancellationNote, setCancellationNote] = useState("");
  const [isReschedule, setIsReschedule] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState("14:00");
  
  const handleConnectClient = (clientId: string) => {
    navigate(`/client-session/${clientId}`);
  };
  
  const openCancelDialog = (client: any) => {
    setSelectedClient(client);
    setCancelDialogOpen(true);
    setCancellationNote("");
    setIsReschedule(false);
    setRescheduleDate(undefined);
  };
  
  const handleCancellation = () => {
    if (isReschedule && !rescheduleDate) {
      toast.error("Please select a date for rescheduling");
      return;
    }
    
    if (cancellationNote.trim() === "") {
      toast.error("Please provide a reason for the cancellation");
      return;
    }
    
    if (!isReschedule) {
      // Open confirmation dialog before cancelling
      setConfirmCancelOpen(true);
    } else {
      // Process reschedule directly
      processCancellation();
    }
  };
  
  const processCancellation = () => {
    // In a real app, this would call an API to update the session
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient?.id) {
        return {
          ...client,
          nextSession: isReschedule 
            ? format(rescheduleDate!, "MMMM d, yyyy") + " at " + rescheduleTime 
            : "Cancelled"
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    setCancelDialogOpen(false);
    setConfirmCancelOpen(false);
    
    toast.success(
      isReschedule 
        ? `Session with ${selectedClient?.name} rescheduled to ${format(rescheduleDate!, "MMMM d, yyyy")} at ${rescheduleTime}`
        : `Session with ${selectedClient?.name} cancelled`
    );
  };
  
  const timeOptions = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];
  
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
            
            <CardFooter className="flex space-x-2">
              <Button 
                className="flex-1 bg-green hover:bg-green/90" 
                onClick={() => handleConnectClient(client.id)}
              >
                Connect
              </Button>
              <Button 
                variant="outline"
                className="flex-none text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => openCancelDialog(client)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Cancel/Reschedule Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isReschedule ? "Reschedule Session" : "Cancel Session"}
            </DialogTitle>
            <DialogDescription>
              {isReschedule
                ? `Reschedule your session with ${selectedClient?.name}`
                : `Cancel your upcoming session with ${selectedClient?.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Reason for {isReschedule ? "rescheduling" : "cancellation"}
              </label>
              <Textarea
                id="note"
                placeholder="Please provide a reason..."
                value={cancellationNote}
                onChange={(e) => setCancellationNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            {isReschedule && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !rescheduleDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {rescheduleDate ? format(rescheduleDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={rescheduleDate}
                        onSelect={setRescheduleDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">New Time</label>
                  <select
                    id="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full px-3 text-xs"
                onClick={() => setIsReschedule(!isReschedule)}
              >
                {isReschedule ? (
                  <><X className="h-3.5 w-3.5 mr-1" /> Cancel Instead</>
                ) : (
                  <><RefreshCcw className="h-3.5 w-3.5 mr-1" /> Reschedule Instead</>
                )}
              </Button>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant={isReschedule ? "default" : "destructive"}
              onClick={handleCancellation}
              className={isReschedule ? "bg-green hover:bg-green/90" : ""}
            >
              {isReschedule ? "Reschedule" : "Cancel Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog for Cancellation */}
      <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently cancel your session with {selectedClient?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, go back</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={processCancellation}
            >
              Yes, cancel session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sessions;
