
import React from "react";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, Phone } from "lucide-react";

interface VideoSessionProps {
  mode: "video" | "audio";
  onChangeMode: (mode: "video" | "audio") => void;
}

const VideoSession: React.FC<VideoSessionProps> = ({ mode, onChangeMode }) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 min-h-0 overflow-hidden">
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-medium">{mode === "video" ? "Video Session" : "Audio Session"}</h2>

        <div className="flex space-x-2">
          <Button
            variant={mode === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => onChangeMode("video")}
            className={mode === "video" ? "bg-green hover:bg-green/90" : ""}
          >
            <Video className="h-4 w-4 mr-1" /> Video
          </Button>

          <Button
            variant={mode === "audio" ? "default" : "outline"}
            size="sm"
            onClick={() => onChangeMode("audio")}
            className={mode === "audio" ? "bg-green hover:bg-green/90" : ""}
          >
            <Mic className="h-4 w-4 mr-1" /> Audio
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {mode === "video" && (
          <div className="flex-1 flex items-center justify-center p-8 relative min-h-0">
            <div className="text-center w-full">
              <div className="bg-gray-200 w-full max-w-3xl aspect-video rounded-lg mb-4 flex items-center justify-center mx-auto relative">
                {isVideoOff ? (
                  <VideoOff className="h-24 w-24 text-gray-400" />
                ) : (
                  <Video className="h-24 w-24 text-gray-400" />
                )}

                {/* Self view */}
                <div className="absolute bottom-4 right-4 w-32 aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isMuted ? 'bg-red-100 text-red-500 border-red-300' : ''}`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isVideoOff ? 'bg-red-100 text-red-500 border-red-300' : ''}`}
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {mode === "audio" && (
          <div className="flex-1 flex items-center justify-center p-8 min-h-0">
            <div className="text-center w-full">
              <div className="bg-gray-200 w-full max-w-md h-48 rounded-lg mb-4 flex items-center justify-center mx-auto">
                <Mic className="h-24 w-24 text-gray-400" />
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  className="rounded-full w-12 h-12 p-0"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>

                <Button
                  variant="destructive"
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Phone className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSession;

