import { useState, useEffect } from 'react'
import { BookOpen, Play, Clock } from 'lucide-react'

export function Courses() {
  const [courses, setCourses] = useState<{id: string; title: string; description: string; duration: string; level: string; progress: number}[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const mockCourses = [{ id: '1', title: 'Math\u00e9matiques - Alg\u00e8bre', description: 'Ma\u00eetrisez les fondamentaux de l\'alg\u00e8bre.', duration: '4h', level: 'D\u00e9butant', progress: 0 }, { id: '2', title: 'Fran\u00e7ais - Communication', description: 'Am\u00e9liorez vos comp\u00e9tences en expression.', duration: '3h', level: 'Interm\u00e9diaire', progress: 0 }, { id: '3', title: 'Sciences - Physique', description: 'Explorez les concepts fondamentaux.', duration: '5h', level: 'Interm\u00e9diaire', progress: 0 }, { id: '4', title: 'Histoire - Monde contemporain', description: 'Comprenez les enjeux du monde moderne.', duration: '2h', level: 'Avanc\u00e9', progress: 0 }]
    setTimeout(() => { setCourses(mockCourses); setLoading(false) }, 500)
  }, [])

  const categories = ['all', 'Math\u00e9matiques', 'Fran\u00e7ais', 'Sciences', 'Histoire']
  const filteredCourses = selectedCategory === 'all' ? courses : courses.filter(c => c.title.toLowerCase().includes(selectedCategory.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:hidden"><h1 className="text-lg font-bold text-gray-900">Cours</h1></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden lg:block mb-8"><h1 className="text-2xl font-bold text-gray-900">Biblioth\u00e8que de cours</h1><p className="text-gray-600 mt-1">Explorez notre catalogue</p></div>
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">{categories.map((cat) => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>{cat === 'all' ? 'Tous' : cat}</button>))}</div>
        {loading ? (<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>) : (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredCourses.map((course) => (<div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"><div className="bg-gradient-to-r from-primary-500 to-primary-600 h-32 flex items-center justify-center"><BookOpen className="h-12 w-12 text-white opacity-50" /></div><div className="p-4"><div className="flex items-center justify-between text-xs text-gray-500 mb-2"><span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{course.level}</span><div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{course.duration}</span></div></div><h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3><p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p><button className="w-full flex items-center justify-center space-x-2 btn-primary py-2"><Play className="h-4 w-4" /><span>{course.progress > 0 ? 'Continuer' : 'Commencer'}</span></button></div></div>))}</div>)}
        {filteredCourses.length === 0 && !loading && <div className="text-center py-12"><p className="text-gray-500">Aucun cours trouv\u00e9</p></div>}
      </div>
    </div>
  )
}