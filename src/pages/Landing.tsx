import { useNavigate } from 'react-router-dom'
import { BookOpen, GraduationCap, Brain, Users } from 'lucide-react'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">MCV</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/auth')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Excellence Acad\u00e9mique
            <span className="text-primary-600"> Augment\u00e9e</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Une plateforme d'accompagnement p\u00e9dagogique de nouvelle g\u00e9n\u00e9ration,
            con\u00e7ue pour accompagner votre r\u00e9ussite acad\u00e9mique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="btn-primary text-lg px-8 py-4"
            >
              D\u00e9marrer maintenant
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-lg px-8 py-4"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Une technologie d'excellence \u00e0 votre service
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profitez d'une intelligence artificielle de pointe con\u00e7ue pour
              optimiser votre apprentissage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-4">
                <Brain className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Intelligence Avanc\u00e9e
              </h3>
              <p className="text-gray-600">
                Technologie de pointe pour un accompagnement personnalis\u00e9 et adaptatif.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 mb-4">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cursos Adapt\u00e9s
              </h3>
              <p className="text-gray-600">
                Contenus \u00e9labor\u00e9s selon votre niveau et vos objectifs acad\u00e9miques.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mb-4">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Suivi de Progression
              </h3>
              <p className="text-gray-600">
                \u00c9valuez et suivez votre \u00e9volution en temps r\u00e9el.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mb-4">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Accompagnement
              </h3>
              <p className="text-gray-600">
                Un soutien continu pour atteindre vos objectifs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pr\u00eat \u00e0 exceller ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez notre communaut\u00e9 d'apprenants ambitieux.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors"
          >
            Cr\u00e9er un compte gratuit
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">MCV</span>
          </div>
          <p className="text-sm">
            \u00a9 2024 MCV. Tous droits r\u00e9serv\u00e9s.
          </p>
        </div>
      </footer>
    </div>
  )
}