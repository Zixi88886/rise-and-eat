// French words for the home page and the Settings window. The same idea as js/chinese.js: a text is
// found by its exact English words, and a text with no French yet is simply shown in English.
// The words use "tu" (friendly, like a note to a friend) and a non-breaking space ( ) before
// ? ! : ; and inside « », which is how French is written.

import { MAX_MINUTES } from './breakfasts.js';
import { haveEntries, typedItems } from './ingredients.js';

const NBSP = ' ';

// Words for the labels written in index.html (each has a data-fr name) and the home page.
export const frenchUi = {
  hero: 'Les matins sont difficiles. Le petit-déjeuner peut être tout simple.',
  kind: `Quel genre${NBSP}? (facultatif)`,
  favorites: 'Favoris',
  myKitchen: 'Ma cuisine',
  kitchenEmpty: `Qu’as-tu chez toi${NBSP}?`,
  kitchenItems: (count) => `${count} ${count > 1 ? 'aliments' : 'aliment'} · touche pour modifier`,
  onlyWhatIHave: 'Seulement ce que j’ai',
  hideCantMake: 'Masquer ce que je ne peux pas faire',
  decide: 'Choisis pour moi',
  addBreakfast: 'Ajouter un petit-déjeuner',
  show: 'Voir les petits-déjeuners',
  setUpTonight: 'Préparer ce soir',
  doTonight: 'À faire ce soir.',
  saveTime: 'Gagne du temps demain.',
  chooseTasks: 'Choisir les tâches',
  changeOrder: 'Changer l’ordre',
  done: 'Terminé',
  tags: {
    'no-stove': 'Sans cuisinière',
    vegetarian: 'Végétarien',
    'high-protein': 'Riche en protéines',
    sweet: 'Sucré',
    savory: 'Salé',
  },
};

// "2 tâches faites sur 5 · 3 restantes". French needs the plural for 2 or more (not for 0 or 1),
// and "faite" and "restante" agree with "tâche" (feminine).
export function frenchProgress(done, total) {
  if (total === 0) return { done: 'Aucune tâche choisie', left: `touche «${NBSP}Choisir les tâches${NBSP}»` };
  if (done >= total) {
    return { done: total === 1 ? 'La tâche est faite' : `Les ${total} tâches sont faites`, left: 'prêt pour demain' };
  }
  const plural = (n) => (n > 1 ? 's' : '');
  const left = total - done;
  return { done: `${done} tâche${plural(done)} faite${plural(done)} sur ${total}`, left: `${left} restante${plural(left)}` };
}

// The suggested "Set up tonight" lines, by line id (the key word is between ** **, like the English).
export const frenchTasks = {
  'lib-bowl': { text: 'Sors un **bol** ou un bocal' },
  'lib-fruit': { text: 'Lave et coupe les **fruits**' },
  'lib-coffee': { text: 'Programme le **café** ou la bouilloire' },
  'lib-alarm': { text: 'Mets ton **réveil** à l’autre bout de la pièce' },
  'lib-supplies': { text: 'Vérifie qu’il y a du **lait, des œufs et du pain**' },
  'lib-dishes': { text: 'Fais la vaisselle pour avoir des **bols propres**' },
  'lib-oats-jar': { text: 'Mets des **flocons d’avoine ou du granola** dans un bocal' },
  'lib-overnight-oats': { text: 'Prépare des **overnight oats** dans un bocal', detail: 'Flocons d’avoine, lait, yaourt ou chia. Mets au frigo.' },
  'lib-chia': { text: 'Prépare un **pudding de chia** dans un bocal', detail: 'Mets-le au frigo.' },
  'lib-boil-eggs': { text: 'Fais cuire quelques **œufs durs**', detail: 'Garde-les au frigo.' },
  'lib-egg-muffins': { text: 'Mets les **muffins aux œufs** au frigo', detail: 'Ils décongèlent pendant la nuit.' },
  'lib-pan': { text: 'Sors une **poêle** et une spatule' },
  'lib-toaster': { text: 'Sors le **grille-pain** et le pain' },
  'lib-spreads': { text: 'Sors tes **pâtes à tartiner**', detail: 'Beurre de cacahuète, confiture ou fromage frais.' },
  'lib-bagels': { text: 'Sors les **bagels ou les tortillas** du congélateur' },
  'lib-smoothie-pack': { text: 'Congèle un **sachet pour smoothie**', detail: 'Fruits congelés et épinards dans un sac.' },
  'lib-blender': { text: 'Sors le **mixeur** et un verre' },
  'lib-smoothie-milk': { text: 'Mets le **lait ou le yaourt** à portée de main' },
  'lib-fruit-bag': { text: 'Emporte une **banane ou une pomme**' },
  'lib-water': { text: 'Remplis ta **gourde**' },
  'lib-grab-bar': { text: 'Emporte une **barre ou un œuf dur**' },
};

