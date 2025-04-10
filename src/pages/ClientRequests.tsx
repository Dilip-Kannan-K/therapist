
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Check, Clock, X, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for client requests
const initialClientRequests = [
  {
    id: "1",
    name: "Jane Smith",
    age: 32,
    issueDescription: "Anxiety and work stress",
    preferredTherapyStyle: "Cognitive Behavioral Therapy",
    preferredSession: "Video",
    requestDate: "2025-04-08",
  },
  {
    id: "2",
    name: "Michael Johnson",
    age: 45,
    issueDescription: "Depression after recent job loss",
    preferredTherapyStyle: "Mindfulness-Based Therapy",
    preferredSession: "Chat",
    requestDate: "2025-04-09",
  },
  {
    id: "3",
    name: "Emily Davis",
    age: 28,
    issueDescription: "Relationship difficulties and trust issues",
    preferredTherapyStyle: "Psychodynamic Therapy",
    preferredSession: "Audio",
    requestDate: "2025-04-10",
  }
];

const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

const ClientRequests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [clientRequests, setClientRequests] = useState(initialClientRequests);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [processingClientId, setProcessingClientId] = useState<string | null>(null);
  const [schedulingMode, setSchedulingMode] = useState(false);

  const handleReject = (id: string) => {
    setClientRequests(clientRequests.filter(client => client.id !== id));
    toast({
      title: "Request Rejected",
      description: "The client request has been rejected and removed.",
    });
  };

  const handleAccept = (id: string) => {
    setProcessingClientId(id);
    setSchedulingMode(true);
  };

  const handleScheduleCancel = () => {
    setProcessingClientId(null);
    setSchedulingMode(false);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleScheduleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the session.",
        variant: "destructive",
      });
      return;
    }

    // Process the scheduling
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    toast({
      title: "Session Scheduled",
      description: `Session scheduled for ${formattedDate} at ${selectedTime}`,
    });
    
    setClientRequests(clientRequests.filter(client => client.id !== processingClientId));
    setProcessingClientId(null);
    setSchedulingMode(false);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    
    // In a real app, you'd save this to your backend
    // and redirect to the schedule page or back to the dashboard
    navigate('/schedule');
  };

  if (clientRequests.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Client Requests</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-medium mb-2">No Pending Requests</h2>
          <p className="text-gray-600">You have no pending client requests at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Client Requests</h1>
      
      <div className="grid gap-6">
        {clientRequests.map(client => (
          <Card key={client.id} className={client.id === processingClientId && schedulingMode ? "border-green" : ""}>
            <CardHeader>
              <CardTitle>{client.name}, {client.age}</CardTitle>
              <CardDescription>Request received on {client.requestDate}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Issue Description:</h3>
                <p className="text-gray-700">{client.issueDescription}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Preferred Therapy Style:</h3>
                  <p className="text-gray-700">{client.preferredTherapyStyle}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Preferred Session Type:</h3>
                  <p className="text-gray-700">{client.preferredSession}</p>
                </div>
              </div>
              
              {client.id === processingClientId && schedulingMode && (
                <div className="mt-6 border-t pt-4 space-y-4">
                  <h3 className="font-medium text-lg">Schedule Session</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Select Date:</h4>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Select Time:</h4>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              {client.id === processingClientId && schedulingMode ? (
                <>
                  <Button variant="outline" onClick={handleScheduleCancel}>Cancel</Button>
                  <Button onClick={handleScheduleConfirm} className="bg-green hover:bg-green/90">Confirm Schedule</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" onClick={() => handleReject(client.id)}>
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                  <Button onClick={() => handleAccept(client.id)} className="bg-green hover:bg-green/90">
                    <Check className="h-4 w-4 mr-1" /> Accept
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientRequests;
