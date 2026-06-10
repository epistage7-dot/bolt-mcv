import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

export function Chat() {
  const [messages, setMessages] = useState([{ id: '1', role: 'assistant' as const, content: 'Bonjour ! Je suis votre assistant p\u00e9dagogique. Comment puis-je vous aider aujourd\'hui ?' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }, body: JSON.stringify({ message: userMessage.content }) })
      const data = await response.json()
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message || 'Je n\'ai pas pu traiter votre demande.' }])
    } catch { setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Une erreur est survenue.' }]) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:hidden"><h1 className="text-lg font-bold text-gray-900">Chat IA</h1></div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4"><div className="max-w-3xl mx-auto">
        {messages.map((msg) => (<div key={msg.id} className={`flex items-start space-x-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}><div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'}`}>{msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}</div><div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}><div className={`inline-block px-4 py-3 rounded-2xl ${msg.role === 'assistant' ? 'bg-white text-gray-800 shadow-sm rounded-tl-none' : 'bg-primary-600 text-white rounded-tr-none'}`}><p className="whitespace-pre-wrap">{msg.content}</p></div></div></div>))}
        {loading && (<div className="flex items-start space-x-3"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"><Bot className="h-5 w-5" /></div><div className="bg-white px-4 py-3 rounded-2xl shadow-sm rounded-tl-none"><div className="flex space-x-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div></div></div></div>)}
      </div></div>
      <div className="bg-white border-t border-gray-200 px-4 py-4"><div className="max-w-3xl mx-auto flex space-x-3"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} placeholder="Posez votre question..." className="flex-1 input-field" disabled={loading} /><button onClick={handleSend} disabled={loading || !input.trim()} className="btn-primary px-4 disabled:opacity-50"><Send className="h-5 w-5" /></button></div></div>
    </div>
  )
}