// French for the fixed English words on the home page and in the Settings window, found by the exact English.
export const frenchText = {
  'No tasks. Tap Choose tasks.': `Aucune tâche. Touche «${NBSP}Choisir les tâches${NBSP}».`,
  'Tap ▲ ▼ to move a line.': 'Touche ▲ ▼ pour déplacer une ligne.',
  'Then tap Done.': `Puis touche «${NBSP}Terminé${NBSP}».`,
  Settings: 'Paramètres',
  'Cooking basics': 'Bases de cuisine',
  'If you did not tick one:': `Si tu n’en as pas coché${NBSP}:`,
  'Salt, oil, sugar and more.': 'Sel, huile, sucre, etc.',
  Optional: 'Facultatif',
  'Still show it.': 'On l’affiche quand même.',
  Required: 'Obligatoire',
  'Hide it.': 'On le masque.',
  Done: 'Terminé',
  'English only': 'Anglais seulement',
  'Chinese only': 'Chinois seulement',
  'French only': 'Français seulement',
  'English and Chinese': 'Anglais et chinois',
  'English and French': 'Anglais et français',
  // My kitchen, and the "My own foods" box (also used in the Add a breakfast form)
  Back: 'Retour',
  'What\u2019s in your kitchen?': `Qu’y a-t-il dans ta cuisine${NBSP}?`,
  'Tap what you have.': 'Touche ce que tu as.',
  'Water is counted.': 'L’eau est déjà comptée.',
  'Clear all': 'Tout effacer',
  'Tap what you have': 'Touche ce que tu as',
  'Show what I can make': 'Voir ce que je peux faire',
  'Eggs and dairy': 'Œufs et produits laitiers',
  'Fruit and vegetables': 'Fruits et légumes',
  'Bread and grains': 'Pain et céréales',
  'Spreads and extras': 'Pâtes à tartiner et compléments',
  'Meat and beans': 'Viande et haricots',
  'Salt, oil, sugar and more. No worries if you miss some.': 'Sel, huile, sucre, etc. Pas grave s’il en manque.',
  'My own foods': 'Mes propres aliments',
  'Type a food, then tap Add.': `Écris un aliment, puis touche «${NBSP}Ajouter${NBSP}».`,
  'e.g. Kimchi': `ex.${NBSP}: kimchi`,
  'My own basics': 'Mes propres bases',
  'Day or night': 'Jour ou nuit',
  Day: 'Jour',
  Night: 'Nuit',
  Automatic: 'Automatique',
  'Light page.': 'Page claire.',
  'Dark page.': 'Page sombre.',
  'Dark phone, or 7 pm to 6 am.': `Téléphone sombre, ou de 19${NBSP}h à 6${NBSP}h.`,
  Trash: 'Corbeille',
  'Things stay here 30 days.': 'Les éléments restent ici 30 jours.',
  'Then they are deleted for good.': 'Ensuite, ils sont supprimés pour de bon.',
  'The trash is empty.': 'La corbeille est vide.',
  Restore: 'Restaurer',
  'Empty trash': 'Vider la corbeille',
  'Empty the trash?': `Vider la corbeille${NBSP}?`,
  'Bring back the built-in ones': 'Récupérer ceux de l’application',
  Undo: 'Annuler',
  Restored: 'Restauré',
  'Not deleted. No room left.': 'Non supprimé. Plus de place.',
  Food: 'Aliment',
  'Cooking basic': 'Base de cuisine',
  Breakfast: 'Petit-déjeuner',
  'Type a basic, then tap Add.': `Écris une base, puis touche «${NBSP}Ajouter${NBSP}».`,
  'e.g. Chili flakes': `ex.${NBSP}: piment`,
  Add: 'Ajouter',
  Remove: 'Supprimer',
  Cancel: 'Annuler',
  'You cannot undo this.': 'Tu ne pourras pas revenir en arrière.',
  'Write a food first.': 'Écris d’abord un aliment.',
  'Already in the list.': 'Déjà dans la liste.',
  'Too long.': 'Trop long.',
  Added: 'Ajouté',
  Removed: 'Supprimé',
  // Choose tasks (the Set up tonight page)
  'Choose tasks': 'Choisir les tâches',
  'Any breakfast': 'Pour tous les petits-déjeuners',
  'Oats and jars': 'Flocons d’avoine et bocaux',
  Eggs: 'Œufs',
  'Toast and bread': 'Toasts et pain',
  Smoothies: 'Smoothies',
  'Grab and go': 'À emporter',
  'Tap a line to add it.': 'Touche une ligne pour l’ajouter.',
  'My own': 'Les miennes',
  'Pick from ideas': 'Choisir parmi des idées',
  'Tap a line to turn it on or off.': 'Touche une ligne pour l’activer ou la désactiver.',
  'Remove deletes it.': `«${NBSP}Supprimer${NBSP}» l’efface pour de bon.`,
  'Write your own lines here.': 'Écris tes propres lignes ici.',
  'e.g. Thaw chicken': `ex.${NBSP}: décongeler`,
  'Write something first.': 'Écris d’abord quelque chose.',
  'Already on your list.': 'Déjà dans ta liste.',
  Saved: 'Enregistré',
  'Choose a picture': 'Choisis une image',
  'Or type an emoji': 'Ou tape un emoji',
  'Use it': 'Utiliser',
  'Not an emoji. Try again.': 'Ce n’est pas un emoji. Réessaie.',
  // Add a breakfast
  'Add your own breakfast': 'Ajouter mon petit-déjeuner',
  'It is saved on this device.': 'Il est enregistré sur cet appareil.',
  Name: 'Nom',
  Minutes: 'Minutes',
  Steps: 'Étapes',
  'e.g. Leftover pasta omelet': `ex.${NBSP}: omelette au fromage`,
  'e.g. 10': `ex.${NBSP}: 10`,
  'One step per line': 'Une étape par ligne',
  'Tags (optional)': 'Étiquettes (facultatif)',
  'Food it uses (optional)': 'Aliments utilisés (facultatif)',
  'Tick what it uses.': 'Coche ce qu’il utilise.',
  'Then it shows with \u201cOnly what I have\u201d.': `Il apparaîtra alors avec «${NBSP}Seulement ce que j’ai${NBSP}».`,
  'Save for later': 'Enregistrer pour plus tard',
  'Save and eat now': 'Enregistrer et manger',
  'Not saved. It will be lost if you reload.': 'Non enregistré. Tu le perdras si tu recharges la page.',
  'Add a name.': 'Ajoute un nom.',
  [`Enter minutes, 1 to ${MAX_MINUTES}.`]: `Indique les minutes, de 1 à ${MAX_MINUTES}.`,
  'Add a step. One per line.': 'Ajoute une étape. Une par ligne.',
  // The list of breakfasts
  'Change choices': 'Modifier mes choix',
  'All matching breakfasts': 'Tous les petits-déjeuners possibles',
  'Up to\nminutes': 'Jusqu’à\nminutes',
  Any: 'Illimité',
  Change: 'Modifier',
  Previous: 'Précédent',
  Next: 'Suivant',
  'Show all breakfasts': 'Voir tous les petits-déjeuners',
  Yours: 'Le mien',
  'Your kitchen:': `Ta cuisine${NBSP}:`,
  'nothing yet': 'rien pour l’instant',
  'No favorites yet.': 'Pas encore de favoris.',
  'No match.': 'Aucun petit-déjeuner trouvé.',
  'Tap \u2665 on a breakfast to save it here.': 'Touche \u2665 sur un petit-déjeuner pour le garder ici.',
  'You can\u2019t make anything yet. Add more food in My kitchen.': `Tu ne peux rien faire pour l’instant. Ajoute des aliments dans «${NBSP}Ma cuisine${NBSP}».`,
  'Try more minutes or fewer filters.': 'Essaie plus de minutes ou moins de filtres.',
  'Change My kitchen': 'Modifier ma cuisine',
  '+ Add your own breakfast': '+ Ajouter mon petit-déjeuner',
  'You can\u2019t make any yet.': 'Tu ne peux encore en faire aucun.',
  'Open \u201cAlmost there\u201d to see more.': `Ouvre «${NBSP}Presque prêts${NBSP}» pour en voir plus.`,
  'Missing:': `Il manque${NBSP}:`,
  // A breakfast's page
  Ingredients: 'Ingrédients',
  'Salt, oil and more': 'Sel, huile, etc.',
  '(missing)': ' (manque)',
  Pause: 'Pause',
  Resume: 'Reprendre',
  Reset: 'Recommencer',
  'Time is up. Eat!': `Temps écoulé. À table${NBSP}!`,
  'Delete this breakfast': 'Supprimer ce petit-déjeuner',
  Delete: 'Supprimer',
  'Photo or video': 'Photo ou vidéo',
  Video: 'Vidéo',
  Edit: 'Modifier',
  // The step and photo windows ("Photo" is the same word in French, so it needs no French of its own)
  'Photo: ': `Photo${NBSP}: `,
  'Not playing?': `Ça ne marche pas${NBSP}?`,
  'Open the link in your browser.': 'Ouvre le lien dans ton navigateur.',
  'Open link': 'Ouvrir le lien',
  Close: 'Fermer',
  'Change photo': 'Changer la photo',
  'Add photo': 'Ajouter une photo',
  'Paste a video link.': 'Colle un lien vidéo.',
  'YouTube, Vimeo or a video file.': 'YouTube, Vimeo ou un fichier vidéo.',
  Save: 'Enregistrer',
  'Use a YouTube, Vimeo or video link.': 'Utilise un lien YouTube, Vimeo ou vidéo.',
  'No room left. Remove a photo.': 'Plus de place. Supprime une photo.',
  'Not a photo.': 'Ce n’est pas une photo.',
  'Could not read it.': 'Impossible de la lire.',
  Picture: 'Image',
  'Highlighted words': 'Mots surlignés',
  'Tap words to highlight.': 'Touche les mots à surligner.',
  'The words are in English.': 'Les mots sont en anglais.',
};

