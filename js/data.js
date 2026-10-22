// The breakfasts and prep reminders that come with the app.
// `needs` lists the ingredients a breakfast uses; a list inside it means any one of those will do.
// `extras` lists the seasonings and oils its steps use. They only hide a breakfast when the
// student chooses "required".
const FRUIT = ['banana', 'apple', 'berries'];
// Anything you can cook with: oil or butter.
const FAT = ['cooking-oil', 'butter'];

export const builtInBreakfasts = [
  {
    id: 'yogurt-bowl',
    name: 'Yogurt, fruit & a fistful of granola',
    minutes: 2,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['yogurt', FRUIT, 'granola'],
    accent: '#FF8F65',
    steps: [
      'Spoon yogurt into a bowl.',
      'Top with whatever fruit is closest to going bad.',
      'Add a handful of granola or oats.',
      'Eat standing up if you have to.'
    ]
  },
  {
    id: 'banana-nut-butter',
    name: 'Banana with nut butter',
    minutes: 2,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['banana', 'peanut-butter'],
    accent: '#FFCE6B',
    steps: [
      'Peel banana.',
      'Spread nut butter along one side with a knife, straight from the jar.',
      'Eat it like a very inefficient sandwich.'
    ]
  },
  {
    id: 'smoothie',
    name: 'Blend-and-go smoothie',
    minutes: 3,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: [FRUIT, 'milk', 'yogurt'],
    accent: '#6B5B95',
    steps: [
      'Throw frozen fruit, a splash of milk and a spoon of yogurt into the blender.',
      'Blend for 20 seconds.',
      'Pour into the cup you\u2019ll actually carry out the door.',
      'Rinse the blender jar now, before it dries on.'
    ]
  },
  {
    id: 'toast-egg',
    name: 'Toast with a fried egg',
    minutes: 5,
    tags: ['vegetarian', 'savory', 'high-protein'],
    needs: ['bread', 'eggs'],
    extras: [FAT, 'salt'],
    accent: '#FF8F65',
    steps: [
      'Drop bread in the toaster.',
      'Crack an egg into a hot, lightly oiled pan.',
      'Cook 2\u20133 minutes until the white sets; flip if you like it firm.',
      'Slide the egg onto the toast, salt it, done.'
    ]
  },
  {
    id: 'overnight-oats',
    name: 'Overnight oats (if you prepped them)',
    minutes: 1,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['oats', 'milk'],
    accent: '#1B2340',
    steps: [
      'Take the jar out of the fridge.',
      'Stir once.',
      'Eat straight from the jar, or pour into a bowl if you\u2019re feeling fancy.'
    ]
  },
  {
    id: 'egg-muffins',
    name: 'Reheated egg muffins (if you batch-made them)',
    minutes: 3,
    tags: ['no-stove', 'savory', 'high-protein'],
    needs: ['eggs'],
    accent: '#FFCE6B',
    steps: [
      'Take 2 egg muffins from the fridge.',
      'Microwave 45\u201360 seconds.',
      'Eat with your hands, in the car if needed.'
    ]
  },
  {
    id: 'pb-toast',
    name: 'Peanut butter toast with banana',
    minutes: 4,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['bread', 'peanut-butter', 'banana'],
    accent: '#6B5B95',
    steps: [
      'Toast the bread.',
      'Spread peanut butter while it\u2019s still hot, so it melts a little.',
      'Slice half a banana on top.',
      'Fold in half and eat like a taco if you\u2019re walking out the door.'
    ]
  },
  {
    id: 'proper-eggs',
    name: 'Scrambled eggs & toast, unrushed',
    minutes: 8,
    tags: ['vegetarian', 'savory', 'high-protein'],
    needs: ['eggs', 'milk', 'butter', 'bread'],
    extras: ['salt'],
    accent: '#FF8F65',
    steps: [
      'Whisk two eggs with a splash of milk and a pinch of salt.',
      'Melt butter in a pan over low heat.',
      'Pour in eggs, stir slowly and often until just set.',
      'Drop the bread in the toaster while the eggs finish.',
      'Plate both together, sit down for this one.'
    ]
  },
  {
    id: 'cereal',
    name: 'Cereal and milk',
    minutes: 1,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['cereal', 'milk'],
    accent: '#FFCE6B',
    steps: [
      'Pour cereal into a bowl.',
      'Add milk.',
      'Done \u2014 this one barely needs instructions.'
    ]
  },
  {
    id: 'chia-pudding',
    name: 'Chia pudding (if you prepped it)',
    minutes: 1,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['chia', 'milk'],
    accent: '#1B2340',
    steps: [
      'Take the jar out of the fridge.',
      'Give it a stir \u2014 it thickens overnight.',
      'Eat straight from the jar or add fruit on top.'
    ]
  },
  {
    id: 'cottage-cheese',
    name: 'Cottage cheese with berries and honey',
    minutes: 2,
    tags: ['no-stove', 'vegetarian', 'sweet', 'high-protein'],
    needs: ['cottage-cheese', 'berries', 'honey'],
    accent: '#6B5B95',
    steps: [
      'Spoon cottage cheese into a bowl.',
      'Top with a handful of berries.',
      'Drizzle honey over the top.'
    ]
  },
  {
    id: 'bagel-cream-cheese',
    name: 'Bagel with cream cheese',
    minutes: 4,
    tags: ['no-stove', 'vegetarian', 'savory'],
    needs: ['bagel', 'cream-cheese'],
    accent: '#FF8F65',
    steps: [
      'Slice the bagel in half.',
      'Toast it while you get dressed.',
      'Spread cream cheese on both halves.'
    ]
  },
  {
    id: 'avocado-toast',
    name: 'Avocado toast',
    minutes: 6,
    tags: ['no-stove', 'vegetarian', 'savory'],
    needs: ['bread', 'avocado'],
    extras: ['salt', 'pepper'],
    accent: '#FFCE6B',
    steps: [
      'Drop bread in the toaster.',
      'Halve an avocado, scoop it into a bowl and mash roughly with a fork.',
      'Spread mashed avocado on the toast.',
      'Salt, pepper, and a squeeze of lemon if you have one.'
    ]
  },
  {
    id: 'breakfast-wrap',
    name: 'Scrambled egg breakfast wrap',
    minutes: 7,
    tags: ['vegetarian', 'savory', 'high-protein'],
    needs: ['eggs', 'tortilla', 'cheese'],
    extras: [FAT, 'salt'],
    accent: '#6B5B95',
    steps: [
      'Whisk two eggs with a pinch of salt and scramble in a hot pan.',
      'Warm a tortilla in the same pan for 20 seconds a side.',
      'Pile the eggs, a handful of cheese, and any leftover veg into the tortilla.',
      'Roll it up tight and wrap it in a paper towel to eat on the way out.'
    ]
  },
  {
    id: 'pb-banana-oats',
    name: 'Microwave peanut butter banana oatmeal',
    minutes: 5,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['oats', 'peanut-butter', 'banana'],
    accent: '#1B2340',
    steps: [
      'Combine oats and milk or water in a microwave-safe bowl.',
      'Microwave 90 seconds, stir, then another 60 seconds.',
      'Stir in a spoon of peanut butter while it\u2019s hot.',
      'Slice banana on top.'
    ]
  },
  {
    id: 'leftovers-bowl',
    name: 'Leftover rice and egg bowl',
    minutes: 6,
    tags: ['vegetarian', 'savory'],
    needs: ['rice', 'eggs'],
    extras: [FAT, ['soy-sauce', 'hot-sauce']],
    accent: '#FF8F65',
    steps: [
      'Microwave leftover rice for a minute to loosen it up.',
      'Fry an egg in a hot pan while the rice heats.',
      'Slide the egg on top of the rice.',
      'Splash on soy sauce or hot sauce and eat straight from the bowl.'
    ]
  },
  {
    id: 'greek-yogurt-honey',
    name: 'Greek yogurt with honey and nuts',
    minutes: 2,
    tags: ['no-stove', 'vegetarian', 'sweet', 'high-protein'],
    needs: ['yogurt', 'honey', 'nuts'],
    accent: '#FF8F65',
    steps: [
      'Spoon Greek yogurt into a bowl.',
      'Drizzle honey over the top.',
      'Add a handful of nuts and eat.'
    ]
  },
  {
    id: 'apple-pb',
    name: 'Apple slices with peanut butter',
    minutes: 2,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['apple', 'peanut-butter'],
    accent: '#FFCE6B',
    steps: [
      'Slice an apple into wedges.',
      'Put a spoonful of peanut butter on the side for dipping.'
    ]
  },
  {
    id: 'boiled-eggs',
    name: 'Hard-boiled eggs (if you boiled them ahead)',
    minutes: 2,
    tags: ['no-stove', 'vegetarian', 'savory', 'high-protein'],
    needs: ['eggs'],
    extras: ['salt', 'pepper'],
    accent: '#6B5B95',
    steps: [
      'Take two boiled eggs from the fridge.',
      'Peel them under a little running water.',
      'Add salt and pepper.'
    ]
  },
  {
    id: 'cheese-crackers',
    name: 'Cheese and crackers',
    minutes: 2,
    tags: ['no-stove', 'vegetarian', 'savory'],
    needs: ['cheese', 'crackers'],
    accent: '#1B2340',
    steps: [
      'Slice or break off some cheese.',
      'Stack it on crackers.',
      'Add a piece of fruit if you have one.'
    ]
  },
  {
    id: 'toast-jam',
    name: 'Toast with butter and jam',
    minutes: 3,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['bread', 'butter', 'jam'],
    accent: '#FF8F65',
    steps: [
      'Toast the bread.',
      'Spread butter while it is hot.',
      'Add jam on top.'
    ]
  },
  {
    id: 'pb-jelly',
    name: 'Peanut butter and jelly sandwich',
    minutes: 3,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['bread', 'peanut-butter', 'jam'],
    accent: '#FFCE6B',
    steps: [
      'Spread peanut butter on one slice of bread.',
      'Spread jelly on the other slice.',
      'Press together and cut in half if you like.'
    ]
  },
  {
    id: 'instant-oatmeal',
    name: 'Instant oatmeal with berries',
    minutes: 3,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['oats', 'berries'],
    accent: '#6B5B95',
    steps: [
      'Pour the oatmeal packet into a bowl and add hot water or milk.',
      'Microwave or wait a minute, then stir.',
      'Top with berries.'
    ]
  },
  {
    id: 'protein-shake',
    name: 'Milk, banana and protein powder shake',
    minutes: 3,
    tags: ['no-stove', 'vegetarian', 'sweet', 'high-protein'],
    needs: ['milk', 'banana', 'protein-powder'],
    accent: '#1B2340',
    steps: [
      'Add milk, a banana and a scoop of protein powder to a blender or shaker.',
      'Blend or shake well.',
      'Drink it on the way out.'
    ]
  },
  {
    id: 'frozen-waffles',
    name: 'Frozen waffles with fruit',
    minutes: 4,
    tags: ['no-stove', 'vegetarian', 'sweet'],
    needs: ['waffles', FRUIT],
    accent: '#FF8F65',
    steps: [
      'Toast two frozen waffles until crisp.',
      'Top with sliced fruit.',
      'Add syrup or yogurt if you like.'
    ]
  },
  {
    id: 'mug-omelet',
    name: 'Microwave mug omelet',
    minutes: 4,
    tags: ['no-stove', 'vegetarian', 'savory', 'high-protein'],
    needs: ['eggs', 'milk', 'cheese'],
    extras: ['salt'],
    accent: '#FFCE6B',
    steps: [
      'Crack two eggs into a mug and add a splash of milk and a pinch of salt.',
      'Stir in cheese or leftover veg.',
      'Microwave 60 seconds, stir, then 30 more seconds until set.'
    ]
  },
  {
    id: 'hummus-toast',
    name: 'Hummus and veggie toast',
    minutes: 4,
    tags: ['no-stove', 'vegetarian', 'savory'],
    needs: ['bread', 'hummus', 'vegetables'],
    extras: ['salt'],
    accent: '#6B5B95',
    steps: [
      'Toast the bread.',
      'Spread hummus on top.',
      'Add sliced cucumber or tomato and a pinch of salt.'
    ]
  },
  {
    id: 'turkey-cheese',
    name: 'Turkey and cheese sandwich',
    minutes: 4,
    tags: ['no-stove', 'savory', 'high-protein'],
    needs: ['turkey', 'cheese', 'bread'],
    accent: '#1B2340',
    steps: [
      'Layer turkey and cheese on a slice of bread.',
      'Add mustard or lettuce if you have it.',
      'Top with a second slice and eat.'
    ]
  },
  {
    id: 'tomato-cheese-toast',
    name: 'Tomato and cheese toast',
    minutes: 5,
    tags: ['no-stove', 'vegetarian', 'savory'],
    needs: ['bread', 'cheese', 'tomato'],
    extras: ['salt', 'pepper'],
    accent: '#FF8F65',
    steps: [
      'Toast the bread.',
      'Lay slices of cheese on the warm toast.',
      'Add sliced tomato, salt and pepper.'
    ]
  },
  {
    id: 'cheese-quesadilla',
    name: 'Cheese quesadilla',
    minutes: 6,
    tags: ['vegetarian', 'savory'],
    needs: ['tortilla', 'cheese'],
    accent: '#FFCE6B',
    steps: [
      'Heat a dry pan over medium heat.',
      'Put a tortilla in the pan and cover half with cheese.',
      'Fold it over and cook 2 minutes a side until golden.',
      'Cut into wedges.'
    ]
  },
  {
    id: 'bacon-egg-sandwich',
    name: 'Bacon and egg sandwich',
    minutes: 8,
    tags: ['savory', 'high-protein'],
    needs: ['bacon', 'eggs', 'bread'],
    accent: '#6B5B95',
    steps: [
      'Cook two strips of bacon in a pan until crisp, then set aside.',
      'Fry an egg in the same pan.',
      'Toast bread or a bun.',
      'Stack the bacon and egg between the bread.'
    ]
  },
  {
    id: 'veggie-omelet',
    name: 'Veggie omelet',
    minutes: 10,
    tags: ['vegetarian', 'savory', 'high-protein'],
    needs: ['eggs', 'vegetables', 'butter'],
    extras: ['salt', 'pepper'],
    accent: '#1B2340',
    steps: [
      'Whisk two eggs with salt and pepper.',
      'Soften chopped veg in a buttered pan for a minute.',
      'Pour in the eggs and let them set for 2 minutes.',
      'Fold in half and slide onto a plate.'
    ]
  },
  {
    id: 'bean-burrito',
    name: 'Bean and cheese breakfast burrito',
    minutes: 10,
    tags: ['vegetarian', 'savory', 'high-protein'],
    needs: ['beans', 'tortilla', 'cheese'],
    accent: '#FF8F65',
    steps: [
      'Warm canned or leftover beans in a pan or the microwave.',
      'Scramble an egg if you want one.',
      'Pile beans, egg and cheese on a tortilla.',
      'Roll it up tight.'
    ]
  },
  {
    id: 'hash-brown-egg',
    name: 'Hash browns and egg',
    minutes: 12,
    tags: ['vegetarian', 'savory'],
    needs: ['hash-browns', 'eggs'],
    extras: [FAT, 'salt'],
    accent: '#FFCE6B',
    steps: [
      'Heat oil in a pan and add frozen hash browns.',
      'Cook 8 minutes, flipping once, until crisp.',
      'Fry an egg in a second pan or push the hash browns aside.',
      'Plate together and season.'
    ]
  },
  {
    id: 'french-toast',
    name: 'French toast',
    minutes: 12,
    tags: ['vegetarian', 'sweet'],
    needs: ['bread', 'eggs', 'milk'],
    extras: [FAT, 'cinnamon'],
    accent: '#6B5B95',
    steps: [
      'Whisk an egg with a splash of milk and a pinch of cinnamon.',
      'Dip each bread slice in the mixture on both sides.',
      'Fry in a buttered pan 2 minutes a side until golden.',
      'Serve with syrup or fruit.'
    ]
  },
  {
    id: 'pancakes',
    name: 'Pancakes from a mix',
    minutes: 15,
    tags: ['vegetarian', 'sweet'],
    needs: ['pancake-mix', 'milk'],
    extras: [FAT],
    accent: '#1B2340',
    steps: [
      'Stir pancake mix with water or milk until just combined.',
      'Heat a lightly oiled pan over medium heat.',
      'Pour in small circles and cook until bubbles form, then flip.',
      'Cook another minute and stack on a plate.'
    ]
  }
];

