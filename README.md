# GAIA — site de l'association

Site statique en **Astro**, 100 % en français, avec des animations discrètes en JavaScript et CSS natifs (aucune bibliothèque d'animation).

## Lancer le site en local

```bash
npm install
npm run dev        # http://localhost:4321
```

Production : `npm run build` (le site est généré dans `dist/`), puis `npm run preview` pour le vérifier.

### GitHub Pages
Le site fonctionne avec un sous-dossier. Au moment du build, indiquez l'adresse et le nom du dépôt :

```bash
SITE=https://mon-compte.github.io BASE_PATH=/nom-du-depot npm run build
```

Tous les chemins d'images et de liens tiennent compte de `BASE_PATH`.

## Où modifier le contenu

| Quoi | Fichier |
|---|---|
| Textes généraux (accroche, objectifs, valeurs, contact…) | `src/data/site.js` |
| Actions de l'association | `src/data/actions.js` |
| Équipe (noms, rôles, descriptions) | `src/data/team.js` |
| Couleurs, typographie, animations CSS | `src/styles/global.css` |
| Interactions JavaScript | `src/scripts/main.js` |

> Les textes, noms et coordonnées actuels sont des **exemples** à remplacer.

## Remplacer les photos de l'équipe (sans toucher au code)

Les sept portraits sont dans `public/images/team/` :

`member-1.jpg` … `member-7.jpg`

Il suffit d'**écraser le fichier** correspondant par votre photo, en gardant le même nom. Format conseillé : portrait 4:5 (par ex. 600 × 750 px), JPG. L'image est recadrée automatiquement. Les noms et rôles se changent dans `src/data/team.js`.

**Organigramme** : 1 PDG (niveau 1) → 2 directeurs (niveau 2) → 4 responsables : recherche, événements, sensibilisation, partenariats (niveau 3). Le niveau d'un membre se règle avec `level` dans `team.js`.

Les autres images (`hero.jpg`, `about.jpg`, `action-1/2/3.jpg`, `siege.svg`) sont aussi des **images provisoires** dans `public/images/` : remplacez-les de la même façon.

## Les effets

- **Apparition au scroll** : les titres, textes, cartes et portraits apparaissent en douceur, une seule fois, avec un léger décalage entre les cartes d'un même groupe (Intersection Observer).
- **Hero** : entrée séquencée du titre, du texte et des boutons ; parallaxe très légère de l'image (ordinateur uniquement) ; lumière qui dérive lentement ; fougère dessinée en SVG qui se balance doucement.
- **Survols** : cartes d'objectifs qui se soulèvent, images d'actions et portraits qui zooment très légèrement, inclinaison douce des cartes d'équipe (souris uniquement), boutons avec états survol et appui, liens au soulignement animé, feuille du logo qui s'incline.
- **Navigation** : en-tête qui prend un fond et une ombre après le défilement ; indicateur de section active (`aria-current`) ; menu mobile qui se ferme après un clic, avec Échap ou en cliquant ailleurs ; décalage d'ancres adapté à l'en-tête fixe.
- **Accessibilité** : `prefers-reduced-motion` désactive toutes les animations ; le contenu reste visible sans JavaScript ; focus clavier visible ; lien d'évitement.
