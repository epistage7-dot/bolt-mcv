import { useState, useEffect } from 'react'
import { BookOpen, MessageSquare, Brain, TrendingUp, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<{full_name: string; category: string; level: string} | null>(null)
  const [stats] = useState({ coursesCompleted: 0, quizzesTaken: 0, studyHours: 0, currentStreak: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      try {
        const { data, error } = await supabase.from('profiles').select('full_name, category, level').eq('id', user.id).single()
        if (error) throw error
        setProfile(data)
      } catch (err) { console.error('Error loading profile:', err) }
      finally { setLoading(false) }
    }
    loadProfile()
  }, [user])

  const quickActions = [
    { icon: BookOpen, label: 'Parcourir les cours', color: 'bg-blue-500' },
    { icon: MessageSquare, label: 'Chat IA', color: 'bg-green-500' },
    { icon: Brain, label: 'Quiz', color: 'bg-amber-500' },
    { icon: TrendingUp, label: 'Progression', color: 'bg-rose-500' }
  ]

  if (loading) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {profile?.full_name || '\u00c9tudiant'} !</h1>
          <p className="text-gray-600 mt-1">{profile?.level ? `Niveau : ${profile.level}` : 'Continuez votre apprentissage'}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between"><BookOpen className="h-8 w-8 text-blue-500" /><span className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</span></div><p className="text-gray-600 mt-2">Cours termin\u00e9s</p></div>
          <div className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between"><Brain className="h-8 w-8 text-amber-500" /><span className="text-2xl font-bold text-gray-900">{stats.quizzesTaken}</span></div><p className="text-gray-600 mt-2">Quiz compl\u00e9t\u00e9s</p></div>
          <div className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between"><Clock className="h-8 w-8 text-green-500" /><span className="text-2xl font-bold text-gray-900">{stats.studyHours}h</span></div><p className="text-gray-600 mt-2">Heures d'\u00e9tude</p></div>
          <div className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between"><TrendingUp className="h-8 w-8 text-rose-500" /><span className="text-2xl font-bold text-gray-900">{stats.currentStreak}</span></div><p className="text-gray-600 mt-2">Jours cons\u00e9cutifs</p></div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (<button key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"><div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}><action.icon className="h-6 w-6 text-white" /></div><span className="font-medium text-gray-900">{action.label}</span></button>))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-semibold text-gray-900 mb-4">Activit\u00e9 r\u00e9cente</h2><div className="space-y-4"><p className="text-gray-500 text-center py-8">Commencez \u00e0 explorer pour voir votre activit\u00e9 ici</p></div></div>
      </div>
    </div>
  )
}