# MCV - Plateforme d'Excellence Academique

Une plateforme d'accompagnement pedagogique de nouvelle generation.

## Fonctionnalites

- **Authentification** : Inscription et connexion avec Supabase
- **Gestion des niveaux** : Hierarchie precise pour Eleves et Etudiants
  - Eleve : Premier cycle (6eme-3eme) et Second cycle (Seconde-Terminale)
  - Etudiant : Licence, Master 1, Master 2, Doctorat
- **Dashboard** : Vue d'ensemble des statistiques
- **Chat IA** : Assistant pedagogique
- **Cours** : Bibliotheque de contenus educatifs
- **Parametres** : Gestion du profil

## Technologies

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + Database + Edge Functions)

## Installation

```bash
npm install
npm run dev
```

## Configuration

Creer un fichier `.env` avec :
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Licence

MIT