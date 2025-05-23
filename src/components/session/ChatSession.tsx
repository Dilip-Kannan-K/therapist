import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'voice';
}

interface ChatSessionProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

// Helper to extract date from existing timestamp or message metadata
function getMessageDate(message: Message): string {
  // If future timestamps change to include a date, adjust here
  // For now, we'll just assign all to "Today", but this can handle full date logic
  if (message.timestamp.includes(",")) {
    // Example: "April 5, 2025, 10:00 AM"
    return message.timestamp.split(",")[0];
  }
  // Or if a property exists
  return (message as any).fullDate || "Today";
}

const formatDateSeparator = (date: string) => {
  if (date === "Today") return "Today";
  return date;
};

const ChatSession: React.FC<ChatSessionProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  // Track the last displayed date to avoid duplicates
  let lastDisplayedDate: string | null = null;

  return (
    <div className="flex-grow flex flex-col h-full bg-gray-50 min-h-0">
      <div className="bg-white p-4 border-b">
        <h2 className="text-lg font-medium">Chat Session</h2>
      </div>

      <ScrollArea className="flex-grow p-4 space-y-2">
        <div className="space-y-4">
          {messages.map((message, idx) => {
            const messageDate = (message as any).fullDate || (message as any).date || "Today";
            let showDate = false;
            
            // Only show date if it's different from the last displayed date
            if (messageDate !== lastDisplayedDate) {
              showDate = true;
              lastDisplayedDate = messageDate;
            }
            
            return (
              <React.Fragment key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-2">
                    <span className="bg-gray-200 text-gray-500 text-xs py-1 px-4 rounded-full">
                      {formatDateSeparator(messageDate)}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${message.sender === "therapist" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[70%] p-3 rounded-lg
                      ${message.sender === "therapist"
                        ? "bg-green text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"}
                    `}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "therapist" ? "text-green-50" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
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
            className="flex-grow"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-green hover:bg-green/90 rounded-full"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSession;
