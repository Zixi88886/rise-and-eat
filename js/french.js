// French words for the home page and the Settings window. The same idea as js/chinese.js: a text is
// found by its exact English words, and a text with no French yet is simply shown in English.
// The words use "tu" (friendly, like a note to a friend) and a non-breaking space ( ) before
// ? ! : ; and inside « », which is how French is written.

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
};

// The French for a fixed English text, or null if it has none yet.
export function frenchOf(english) {
  return Object.hasOwn(frenchText, english) ? frenchText[english] : null;
}