// "Étape 3": the title of the window for one step.
export function frenchStepNumber(number) {
  return `Étape ${number}`;
}

// "5 minutes" (French writes 0 and 1 in the singular).
export function frenchMinutesLong(minutes) {
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

// "Ce qu’il te faut (4) · 2 manquants".
export function frenchNeedsSummary(total, missing) {
  return `Ce qu’il te faut (${total})${missing > 0 ? ` \u00b7 ${missing} manquant${missing > 1 ? 's' : ''}` : ''}`;
}

export function frenchStartTimer(minutes) {
  return `Lancer le minuteur de ${frenchMinutesLong(minutes)}`;
}

// The short waiting time on a step: "20 sec" is "20 s" in French; "2–3 min" is the same.
export function frenchStepTime(time) {
  return time.replace(/ sec$/, ' s');
}

// French names of the built-in breakfasts, by id (the same ids as chineseNames).
export const frenchNames = {
  'yogurt-bowl': 'Yaourt, fruits et une poignée de granola',
  'banana-nut-butter': 'Banane et beurre de noix',
  smoothie: 'Smoothie à emporter',
  'toast-egg': 'Toast à l’œuf au plat',
  'overnight-oats': 'Overnight oats (préparés la veille)',
  'egg-muffins': 'Muffins aux œufs réchauffés (préparés à l’avance)',
  'pb-toast': 'Toast au beurre de cacahuète et à la banane',
  'proper-eggs': 'Œufs brouillés et toast, sans se presser',
  cereal: 'Céréales et lait',
  'chia-pudding': 'Pudding de chia (préparé la veille)',
  'cottage-cheese': 'Fromage cottage, fruits rouges et miel',
  'bagel-cream-cheese': 'Bagel au fromage frais',
  'avocado-toast': 'Toast à l’avocat',
  'breakfast-wrap': 'Wrap du matin aux œufs brouillés',
  'pb-banana-oats': 'Porridge au micro-ondes, beurre de cacahuète et banane',
  'leftovers-bowl': 'Bol de riz et œuf (avec des restes)',
  'greek-yogurt-honey': 'Yaourt grec, miel et noix',
  'apple-pb': 'Pomme en tranches et beurre de cacahuète',
  'boiled-eggs': 'Œufs durs (cuits à l’avance)',
  'cheese-crackers': 'Fromage et crackers',
  'toast-jam': 'Toast beurre et confiture',
  'pb-jelly': 'Sandwich beurre de cacahuète et confiture',
  'instant-oatmeal': 'Flocons d’avoine instantanés aux fruits rouges',
  'protein-shake': 'Shake lait, banane et protéines',
  'frozen-waffles': 'Gaufres surgelées aux fruits',
  'mug-omelet': 'Omelette au micro-ondes dans une tasse',
  'hummus-toast': 'Toast houmous et légumes',
  'turkey-cheese': 'Sandwich dinde et fromage',
  'tomato-cheese-toast': 'Toast tomate et fromage',
  'cheese-quesadilla': 'Quesadilla au fromage',
  'bacon-egg-sandwich': 'Sandwich bacon et œuf',
  'veggie-omelet': 'Omelette aux légumes',
  'bean-burrito': 'Burrito du matin, haricots et fromage',
  'hash-brown-egg': 'Galettes de pommes de terre et œuf',
  'french-toast': 'Pain perdu',
  pancakes: 'Pancakes avec une préparation',
};

// French for each step of the built-in breakfasts, found by the step's exact English words (like the Chinese).
// `main` is the big line and `extra` the small one: there is an `extra` exactly when the English has a small part.
// "tu" and the imperative, like the "Set up tonight" lines. The word between ** ** is the one the English
// highlights (the key word), as in the "Set up tonight" lines.
export const frenchSteps = {
  'Spoon yogurt into a bowl.': { main: 'Mets du **yaourt** dans un bol.', extra: '' },
  'Top with whatever fruit is closest to going bad.': {
    main: 'Ajoute des **fruits** par-dessus.',
    extra: 'Prends ceux qui vont bientôt s’abîmer.',
  },
  'Add a handful of granola or oats.': { main: 'Ajoute une poignée de **granola** ou de flocons d’avoine.', extra: '' },
  'Eat standing up if you have to.': { main: '**Mange** debout.', extra: 'si tu n’as pas le choix.' },
  'Peel banana.': { main: 'Épluche la **banane**.', extra: '' },
  'Spread nut butter along one side with a knife, straight from the jar.': {
    main: 'Étale du **beurre de noix** sur un côté.',
    extra: 'avec un couteau, directement du pot.',
  },
  'Eat it like a very inefficient sandwich.': { main: 'Mange-la comme un **sandwich** très peu pratique.', extra: '' },
  'Throw everything into the blender. Frozen fruit, a splash of milk and a spoon of yogurt.': {
    main: 'Mets tout dans le **mixeur**.',
    extra: 'Fruits congelés, un peu de lait et une cuillère de yaourt.',
  },
  'Blend for 20 seconds.': { main: 'Mixe pendant **20 secondes**.', extra: '' },
  'Pour into the cup you’ll actually carry out the door.': {
    main: 'Verse dans le **gobelet**.',
    extra: 'que tu vas vraiment emporter.',
  },
  'Rinse the blender jar now before it dries on.': {
    main: 'Rince le bol du **mixeur** tout de suite.',
    extra: 'avant que ça sèche.',
  },
  'Drop bread in the toaster.': { main: 'Mets du **pain** dans le grille-pain.', extra: '' },
  'Crack an egg into a hot pan lightly oiled.': {
    main: 'Casse un **œuf** dans une poêle chaude.',
    extra: 'légèrement huilée.',
  },
  'Cook 2–3 minutes until the white sets; flip if you like it firm.': {
    main: 'Fais cuire **2–3 minutes**.',
    extra: 'jusqu’à ce que le blanc prenne\u00a0; retourne-le si tu l’aimes bien cuit.',
  },
  'Slide the egg onto the toast salt it, done.': {
    main: 'Fais glisser l’**œuf** sur le toast.',
    extra: 'sale, et c’est prêt.',
  },
  'Take the jar out of the fridge.': { main: 'Sors le **bocal** du frigo.', extra: '' },
  'Stir once.': { main: '**Mélange** une fois.', extra: '' },
  'Eat straight from the jar, or pour into a bowl if you’re feeling fancy.': {
    main: 'Mange directement dans le **bocal**.',
    extra: 'ou verse dans un bol si tu veux faire chic.',
  },
  'Take 2 egg muffins from the fridge.': { main: 'Sors 2 **muffins aux œufs** du frigo.', extra: '' },
  'Microwave 45–60 seconds.': { main: 'Fais chauffer au micro-ondes **45–60 secondes**.', extra: '' },
  'Eat with your hands, in the car if needed.': { main: '**Mange** avec les mains, dans la voiture.', extra: 'si besoin.' },
  'Toast the bread.': { main: 'Fais griller le **pain**.', extra: '' },
  'Spread peanut butter while it’s still hot, so it melts a little.': {
    main: 'Étale du **beurre de cacahuète**.',
    extra: 'pendant qu’il est encore chaud, pour qu’il fonde un peu.',
  },
  'Slice half a banana on top.': { main: 'Coupe une demi-**banane** en rondelles dessus.', extra: '' },
  'Fold in half and eat like a taco if you’re walking out the door.': {
    main: '**Plie** en deux.',
    extra: 'et mange comme un taco si tu es sur le départ.',
  },
  'Whisk two eggs with a splash of milk and a pinch of salt.': {
    main: 'Bats deux **œufs**.',
    extra: 'avec un peu de lait et une pincée de sel.',
  },
  'Melt butter in a pan over low heat.': { main: 'Fais fondre du **beurre** dans une poêle.', extra: 'à feu doux.' },
  'Pour in eggs, stir slowly and often until just set.': {
    main: 'Verse les **œufs** et remue souvent, doucement.',
    extra: 'jusqu’à ce qu’ils soient juste pris.',
  },
  'Drop the bread in the toaster while the eggs finish.': {
    main: 'Mets le **pain** dans le grille-pain.',
    extra: 'pendant que les œufs finissent de cuire.',
  },
  'Plate both together sit down for this one.': {
    main: '**Mets** les deux dans l’assiette.',
    extra: 'assieds-toi pour celui-là.',
  },
  'Pour cereal into a bowl.': { main: 'Verse les **céréales** dans un bol.', extra: '' },
  'Add milk.': { main: 'Ajoute du **lait**.', extra: '' },
  'Done. This one barely needs instructions.': {
    main: '**C’est fini**.',
    extra: 'Celui-là n’a presque pas besoin d’explications.',
  },
  'Give it a stir — it thickens overnight.': { main: '**Remue** un coup.', extra: 'ça épaissit pendant la nuit.' },
  'Eat straight from the jar or add fruit on top.': {
    main: 'Mange directement dans le **bocal**.',
    extra: 'ou ajoute des fruits par-dessus.',
  },
  'Spoon cottage cheese into a bowl.': { main: 'Mets du **fromage cottage** dans un bol.', extra: '' },
  'Top with a handful of berries.': { main: 'Ajoute une poignée de **fruits rouges**.', extra: '' },
  'Drizzle honey over the top.': { main: 'Verse un filet de **miel** dessus.', extra: '' },
  'Slice the bagel in half.': { main: 'Coupe le **bagel** en deux.', extra: '' },
  'Toast it while you get dressed.': { main: 'Fais-le **griller**.', extra: 'pendant que tu t’habilles.' },
  'Spread cream cheese on both halves.': { main: 'Étale du **fromage frais** sur les deux moitiés.', extra: '' },
  'Mash the avocado in a bowl. Halve it, scoop it out, mash roughly with a fork.': {
    main: 'Écrase l’**avocat** dans un bol.',
    extra: 'Coupe-le en deux, sors la chair, écrase-la grossièrement à la fourchette.',
  },
  'Spread mashed avocado on the toast.': { main: 'Étale l’**avocat** écrasé sur le toast.', extra: '' },
  'Salt, pepper, and a squeeze of lemon if you have one.': {
    main: '**Sel**, poivre et un trait de citron.',
    extra: 'si tu en as un.',
  },
  'Whisk two eggs with a pinch of salt and scramble in a hot pan.': {
    main: 'Bats deux **œufs**.',
    extra: 'avec une pincée de sel, puis fais-les brouiller dans une poêle chaude.',
  },
  'Warm a tortilla in the same pan for 20 seconds a side.': {
    main: 'Réchauffe une **tortilla** dans la même poêle.',
    extra: '20 secondes de chaque côté.',
  },
  'Pile it all into the tortilla. The eggs, a handful of cheese and any leftover veg.': {
    main: 'Mets tout dans la **tortilla**.',
    extra: 'Les œufs, une poignée de fromage et les restes de légumes.',
  },
  'Roll it up tight and wrap it in a paper towel to eat on the way out.': {
    main: '**Roule**-la bien serré.',
    extra: 'et enveloppe-la dans du papier absorbant pour la manger en partant.',
  },
  'Combine oats and milk or water in a microwave-safe bowl.': {
    main: 'Mélange les **flocons d’avoine** et du lait ou de l’eau.',
    extra: 'dans un bol qui va au micro-ondes.',
  },
  'Microwave 90 seconds, stir, then another 60 seconds.': {
    main: 'Chauffe 90 secondes au micro-ondes, **remue**.',
    extra: 'puis encore 60 secondes.',
  },
  'Stir in a spoon of peanut butter while it’s hot.': {
    main: 'Ajoute une cuillère de beurre de cacahuète en **remuant**.',
    extra: 'pendant que c’est chaud.',
  },
  'Slice banana on top.': { main: 'Coupe une **banane** en rondelles dessus.', extra: '' },
  'Microwave leftover rice for a minute to loosen it up.': {
    main: 'Réchauffe le reste de **riz** une minute au micro-ondes.',
    extra: 'pour le détacher.',
  },
  'Fry an egg in a hot pan while the rice heats.': {
    main: 'Fais cuire un **œuf** au plat dans une poêle chaude.',
    extra: 'pendant que le riz chauffe.',
  },
  'Slide the egg on top of the rice.': { main: 'Fais glisser l’**œuf**.', extra: 'sur le riz.' },
  'Splash on soy sauce or hot sauce and eat straight from the bowl.': {
    main: 'Ajoute de la **sauce soja** ou de la sauce piquante.',
    extra: 'et mange directement dans le bol.',
  },
  'Spoon Greek yogurt into a bowl.': { main: 'Mets du **yaourt grec** dans un bol.', extra: '' },
  'Add a handful of nuts and eat.': { main: 'Ajoute une poignée de **noix** et mange.', extra: '' },
  'Slice an apple into wedges.': { main: 'Coupe une **pomme** en quartiers.', extra: '' },
  'Put a spoonful of peanut butter on the side for dipping.': {
    main: 'Mets une cuillère de **beurre de cacahuète**.',
    extra: 'sur le côté, pour tremper.',
  },
  'Take two boiled eggs from the fridge.': { main: 'Sors deux **œufs durs** du frigo.', extra: '' },
  'Peel them under a little running water.': { main: 'Écale-les sous un filet d’**eau**.', extra: '' },
  'Add salt and pepper.': { main: 'Ajoute du **sel** et du poivre.', extra: '' },
  'Slice or break off some cheese.': { main: 'Coupe ou casse un peu de **fromage**.', extra: '' },
  'Stack it on crackers.': { main: 'Empile-le sur des **crackers**.', extra: '' },
  'Add a piece of fruit if you have one.': { main: 'Ajoute un **fruit**.', extra: 'si tu en as un.' },
  'Spread butter while it is hot.': { main: 'Étale du **beurre**.', extra: 'pendant que c’est chaud.' },
  'Add jam on top.': { main: 'Ajoute de la **confiture** dessus.', extra: '' },
  'Spread peanut butter on one slice of bread.': {
    main: 'Étale du **beurre de cacahuète**.',
    extra: 'sur une tranche de pain.',
  },
  'Spread jelly on the other slice.': { main: 'Étale de la **confiture** sur l’autre tranche.', extra: '' },
  'Press together and cut in half if you like.': { main: '**Referme** et coupe en deux.', extra: 'si tu veux.' },
  'Pour the oatmeal packet into a bowl and add hot water or milk.': {
    main: 'Verse le **sachet de flocons** dans un bol.',
    extra: 'et ajoute de l’eau chaude ou du lait.',
  },
  'Microwave or wait a minute, then stir.': {
    main: 'Passe au micro-ondes ou attends **une minute**.',
    extra: 'puis remue.',
  },
  'Top with berries.': { main: 'Ajoute des **fruits rouges**.', extra: '' },
  'Add it all to a blender or shaker. Milk, a banana and a scoop of protein powder.': {
    main: 'Mets tout dans un **mixeur**.',
    extra: 'ou un shaker. Du lait, une banane et une mesure de protéines en poudre.',
  },
  'Blend or shake well.': { main: '**Mixe** ou secoue bien.', extra: '' },
  'Drink it on the way out.': { main: '**Bois**-le en partant.', extra: '' },
  'Toast two frozen waffles until crisp.': {
    main: 'Fais griller deux **gaufres** surgelées.',
    extra: 'jusqu’à ce qu’elles soient croustillantes.',
  },
  'Top with sliced fruit.': { main: 'Ajoute des **fruits** en tranches.', extra: '' },
  'Add syrup or yogurt if you like.': { main: 'Ajoute du **sirop** ou du yaourt.', extra: 'si tu veux.' },
  'Crack two eggs into a mug and add a splash of milk and a pinch of salt.': {
    main: 'Casse deux **œufs** dans une tasse.',
    extra: 'et ajoute un peu de lait et une pincée de sel.',
  },
  'Stir in cheese or leftover veg.': { main: 'Ajoute du fromage ou des restes de légumes en **remuant**.', extra: '' },
  'Microwave 60 seconds, stir, then 30 more seconds until set.': {
    main: 'Chauffe 60 secondes au micro-ondes, **remue**.',
    extra: 'puis encore 30 secondes, jusqu’à ce que ce soit pris.',
  },
  'Spread hummus on top.': { main: 'Étale du **houmous** dessus.', extra: '' },
  'Add sliced cucumber or tomato and a pinch of salt.': {
    main: 'Ajoute du **concombre** ou de la tomate en tranches.',
    extra: 'et une pincée de sel.',
  },
  'Layer turkey and cheese on a slice of bread.': {
    main: 'Superpose la **dinde** et le fromage.',
    extra: 'sur une tranche de pain.',
  },
  'Add mustard or lettuce if you have it.': { main: 'Ajoute de la **moutarde** ou de la salade.', extra: 'si tu en as.' },
  'Top with a second slice and eat.': { main: '**Couvre** avec une deuxième tranche et mange.', extra: '' },
  'Lay slices of cheese on the warm toast.': { main: 'Dépose des tranches de **fromage**.', extra: 'sur le toast chaud.' },
  'Add sliced tomato, salt and pepper.': { main: 'Ajoute de la **tomate** en tranches, du sel et du poivre.', extra: '' },
  'Heat a dry pan over medium heat.': { main: 'Chauffe une **poêle** sèche à feu moyen.', extra: '' },
  'Put a tortilla in the pan and cover half with cheese.': {
    main: 'Mets une **tortilla** dans la poêle.',
    extra: 'et couvre la moitié de fromage.',
  },
  'Fold it over and cook 2 minutes a side until golden.': {
    main: '**Replie**-la.',
    extra: 'et fais cuire 2 minutes de chaque côté, jusqu’à ce qu’elle soit dorée.',
  },
  'Cut into wedges.': { main: 'Coupe en **parts**.', extra: '' },
  'Cook two strips of bacon in a pan until crisp, then set aside.': {
    main: 'Fais cuire deux tranches de **bacon**.',
    extra: 'à la poêle jusqu’à ce qu’elles soient croustillantes, puis mets-les de côté.',
  },
  'Fry an egg in the same pan.': { main: 'Fais cuire un **œuf** au plat dans la même poêle.', extra: '' },
  'Toast bread or a bun.': { main: 'Fais griller du **pain** ou un petit pain.', extra: '' },
  'Stack the bacon and egg between the bread.': {
    main: 'Empile le **bacon** et l’œuf.',
    extra: 'entre les tranches de pain.',
  },
  'Whisk two eggs with salt and pepper.': { main: 'Bats deux **œufs** avec du sel et du poivre.', extra: '' },
  'Soften chopped veg in a buttered pan for a minute.': {
    main: 'Fais ramollir des **légumes** coupés dans une poêle beurrée.',
    extra: 'pendant une minute.',
  },
  'Pour in the eggs and let them set for 2 minutes.': {
    main: 'Verse les **œufs**.',
    extra: 'et laisse-les prendre 2 minutes.',
  },
  'Fold in half and slide onto a plate.': { main: '**Plie** en deux.', extra: 'et fais glisser dans une assiette.' },
  'Warm canned or leftover beans in a pan or the microwave.': {
    main: 'Réchauffe des **haricots** en boîte ou des restes.',
    extra: 'à la poêle ou au micro-ondes.',
  },
  'Scramble an egg if you want one.': { main: 'Fais brouiller un **œuf**.', extra: 'si tu en veux un.' },
  'Pile beans, egg and cheese on a tortilla.': {
    main: 'Dispose les **haricots**, l’œuf et le fromage.',
    extra: 'sur une tortilla.',
  },
  'Roll it up tight.': { main: '**Roule**-la bien serré.', extra: '' },
  'Heat oil in a pan and add frozen hash browns.': {
    main: 'Fais chauffer de l’**huile** dans une poêle.',
    extra: 'et ajoute les galettes de pommes de terre surgelées.',
  },
  'Cook 8 minutes, flipping once, until crisp.': {
    main: 'Fais cuire **8 minutes** en retournant une fois.',
    extra: 'jusqu’à ce que ce soit croustillant.',
  },
  'Fry an egg in a second pan or push the hash browns aside.': {
    main: 'Fais cuire un **œuf** au plat dans une deuxième poêle.',
    extra: 'ou pousse les galettes sur le côté.',
  },
  'Plate together and season.': { main: '**Mets** le tout dans l’assiette et assaisonne.', extra: '' },
  'Whisk an egg with a splash of milk and a pinch of cinnamon.': {
    main: 'Bats un **œuf**.',
    extra: 'avec un peu de lait et une pincée de cannelle.',
  },
  'Dip each bread slice in the mixture on both sides.': {
    main: 'Trempe chaque tranche de **pain** dans le mélange.',
    extra: 'des deux côtés.',
  },
  'Fry in a buttered pan 2 minutes a side until golden.': {
    main: 'Fais cuire dans une **poêle** beurrée.',
    extra: '2 minutes de chaque côté, jusqu’à ce que ce soit doré.',
  },
  'Serve with syrup or fruit.': { main: 'Sers avec du **sirop** ou des fruits.', extra: '' },
  'Stir pancake mix with water or milk until just combined.': {
    main: '**Mélange** la préparation pour pancakes avec de l’eau ou du lait.',
    extra: 'jusqu’à ce que ce soit juste mélangé.',
  },
  'Heat a lightly oiled pan over medium heat.': { main: 'Chauffe une **poêle** légèrement huilée.', extra: 'à feu moyen.' },
  'Pour in small circles and cook until bubbles form, then flip.': {
    main: '**Verse** de petits ronds de pâte et fais cuire.',
    extra: 'jusqu’à ce que des bulles se forment, puis retourne-les.',
  },
  'Cook another minute and stack on a plate.': {
    main: 'Fais cuire **encore une minute**.',
    extra: 'et empile-les dans une assiette.',
  },
};

// The French words for a step ({ main, extra }), or null if it has none yet.
export function frenchForStep(text) {
  return Object.hasOwn(frenchSteps, text) ? frenchSteps[text] : null;
}

export function frenchMinutes(minutes) {
  return `${minutes} min`;
}

// The line under the filters on the list screen: how many breakfasts, and for which choices.
// French writes 0 and 1 in the singular.
export function frenchSummary({ count, anyTime, maxMinutes, useKitchen, strict, onlyFavorites, tags, almost }) {
  return [
    `${count} petit-déjeuner${count > 1 ? 's' : ''}`,
    anyTime ? 'sans limite de temps' : `${maxMinutes} min maximum`,
    ...(useKitchen ? [strict ? 'avec ce que tu as, bases comprises' : 'avec ce que tu as'] : []),
    ...(onlyFavorites ? ['favoris'] : []),
    ...tags.map((tag) => frenchUi.tags[tag]),
    ...(almost > 0 ? [`${almost} presque prêt${almost > 1 ? 's' : ''}`] : []),
  ].join(' \u00b7 ');
}

// "1–5 sur 36".
export function frenchShowing(first, last, total) {
  return `Affichage ${first}\u2013${last} sur ${total}`;
}

// The bar that folds the breakfasts that are one food away.
export function frenchAlmost(count, open) {
  return {
    title: `Presque prêts (${count})`,
    sub: `1 aliment manquant \u00b7 touche pour ${open ? 'masquer' : 'afficher'}`,
  };
}

// A food's name in the middle of a sentence starts with a small letter ("lait", "œufs"), except a name like "BBQ".
function inSentence(name) {
  return name.length > 1 && name[1] === name[1].toUpperCase() && name[1] !== name[1].toLowerCase()
    ? name
    : name.charAt(0).toLowerCase() + name.slice(1);
}

// The French name of a food by id. A food the student typed has only the name they wrote.
export function frenchFoodName(id) {
  if (frenchFoods[id]) return frenchFoods[id];
  const typed = typedItems().find((food) => food.id === id);
  return typed ? typed.label : id.startsWith('own:') ? id.slice(4) : '';
}

// A line in a list starts with a capital letter: "Banane, pomme ou fruits rouges".
export function frenchNeedItem(need) {
  const label = frenchNeedLabel(need);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// "banane, pomme ou fruits rouges" for a list of alternatives, or just "œufs".
export function frenchNeedLabel(need) {
  const names = (Array.isArray(need) ? need : [need]).map((id) => inSentence(frenchFoodName(id)));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} ou ${names[names.length - 1]}` : names[0];
}

// What the student has, with the kinds they ticked in brackets: "lait (lait d’avoine)".
export function frenchHaveLabels(haveIds) {
  return haveEntries(haveIds).map(({ item, kinds }) =>
    kinds.length > 0
      ? `${inSentence(frenchFoodName(item.id))} (${kinds.map((kind) => inSentence(frenchFoodName(kind.id))).join(', ')})`
      : inSentence(frenchFoodName(item.id))
  );
}

// "Enregistré « Mon omelette »": the floating message after saving a breakfast.
export function frenchSaved(name) {
  return `Enregistré «${NBSP}${name}${NBSP}»`;
}

// "2 tâches dans ta liste": how many tasks are on tonight's list.
export function frenchTaskCount(count) {
  if (count === 0) return 'Aucune tâche dans ta liste';
  return `${count} ${count === 1 ? 'tâche' : 'tâches'} dans ta liste`;
}

// French names of foods, by ingredient id (items and kinds): the same ids as chineseFoods.
export const frenchFoods = {
  eggs: 'Œufs',
  milk: 'Lait',
  'whole-milk': 'Lait entier',
  'low-fat-milk': 'Lait demi-écrémé',
  'oat-milk': 'Lait d’avoine',
  'almond-milk': 'Lait d’amande',
  'soy-milk': 'Lait de soja',
  yogurt: 'Yaourt',
  'plain-yogurt': 'Yaourt nature',
  'greek-yogurt': 'Yaourt grec',
  'flavored-yogurt': 'Yaourt aromatisé',
  'cottage-cheese': 'Fromage cottage',
  cheese: 'Fromage',
  cheddar: 'Cheddar',
  mozzarella: 'Mozzarella',
  swiss: 'Emmental',
  'cream-cheese': 'Fromage frais',
  butter: 'Beurre',
  'salted-butter': 'Beurre salé',
  'unsalted-butter': 'Beurre doux',
  banana: 'Banane',
  apple: 'Pomme',
  berries: 'Fruits rouges',
  avocado: 'Avocat',
  tomato: 'Tomate',
  vegetables: 'Autres légumes',
  bread: 'Pain',
  'white-bread': 'Pain blanc',
  'whole-wheat-bread': 'Pain complet',
  sourdough: 'Pain au levain',
  bagel: 'Bagel',
  tortilla: 'Tortilla',
  crackers: 'Crackers',
  oats: 'Flocons d’avoine',
  'rolled-oats': 'Flocons d’avoine classiques',
  'instant-oats': 'Flocons d’avoine instantanés',
  cereal: 'Céréales',
  granola: 'Granola',
  rice: 'Riz',
  'white-rice': 'Riz blanc',
  'brown-rice': 'Riz complet',
  waffles: 'Gaufres surgelées',
  'pancake-mix': 'Préparation pour pancakes',
  'hash-browns': 'Galettes de pommes de terre',
  'peanut-butter': 'Beurre de cacahuète',
  jam: 'Confiture',
  honey: 'Miel',
  nuts: 'Fruits à coque',
  chia: 'Graines de chia',
  hummus: 'Houmous',
  'protein-powder': 'Protéines en poudre',
  bacon: 'Bacon',
  turkey: 'Dinde en tranches',
  beans: 'Haricots',
  salt: 'Sel',
  'table-salt': 'Sel de table',
  'sea-salt': 'Sel de mer',
  'kosher-salt': 'Gros sel',
  pepper: 'Poivre',
  'black-pepper': 'Poivre noir',
  'white-pepper': 'Poivre blanc',
  'cooking-oil': 'Huile de cuisson',
  'olive-oil': 'Huile d’olive',
  'vegetable-oil': 'Huile végétale',
  'canola-oil': 'Huile de colza',
  'coconut-oil': 'Huile de coco',
  'cooking-spray': 'Huile en spray',
  sugar: 'Sucre',
  'white-sugar': 'Sucre blanc',
  'brown-sugar': 'Sucre roux',
  cinnamon: 'Cannelle',
  'maple-syrup': 'Sirop d’érable',
  'soy-sauce': 'Sauce soja',
  'hot-sauce': 'Sauce piquante',
};

// "Quel type de lait ? (facultatif)": the question under a food that has kinds.
export function frenchKindsLabel(itemId) {
  const name = frenchFoods[itemId];
  const lower = name.charAt(0).toLowerCase() + name.slice(1);
  const of = /^[aeiouyhœéè]/i.test(lower) ? 'd’' : 'de ';
  return `Quel type ${of}${lower}${NBSP}? (facultatif)`;
}

// "3 aliments cochés", or "Rien pour l’instant".
export function frenchKitchenCount(count) {
  if (count === 0) return 'Rien pour l’instant';
  return `${count} ${count === 1 ? 'aliment coché' : 'aliments cochés'}`;
}

// The question when removing a food you typed.
export function frenchRemoveFood(name) {
  return `Supprimer «${NBSP}${name}${NBSP}»${NBSP}?`;
}

// The French for a fixed English text, or null if it has none yet.
export function frenchOf(english) {
  return Object.hasOwn(frenchText, english) ? frenchText[english] : null;
}

// "27 jours restants": how long a thing stays in the trash (French writes 0 and 1 in the singular).
export function frenchDaysLeft(days) {
  return `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`;
}

// The floating message after deleting something. "À la corbeille" fits every kind of thing, whatever its gender.
export function frenchMovedToTrash(name) {
  return `À la corbeille${NBSP}: «${NBSP}${name}${NBSP}»`;
}
