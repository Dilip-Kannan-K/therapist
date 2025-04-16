
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Mic, StopCircle } from "lucide-react";
import { useParams } from "react-router-dom";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'voice';
  voiceUrl?: string;
  duration?: number;
}

interface ChatSessionProps {
  messages: Message[];
  onSendMessage: (message: string, type: 'text' | 'voice', voiceUrl?: string, duration?: number) => void;
}

const ChatSession: React.FC<ChatSessionProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<number | null>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage, 'text');
    setNewMessage("");
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // Reset audio chunks
      setAudioChunks([]);
      
      // Set up event handlers
      recorder.ondataavailable = (e) => {
        setAudioChunks(currentChunks => [...currentChunks, e.data]);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Send voice message
        onSendMessage("", 'voice', audioUrl, recordingDuration);
        
        // Clear recording state
        setRecordingDuration(0);
        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
        }
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      recorder.start();
      setIsRecording(true);
      
      // Set up timer for recording duration
      const interval = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const VoiceMessage = ({ url, duration }: { url: string, duration?: number }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio(url));

    const togglePlayback = () => {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    };

    // Handle audio ended event
    React.useEffect(() => {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }, [audio]);

    return (
      <div className="flex items-center gap-2 p-2 rounded-md bg-opacity-30 bg-green">
        <Button 
          size="sm" 
          variant="ghost" 
          className="p-1 h-8 w-8 rounded-full"
          onClick={togglePlayback}
        >
          {isPlaying ? (
            <StopCircle className="h-4 w-4" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
        </Button>
        <div className="flex-1">
          <div className="h-2 bg-green-dark rounded-full w-full opacity-70" />
        </div>
        {duration && (
          <span className="text-xs text-gray-500">
            {formatTime(duration)}
          </span>
        )}
      </div>
    );
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
                {message.type === 'text' ? (
                  <p>{message.content}</p>
                ) : (
                  <VoiceMessage url={message.voiceUrl || ''} duration={message.duration} />
                )}
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
            disabled={isRecording}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-grow"
          />
          
          {!isRecording ? (
            <>
              <Button 
                onClick={handleStartRecording} 
                variant="outline" 
                size="icon"
                className="rounded-full"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSendMessage} 
                className="bg-green hover:bg-green/90 rounded-full"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 py-1 border rounded-full bg-red-50 border-red-200 text-red-500">
                <div className="animate-pulse h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-xs">{formatTime(recordingDuration)}</span>
              </div>
              <Button 
                onClick={handleStopRecording} 
                variant="destructive"
                size="icon"
                className="rounded-full"
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSession;
