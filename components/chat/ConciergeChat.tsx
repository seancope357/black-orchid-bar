'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'

export default function ConciergeChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })
  
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-all z-50 flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Black Orchid Concierge</h3>
                <p className="text-xs opacity-80">Your Digital Speakeasy Assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:opacity-70 text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">Welcome to Black Orchid.</p>
                <p className="text-xs mt-2">Ask me about:</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Cocktail recipes & suggestions</li>
                  <li>• Shopping list calculations</li>
                  <li>• TABC compliance & safety</li>
                  <li>• Finding bartenders</li>
                  <li>• Premium service packages</li>
                </ul>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.toolInvocations && (
                    <div className="mt-2 text-xs opacity-75">
                      {message.toolInvocations.map((tool: any) => (
                        <div key={tool.toolCallId} className="mt-1">
                          <span className="font-semibold">🔧 {tool.toolName}</span>
                          {tool.result && (
                            <pre className="mt-1 p-2 bg-background/50 rounded text-[10px] overflow-x-auto">
                              {JSON.stringify(tool.result, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask the concierge..."
                className="flex-1 px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 text-sm font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