// The "Set up tonight" lines to choose from, grouped by the kind of breakfast they help with.
// Each line is short and in plain words, with its one key word between ** ** (shown highlighted),
// a small picture that goes with the words, and sometimes a second line of detail.
// A line's `id` is what gets saved, so the words can be improved later without losing anyone's ticks.
export const prepLibrary = [
  {
    title: 'Any breakfast',
    icon: '\u2600\uFE0F',
    tasks: [
      { id: 'lib-bowl', icon: '\uD83E\uDD63', text: 'Set out a **bowl** or jar' },
      { id: 'lib-fruit', icon: '\uD83C\uDF53', text: 'Wash and cut the **fruit**' },
      { id: 'lib-coffee', icon: '\u2615', text: 'Set the **coffee** or kettle timer' },
      { id: 'lib-alarm', icon: '\u23F0', text: 'Put your **alarm** across the room' },
      { id: 'lib-supplies', icon: '\uD83D\uDED2', text: 'Check you have **milk, eggs and bread**' },
      { id: 'lib-dishes', icon: '\uD83E\uDDFC', text: 'Wash up so **bowls are clean**' },
    ],
  },
  {
    title: 'Oats and jars',
    icon: '\uD83E\uDD63',
    tasks: [
      { id: 'lib-oats-jar', icon: '\uD83C\uDF3E', text: 'Put **oats or granola** in a jar' },
      {
        id: 'lib-overnight-oats',
        icon: '\uD83E\uDD5B',
        text: 'Mix **overnight oats** in a jar',
        detail: 'Oats, milk and a spoon of yogurt or chia. Then put it in the fridge.',
      },
      {
        id: 'lib-chia',
        icon: '\uD83E\uDD44',
        text: 'Make **chia pudding** in a jar',
        detail: 'Then put it in the fridge.',
      },
    ],
  },
  {
    title: 'Eggs',
    icon: '\uD83E\uDD5A',
    tasks: [
      { id: 'lib-boil-eggs', icon: '\uD83E\uDD5A', text: 'Boil a few **eggs**', detail: 'Keep them in the fridge.' },
      {
        id: 'lib-egg-muffins',
        icon: '\u2744\uFE0F',
        text: 'Move **egg muffins** to the fridge',
        detail: 'They thaw overnight.',
      },
      { id: 'lib-pan', icon: '\uD83C\uDF73', text: 'Set out a **pan** and spatula' },
    ],
  },
  {
    title: 'Toast and bread',
    icon: '\uD83C\uDF5E',
    tasks: [
      { id: 'lib-toaster', icon: '\uD83C\uDF5E', text: 'Set out the **toaster** and bread' },
      {
        id: 'lib-spreads',
        icon: '\uD83E\uDD5C',
        text: 'Set out your **spreads**',
        detail: 'Peanut butter, jam or cream cheese.',
      },
      { id: 'lib-bagels', icon: '\uD83E\uDD6F', text: 'Take **bagels or tortillas** out of the freezer' },
    ],
  },
  {
    title: 'Smoothies',
    icon: '\uD83E\uDD64',
    tasks: [
      {
        id: 'lib-smoothie-pack',
        icon: '\uD83E\uDDCA',
        text: 'Freeze a **smoothie pack**',
        detail: 'Frozen fruit and spinach in a bag.',
      },
      { id: 'lib-blender', icon: '\uD83E\uDD64', text: 'Set out the **blender** and a cup' },
      { id: 'lib-smoothie-milk', icon: '\uD83E\uDD5B', text: 'Put the **milk or yogurt** close by' },
    ],
  },
  {
    title: 'Grab and go',
    icon: '\uD83C\uDF92',
    tasks: [
      { id: 'lib-fruit-bag', icon: '\uD83C\uDF4C', text: 'Pack a **banana or apple**' },
      { id: 'lib-water', icon: '\uD83D\uDCA7', text: 'Fill your **water bottle**' },
      { id: 'lib-grab-bar', icon: '\uD83C\uDF92', text: 'Pack a **bar or boiled egg**' },
    ],
  },
];

