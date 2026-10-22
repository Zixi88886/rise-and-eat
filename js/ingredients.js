// Ingredients the student can say they have. An item can have `kinds` (for example sea salt
// or table salt). Ticking a kind also ticks its item, so a breakfast that needs "salt" is
// satisfied by any kind of salt. Water is assumed to be in every kitchen, so it is not listed.

export const INGREDIENT_GROUPS = [
  {
    title: 'Eggs and dairy',
    items: [
      { id: 'eggs', label: 'Eggs' },
      {
        id: 'milk',
        label: 'Milk',
        kinds: [
          { id: 'whole-milk', label: 'Whole milk' },
          { id: 'low-fat-milk', label: 'Low-fat milk' },
          { id: 'oat-milk', label: 'Oat milk' },
          { id: 'almond-milk', label: 'Almond milk' },
          { id: 'soy-milk', label: 'Soy milk' },
        ],
      },
      {
        id: 'yogurt',
        label: 'Yogurt',
        kinds: [
          { id: 'plain-yogurt', label: 'Plain yogurt' },
          { id: 'greek-yogurt', label: 'Greek yogurt' },
          { id: 'flavored-yogurt', label: 'Flavored yogurt' },
        ],
      },
      { id: 'cottage-cheese', label: 'Cottage cheese' },
      {
        id: 'cheese',
        label: 'Cheese',
        kinds: [
          { id: 'cheddar', label: 'Cheddar' },
          { id: 'mozzarella', label: 'Mozzarella' },
          { id: 'swiss', label: 'Swiss' },
        ],
      },
      { id: 'cream-cheese', label: 'Cream cheese' },
      {
        id: 'butter',
        label: 'Butter',
        kinds: [
          { id: 'salted-butter', label: 'Salted butter' },
          { id: 'unsalted-butter', label: 'Unsalted butter' },
        ],
      },
    ],
  },
  {
    title: 'Fruit and vegetables',
    items: [
      { id: 'banana', label: 'Banana' },
      { id: 'apple', label: 'Apple' },
      { id: 'berries', label: 'Berries' },
      { id: 'avocado', label: 'Avocado' },
      { id: 'tomato', label: 'Tomato' },
      { id: 'vegetables', label: 'Other vegetables' },
    ],
  },
  {
    title: 'Bread and grains',
    items: [
      {
        id: 'bread',
        label: 'Bread',
        kinds: [
          { id: 'white-bread', label: 'White bread' },
          { id: 'whole-wheat-bread', label: 'Whole wheat bread' },
          { id: 'sourdough', label: 'Sourdough' },
        ],
      },
      { id: 'bagel', label: 'Bagel' },
      { id: 'tortilla', label: 'Tortilla' },
      { id: 'crackers', label: 'Crackers' },
      {
        id: 'oats',
        label: 'Oats',
        kinds: [
          { id: 'rolled-oats', label: 'Rolled oats' },
          { id: 'instant-oats', label: 'Instant oats' },
        ],
      },
      { id: 'cereal', label: 'Cereal' },
      { id: 'granola', label: 'Granola' },
      {
        id: 'rice',
        label: 'Rice',
        kinds: [
          { id: 'white-rice', label: 'White rice' },
          { id: 'brown-rice', label: 'Brown rice' },
        ],
      },
      { id: 'waffles', label: 'Frozen waffles' },
      { id: 'pancake-mix', label: 'Pancake mix' },
      { id: 'hash-browns', label: 'Hash browns' },
    ],
  },
  {
    title: 'Spreads and extras',
    items: [
      { id: 'peanut-butter', label: 'Peanut butter' },
      { id: 'jam', label: 'Jam' },
      { id: 'honey', label: 'Honey' },
      { id: 'nuts', label: 'Nuts' },
      { id: 'chia', label: 'Chia seeds' },
      { id: 'hummus', label: 'Hummus' },
      { id: 'protein-powder', label: 'Protein powder' },
    ],
  },
  {
    title: 'Meat and beans',
    items: [
      { id: 'bacon', label: 'Bacon' },
      { id: 'turkey', label: 'Sliced turkey' },
      { id: 'beans', label: 'Beans' },
    ],
  },
  {
    title: 'Cooking basics',
    basics: true,
    note: 'Seasonings, oils and sweeteners. Most recipes use these, so they are handy to have. No worries if you do not have them all yet: you can still make plenty of breakfasts.',
    items: [
      {
        id: 'salt',
        label: 'Salt',
        kinds: [
          { id: 'table-salt', label: 'Table salt' },
          { id: 'sea-salt', label: 'Sea salt' },
          { id: 'kosher-salt', label: 'Kosher salt' },
        ],
      },
      {
        id: 'pepper',
        label: 'Pepper',
        kinds: [
          { id: 'black-pepper', label: 'Black pepper' },
          { id: 'white-pepper', label: 'White pepper' },
        ],
      },
      {
        id: 'cooking-oil',
        label: 'Cooking oil',
        kinds: [
          { id: 'olive-oil', label: 'Olive oil' },
          { id: 'vegetable-oil', label: 'Vegetable oil' },
          { id: 'canola-oil', label: 'Canola oil' },
          { id: 'coconut-oil', label: 'Coconut oil' },
          { id: 'cooking-spray', label: 'Cooking spray' },
        ],
      },
      {
        id: 'sugar',
        label: 'Sugar',
        kinds: [
          { id: 'white-sugar', label: 'White sugar' },
          { id: 'brown-sugar', label: 'Brown sugar' },
        ],
      },
      { id: 'cinnamon', label: 'Cinnamon' },
      { id: 'maple-syrup', label: 'Maple syrup' },
      { id: 'soy-sauce', label: 'Soy sauce' },
      { id: 'hot-sauce', label: 'Hot sauce' },
    ],
  },
];

