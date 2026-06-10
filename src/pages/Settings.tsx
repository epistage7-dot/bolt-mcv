import { useState, useEffect } from 'react'
import { User, ChevronDown, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const LEVELS_STRUCTURE = {
  ELEVE: { label: '\u00c9l\u00e8ve', subcategories: { PREMIER_CYCLE: { label: 'Premier cycle', options: ['6\u00e8me', '5\u00e8me', '4\u00e8me', '3\u00e8me'] }, SECOND_CYCLE: { label: 'Second cycle', options: ['Seconde', '1\u00e8re', 'Terminale'] } } },
  ETUDIANT: { label: '\u00c9tudiant', options: ['Licence', 'Master 1', 'Master 2', 'Doctorat'] }
} as const

type Category = keyof typeof LEVELS_STRUCTURE

export function Settings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profile, setProfile] = useState({ full_name: '', category: '', level: '', email: '' })
  const [subCategory, setSubCategory] = useState('')

  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      try {
        const { data, error } = await supabase.from('profiles').select('full_name, category, level, email').eq('id', user.id).single()
        if (error) throw error
        if (data) {
          setProfile({ full_name: data.full_name || '', category: data.category || '', level: data.level || '', email: data.email || user.email || '' })
          if (data.level && data.category === 'ELEVE') {
            const parts = data.level.split(' - ')
            if (parts.length >= 2) {
              const subCatLabel = parts[1]
              for (const [key, value] of Object.entries(LEVELS_STRUCTURE.ELEVE.subcategories)) { if (value.label === subCatLabel) { setSubCategory(key); break } }
            }
          }
        }
      } catch (err) { console.error('Error loading profile:', err) } finally { setLoading(false) }
    }
    loadProfile()
  }, [user])

  const getSubCategories = () => {
    if (!profile.category) return []
    const cat = LEVELS_STRUCTURE[profile.category as Category]
    if ('subcategories' in cat) return Object.entries(cat.subcategories).map(([key, value]) => ({ key, label: value.label }))
    return []
  }

  const getLevels = () => {
    if (!profile.category) return []
    const cat = LEVELS_STRUCTURE[profile.category as Category]
    if ('options' in cat) return cat.options
    if ('subcategories' in cat && subCategory) {
      const sub = cat.subcategories[subCategory as keyof typeof cat.subcategories]
      if (sub && 'options' in sub) return sub.options
    }
    return []
  }

  const handleCategoryChange = (cat: Category) => { setProfile(prev => ({ ...prev, category: cat, level: '' })); setSubCategory('') }
  const handleSubCategoryChange = (sub: string) => { setSubCategory(sub); setProfile(prev => ({ ...prev, level: '' })) }
  const formatLevelForDB = (): string => {
    if (!profile.category) return ''
    const cat = LEVELS_STRUCTURE[profile.category as Category]
    if ('options' in cat) return profile.level
    if ('subcategories' in cat && subCategory) { const subLabel = cat.subcategories[subCategory as keyof typeof cat.subcategories]?.label; return `${cat.label} - ${subLabel} - ${profile.level}` }
    return ''
  }

  const handleSave = async () => {
    setSaving(true); setMessage(null)
    try {
      if (!user) throw new Error('Utilisateur non connect\u00e9')
      const formattedLevel = formatLevelForDB()
      const { error } = await supabase.from('profiles').update({ full_name: profile.full_name, category: profile.category, level: formattedLevel, email: profile.email }).eq('id', user.id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Profil mis \u00e0 jour avec succ\u00e8s' })
    } catch { setMessage({ type: 'error', text: 'Erreur lors de la mise \u00e0 jour' }) }
    finally { setSaving(false) }
  }

  if (loading) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-8"><div className="bg-primary-100 p-3 rounded-xl"><User className="h-6 w-6 text-primary-600" /></div><div><h1 className="text-2xl font-bold text-gray-900">Param\u00e8tres du profil</h1><p className="text-gray-600">G\u00e9rez vos informations personnelles</p></div></div>
          {message && <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}
          <div className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label><input type="text" value={profile.full_name} onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label><input type="email" value={profile.email} onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cat\u00e9gorie</label><div className="relative"><select value={profile.category} onChange={(e) => handleCategoryChange(e.target.value as Category)} className="select-field pr-10"><option value="">S\u00e9lectionner une cat\u00e9gorie</option>{Object.entries(LEVELS_STRUCTURE).map(([key, value]) => (<option key={key} value={key}>{value.label}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /></div></div>
            {profile.category === 'ELEVE' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Sous-cat\u00e9gorie</label><div className="relative"><select value={subCategory} onChange={(e) => handleSubCategoryChange(e.target.value)} className="select-field pr-10"><option value="">S\u00e9lectionner un cycle</option>{getSubCategories().map((sub) => (<option key={sub.key} value={sub.key}>{sub.label}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /></div></div>)}
            {(profile.category === 'ETUDIANT' || (profile.category === 'ELEVE' && subCategory)) && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label><div className="relative"><select value={profile.level} onChange={(e) => setProfile(prev => ({ ...prev, level: e.target.value }))} className="select-field pr-10"><option value="">S\u00e9lectionner votre niveau</option>{getLevels().map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /></div></div>)}
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"><Save className="h-5 w-5" /><span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span></button>
          </div>
        </div>
      </div>
    </div>
  )
}