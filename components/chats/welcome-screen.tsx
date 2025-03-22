"use client"

import { MessageCircle, Users, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onOpenSidebar: () => void
}

export default function WelcomeScreen({ onOpenSidebar }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="h-10 w-10 text-orange-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ChatApp</h1>
        <p className="text-gray-600 mb-8">Select a conversation to start messaging</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-50 p-4 rounded-lg">
            <MessageCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-800">Chat</h3>
            <p className="text-sm text-gray-600">Send messages to your contacts</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-800">Groups</h3>
            <p className="text-sm text-gray-600">Create groups with multiple contacts</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <Info className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-800">Status</h3>
            <p className="text-sm text-gray-600">Share updates with your contacts</p>
          </div>
        </div>

        <Button onClick={onOpenSidebar} className="bg-orange-500 hover:bg-orange-600 text-white md:hidden">
          Start a conversation
        </Button>
      </div>
    </div>
  )
}