// The lines a new visitor starts with.
export const defaultPrepTasks = ['lib-bowl', 'lib-oats-jar', 'lib-fruit', 'lib-coffee', 'lib-alarm'];

// The old, longer wording that was saved before each line had an id. Anything saved with these
// words is turned into the matching id when it is loaded, so nobody loses their ticks or choices.
export const legacyPrepIds = {
  'Set out a bowl, glass or jar so tomorrow-you doesn\u2019t have to choose one': 'lib-bowl',
  'Pre-portion oats or granola into a jar': 'lib-oats-jar',
  'Wash and cut fruit so it\u2019s grab-ready': 'lib-fruit',
  'Put the coffee or kettle on a timer if you can': 'lib-coffee',
  'Move your alarm across the room \u2014 you\u2019ll be up before you decide not to be': 'lib-alarm',
  'Check you have enough milk, eggs and bread for tomorrow': 'lib-supplies',
  'Wash up or run the dishwasher so your bowls are clean': 'lib-dishes',
  'Mix overnight oats in a jar: oats, milk and a spoon of yogurt or chia, then into the fridge': 'lib-overnight-oats',
  'Make chia pudding in a jar and put it in the fridge': 'lib-chia',
  'Boil a few eggs and keep them in the fridge': 'lib-boil-eggs',
  'Move frozen egg muffins to the fridge to thaw': 'lib-egg-muffins',
  'Set out a pan and a spatula': 'lib-pan',
  'Set out the toaster and the bread': 'lib-toaster',
  'Put the spreads you want (peanut butter, jam, cream cheese) on the counter': 'lib-spreads',
  'Take bagels or tortillas out of the freezer': 'lib-bagels',
  'Put a smoothie pack (frozen fruit and spinach) in a bag in the freezer': 'lib-smoothie-pack',
  'Set out the blender and a cup': 'lib-blender',
  'Put the milk or yogurt for your smoothie where you can reach it': 'lib-smoothie-milk',
  'Pack a banana or an apple in your bag': 'lib-fruit-bag',
  'Fill your water bottle': 'lib-water',
  'Put a breakfast bar or a boiled egg in your bag': 'lib-grab-bar',
};
