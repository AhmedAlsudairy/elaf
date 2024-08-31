'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BuildingIcon, SendIcon, UserIcon } from "lucide-react"

// Mock data for companies and messages
const companies = [
  { id: 1, name: "Acme Corp", logo: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Globex Inc", logo: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Soylent Corp", logo: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Initech", logo: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "Umbrella Corp", logo: "/placeholder.svg?height=40&width=40" },
]

const initialMessages = [
  { id: 1, companyId: 1, sender: "John Doe", content: "Hello, how can we help you today?", timestamp: "10:00 AM" },
  { id: 2, companyId: 1, sender: "You", content: "I have a question about your product.", timestamp: "10:05 AM" },
  { id: 3, companyId: 1, sender: "Jane Smith", content: "Sure, what would you like to know?", timestamp: "10:07 AM" },
]

export function CompanyChatApp() {
  const [selectedCompany, setSelectedCompany] = useState(companies[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        companyId: selectedCompany.id,
        sender: "You",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-[600px] max-w-4xl w-full rounded-lg overflow-hidden border">
      <div className="w-1/3 bg-muted/20 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Companies</h2>
        </div>
        <ScrollArea className="h-[calc(600px-64px)]">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className={`flex items-center w-full p-4 hover:bg-muted/50 ${selectedCompany.id === company.id ? 'bg-muted' : ''}`}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={company.logo} alt={company.name} />
                <AvatarFallback><BuildingIcon className="h-6 w-6" /></AvatarFallback>
              </Avatar>
              <span className="font-medium">{company.name}</span>
            </button>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{selectedCompany.name}</h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          {messages
            .filter(message => message.companyId === selectedCompany.id)
            .map((message) => (
              <div key={message.id} className={`flex mb-4 ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <div className="font-semibold mb-1">{message.sender}</div>
                  <div>{message.content}</div>
                  <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
                </div>
              </div>
            ))}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button type="submit">
            <SendIcon className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}