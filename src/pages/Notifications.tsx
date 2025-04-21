
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageSquare, BellIcon } from "lucide-react";

const tempNotifications = [
  {
    id: 1,
    title: "Session Reminder",
    description: "You have a session with Jane Smith today at 3:00 PM.",
    type: "reminder",
    date: "April 21, 2025",
  },
  {
    id: 2,
    title: "New Message",
    description: "Michael Johnson sent you a new message.",
    type: "message",
    date: "April 20, 2025",
  },
];

const Notifications = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="font-bold text-2xl mb-6 flex items-center gap-2">
        <BellIcon className="h-6 w-6 text-green" />
        Notifications
      </h2>
      <ScrollArea className="max-w-lg mx-auto bg-white rounded-lg shadow p-4">
        {tempNotifications.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No new notifications.</div>
        ) : (
          <div className="space-y-4">
            {tempNotifications.map((notif) => (
              <Card key={notif.id} className="p-4 border-l-4 border-green flex flex-col">
                <span className="font-semibold">{notif.title}</span>
                <span className="text-gray-500 text-sm mb-2">{notif.date}</span>
                <span>{notif.description}</span>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Notifications;