const ALL_ITEMS = INGREDIENT_GROUPS.flatMap((group) => group.items);
const KIND_IDS_BY_ITEM = Object.fromEntries(
  ALL_ITEMS.map((item) => [item.id, (item.kinds || []).map((kind) => kind.id)])
);
const ITEM_ID_BY_KIND = Object.fromEntries(
  ALL_ITEMS.flatMap((item) => (item.kinds || []).map((kind) => [kind.id, item.id]))
);

export const INGREDIENT_IDS = [...ALL_ITEMS.map((item) => item.id), ...Object.keys(ITEM_ID_BY_KIND)];

export function isKind(id) {
  return id in ITEM_ID_BY_KIND;
}

export function kindIdsOf(itemId) {
  return KIND_IDS_BY_ITEM[itemId] || [];
}

export function itemIdOfKind(kindId) {
  return ITEM_ID_BY_KIND[kindId];
}

function hasItem(itemId, haveIds) {
  return haveIds.includes(itemId) || kindIdsOf(itemId).some((kindId) => haveIds.includes(kindId));
}

// The seasoning, oil and sweetener items (the "Cooking basics" group). Breakfasts list these as `extras`.
export const SEASONING_ITEM_IDS = INGREDIENT_GROUPS.filter((group) => group.basics)
  .flatMap((group) => group.items)
  .map((item) => item.id);

function hasNeed(need, haveIds) {
  return Array.isArray(need) ? need.some((id) => hasItem(id, haveIds)) : hasItem(need, haveIds);
}

// A breakfast fits if every ingredient it needs is in the kitchen. An entry of `needs` can be
// a list of alternatives (for example any fruit). With `includeExtras`, its seasonings and oils
// must be there too. A breakfast with no ingredient list always fits.
export function canMake(breakfast, haveIds, includeExtras = false) {
  const required = [...(breakfast.needs || []), ...(includeExtras ? breakfast.extras || [] : [])];
  return required.every((need) => hasNeed(need, haveIds));
}

// The labels of the main ingredients (and, with `includeExtras`, seasonings) the student still
// lacks for a breakfast. A list of alternatives counts as one: "Banana, apple or berries".
export function missingNeeds(breakfast, haveIds, includeExtras = false) {
  const required = [...(breakfast.needs || []), ...(includeExtras ? breakfast.extras || [] : [])];
  return required.filter((need) => !hasNeed(need, haveIds)).map((need) => needLabel(need));
}

// What the student still lacks for this breakfast, as { need, label, have } for each ingredient.
export function describeNeeds(needs, haveIds) {
  return (needs || []).map((need) => ({ label: needLabel(need), have: hasNeed(need, haveIds) }));
}

function itemLabel(id) {
  const item = ALL_ITEMS.find((candidate) => candidate.id === id);
  return item ? item.label : id;
}

// "Bread", or "Banana, apple or berries" for a list of alternatives.
export function needLabel(need) {
  if (!Array.isArray(need)) return itemLabel(need);
  const labels = need.map((id) => itemLabel(id).toLowerCase());
  const text = labels.length > 1 ? `${labels.slice(0, -1).join(', ')} or ${labels[labels.length - 1]}` : labels[0];
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// How many different items the student has (kinds do not count twice).
export function countItems(haveIds) {
  return ALL_ITEMS.filter((item) => hasItem(item.id, haveIds)).length;
}

// Names of what the student has, in the order of the kitchen screen, with kinds in brackets:
// "Milk (Oat milk)".
export function haveLabels(haveIds) {
  return ALL_ITEMS.filter((item) => hasItem(item.id, haveIds)).map((item) => {
    const kinds = (item.kinds || []).filter((kind) => haveIds.includes(kind.id));
    return kinds.length > 0 ? `${item.label} (${kinds.map((kind) => kind.label).join(', ')})` : item.label;
  });
}
