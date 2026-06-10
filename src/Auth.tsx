import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const LEVELS_STRUCTURE = {
  ELEVE: {
    label: '\u00c9l\u00e8ve',
    subcategories: {
      PREMIER_CYCLE: {
        label: 'Premier cycle',
        options: ['6\u00e8me', '5\u00e8me', '4\u00e8me', '3\u00e8me']
      },
      SECOND_CYCLE: {
        label: 'Second cycle',
        options: ['Seconde', '1\u00e8re', 'Terminale']
      }
    }
  },
  ETUDIANT: {
    label: '\u00c9tudiant',
    options: ['Licence', 'Master 1', 'Master 2', 'Doctorat']
  }
} as const

type Category = keyof typeof LEVELS_STRUCTURE

export function Auth() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [subCategory, setSubCategory] = useState('')
  const [level, setLevel] = useState('')

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat)
    setSubCategory('')
    setLevel('')
  }

  const handleSubCategoryChange = (sub: string) => {
    setSubCategory(sub)
    setLevel('')
  }

  const getSubCategories = () => {
    if (!category) return []
    const cat = LEVELS_STRUCTURE[category]
    if ('subcategories' in cat) {
      return Object.entries(cat.subcategories).map(([key, value]) => ({ key, label: value.label }))
    }
    return []
  }

  const getLevels = () => {
    if (!category) return []
    const cat = LEVELS_STRUCTURE[category]
    if ('options' in cat) return cat.options
    if ('subcategories' in cat && subCategory) {
      const sub = cat.subcategories[subCategory as keyof typeof cat.subcategories]
      if (sub && 'options' in sub) return sub.options
    }
    return []
  }

  const formatLevelForDB = (): string => {
    if (!category) return ''
    const cat = LEVELS_STRUCTURE[category]
    if ('options' in cat) return level
    if ('subcategories' in cat && subCategory) {
      const subLabel = cat.subcategories[subCategory as keyof typeof cat.subcategories]?.label
      return `${cat.label} - ${subLabel} - ${level}`
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        navigate('/dashboard')
      } else {
        if (!fullName.trim()) throw new Error('Veuillez entrer votre nom complet')
        if (!category) throw new Error('Veuillez s\u00e9lectionner une cat\u00e9gorie')
        const cat = LEVELS_STRUCTURE[category]
        if ('subcategories' in cat && !subCategory) throw new Error('Veuillez s\u00e9lectionner une sous-cat\u00e9gorie')
        if (!level) throw new Error('Veuillez s\u00e9lectionner votre niveau')

        const formattedLevel = formatLevelForDB()
        const { data, error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, category, level: formattedLevel } }
        })
        if (signUpError) throw signUpError
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id, full_name: fullName, category, level: formattedLevel, email
          })
        }
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <GraduationCap className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">MCV</span>
          </button>
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-900">{isLogin ? 'Connexion' : 'Cr\u00e9er un compte'}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Pas encore de compte ?' : 'D\u00e9j\u00e0 un compte ?'}{' '}
          <button onClick={() => { setIsLogin(!isLogin); setError(null) }} className="font-medium text-primary-600 hover:text-primary-500">
            {isLogin ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            {!isLogin && (
              <>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label><input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Votre nom complet" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Cat\u00e9gorie</label><div className="relative"><select value={category} onChange={(e) => handleCategoryChange(e.target.value as Category)} className="select-field pr-10" required><option value="">S\u00e9lectionner une cat\u00e9gorie</option>{Object.entries(LEVELS_STRUCTURE).map(([key, value]) => (<option key={key} value={key}>{value.label}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /></div></div>
                {category === 'ELEVE' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Sous-cat\u00e9gorie</label><div className="relative"><select value={subCategory} onChange={(e) => handleSubCategoryChange(e.target.value)} className="select-field pr-10" required><option value="">S\u00e9lectionner un cycle</option>{getSubCategories().map((sub) => (<option key={sub.key} value={sub.key}>{sub.label}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /></div></div>)}
                {(category === 'ETUDIANT' || (category === 'ELEVE' && subCategory)) && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label><div className="relative"><select value={level} onChange={(e) => setLevel(e.target.value)} className="select-field pr-10" required><option value="">S\u00e9lectionner votre niveau</option>{getLevels().map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /></div></div>)}
              </>
            )}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="votre@email.com" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label><div className="relative"><input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10" placeholder="Au moins 6 caract\u00e8res" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Cr\u00e9er le compte'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}