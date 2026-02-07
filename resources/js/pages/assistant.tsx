import axios from "axios";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import MobileNav from "../components/MobileNav";

interface Message {
  id: number;
  message: string;
  sender: "user" | "ai";
  created_at?: string;
}

interface PageProps {
    initialMessages: Message[];
    sessionId: number | null;
}

export default function HealthAssistant({ initialMessages, sessionId: initialSessionId }: PageProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(initialSessionId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now(),
      message: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    const currentInput = inputText;
    setInputText(""); // clear input early

    try {
      const response = await axios.post(route('assistant.chat'), {
          message: currentInput,
          session_id: sessionId
      });

      const data = response.data;
      
      // Update session ID if it was new
      if (data.session_id !== sessionId) {
          setSessionId(data.session_id);
      }

      const aiMsg: Message = {
        id: data.message_id,
        message: data.response,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          message: "Maaf, terjadi kesalahan jaringan. Silakan coba lagi.",
          sender: "ai"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-20"> 
      {/* Added pb-20 for MobileNav space */}
      
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-slate-800">MomSync Assistant</h1>
            <p className="text-xs text-slate-500">AI Medical Assistant (Powered by Gemini)</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Halo Bunda! Saya siap membantu menjawab pertanyaan seputar kesehatan Anda.</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className={msg.sender === "user" ? "bg-pink-100 text-pink-600" : "bg-teal-100 text-teal-600"}>
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </AvatarFallback>
              </Avatar>
              
              <Card className={`p-3 text-sm leading-relaxed ${
                msg.sender === "user" 
                  ? "bg-pink-500 text-white rounded-tr-none" 
                  : "bg-white text-slate-700 rounded-tl-none border-slate-200"
              }`}>
                {msg.message}
              </Card>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="animate-pulse">Sedang mengetik...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t sticky bottom-15"> 
          {/* bottom-[60px] to sit above nav */}
        <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis keluhan..."
            className="flex-1 rounded-full px-4 focus-visible:ring-teal-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-teal-600 hover:bg-teal-700 w-10 h-10 shrink-0"
            disabled={isLoading || !inputText.trim()}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </form>
      </div>

      <MobileNav />
    </div>
  );
}
