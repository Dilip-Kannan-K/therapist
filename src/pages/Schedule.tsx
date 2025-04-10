
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfWeek, addDays } from "date-fns";
import { Clock, UserCircle, Calendar as CalendarIcon } from "lucide-react";

// Mock data for scheduled sessions
const mockSessions = [
  {
    id: "1",
    clientName: "Jane Smith",
    date: new Date(2025, 3, 12), // April 12, 2025
    time: "10:00 AM - 11:00 AM",
    sessionType: "Video",
    status: "Upcoming"
  },
  {
    id: "2",
    clientName: "Michael Johnson",
    date: new Date(2025, 3, 14), // April 14, 2025
    time: "2:00 PM - 3:00 PM",
    sessionType: "Audio",
    status: "Upcoming"
  },
  {
    id: "3",
    clientName: "Emily Davis",
    date: new Date(2025, 3, 10), // April 10, 2025
    time: "4:00 PM - 5:00 PM",
    sessionType: "Chat",
    status: "Upcoming"
  },
  {
    id: "4",
    clientName: "Robert Wilson",
    date: new Date(2025, 3, 15), // April 15, 2025
    time: "11:00 AM - 12:00 PM",
    sessionType: "Video",
    status: "Upcoming"
  },
  {
    id: "5",
    clientName: "Sarah Adams",
    date: new Date(2025, 3, 16), // April 16, 2025
    time: "3:00 PM - 4:00 PM",
    sessionType: "Chat",
    status: "Upcoming"
  }
];

interface Session {
  id: string;
  clientName: string;
  date: Date;
  time: string;
  sessionType: string;
  status: string;
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  
  // Sessions for the selected date
  const sessionsForDate = selectedDate 
    ? mockSessions.filter(
        session => 
          session.date.getDate() === selectedDate.getDate() &&
          session.date.getMonth() === selectedDate.getMonth() &&
          session.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];
    
  // All sessions sorted by date
  const sortedSessions = [...mockSessions].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Calculate session days for the calendar
  const sessionDays = mockSessions.map(session => session.date);
  
  const renderCalendarView = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md p-3 pointer-events-auto"
              components={{
                DayContent: (props) => {
                  const isSessionDay = sessionDays.some(
                    sessionDate =>
                      sessionDate.getDate() === props.date.getDate() &&
                      sessionDate.getMonth() === props.date.getMonth() &&
                      sessionDate.getFullYear() === props.date.getFullYear()
                  );
                  
                  return (
                    <div className="relative">
                      <div>{props.date.getDate()}</div>
                      {isSessionDay && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green rounded-full" />
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No Date Selected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsForDate.length > 0 ? (
              <div className="space-y-4">
                {sessionsForDate.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UserCircle className="h-8 w-8 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{session.clientName}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{session.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green/10 text-green py-1 px-3 rounded-full text-xs font-medium">
                        {session.sessionType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No sessions scheduled for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  const renderListView = () => (
    <Card>
      <CardHeader>
        <CardTitle>All Scheduled Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Session Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.clientName}</TableCell>
                <TableCell>{format(session.date, "MMMM d, yyyy")}</TableCell>
                <TableCell>{session.time}</TableCell>
                <TableCell>{session.sessionType}</TableCell>
                <TableCell>
                  <div className="bg-green/10 text-green py-1 px-3 rounded-full text-xs font-medium inline-block">
                    {session.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        
        <Select value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="calendar">Calendar View</SelectItem>
            <SelectItem value="list">List View</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {view === "calendar" ? renderCalendarView() : renderListView()}
    </div>
  );
};

export default Schedule;
