
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

const ChatSession: React.FC<ChatSessionProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-gray-50">
      <div className="bg-white p-4 border-b">
        <h2 className="text-lg font-medium">Chat Session</h2>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map(message => (
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
