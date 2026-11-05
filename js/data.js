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
      'Top with whatever fruit|is closest to going bad.',
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
      'Spread nut butter along one side|with a knife, straight from the jar.',
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
      'Throw everything into the blender.|Frozen fruit, a splash of milk and a spoon of yogurt.',
      'Blend for 20 seconds.',
      'Pour into the cup|you\u2019ll actually carry out the door.',
      'Rinse the blender jar now|before it dries on.'
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
      'Crack an egg into a hot pan|lightly oiled.',
      'Cook 2\u20133 minutes until the white sets; flip if you like it firm.',
      'Slide the egg onto the toast|salt it, done.'
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
      'Fold in half|and eat like a taco if you\u2019re walking out the door.'
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
      'Whisk two eggs|with a splash of milk and a pinch of salt.',
      'Melt butter in a pan|over low heat.',
      'Pour in eggs, stir slowly and often until just set.',
      'Drop the bread in the toaster while the eggs finish.',
      'Plate both together|sit down for this one.'
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
      'Done.|This one barely needs instructions.'
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
      'Eat straight from the jar|or add fruit on top.'
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
      'Mash the avocado in a bowl.|Halve it, scoop it out, mash roughly with a fork.',
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
      'Whisk two eggs|with a pinch of salt and scramble in a hot pan.',
      'Warm a tortilla in the same pan|for 20 seconds a side.',
      'Pile it all into the tortilla.|The eggs, a handful of cheese and any leftover veg.',
      'Roll it up tight|and wrap it in a paper towel to eat on the way out.'
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
      'Combine oats and milk or water|in a microwave-safe bowl.',
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
      'Microwave leftover rice for a minute|to loosen it up.',
      'Fry an egg in a hot pan while the rice heats.',
      'Slide the egg|on top of the rice.',
      'Splash on soy sauce or hot sauce|and eat straight from the bowl.'
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
      'Put a spoonful of peanut butter|on the side for dipping.'
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
      'Spread peanut butter|on one slice of bread.',
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
      'Pour the oatmeal packet into a bowl|and add hot water or milk.',
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
      'Add it all to a blender|or shaker. Milk, a banana and a scoop of protein powder.',
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
      'Crack two eggs into a mug|and add a splash of milk and a pinch of salt.',
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
      'Add sliced cucumber or tomato|and a pinch of salt.'
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
      'Layer turkey and cheese|on a slice of bread.',
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
      'Lay slices of cheese|on the warm toast.',
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
      'Put a tortilla in the pan|and cover half with cheese.',
      'Fold it over|and cook 2 minutes a side until golden.',
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
      'Cook two strips of bacon|in a pan until crisp, then set aside.',
      'Fry an egg in the same pan.',
      'Toast bread or a bun.',
      'Stack the bacon and egg|between the bread.'
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
      'Soften chopped veg in a buttered pan|for a minute.',
      'Pour in the eggs|and let them set for 2 minutes.',
      'Fold in half|and slide onto a plate.'
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
      'Warm canned or leftover beans|in a pan or the microwave.',
      'Scramble an egg if you want one.',
      'Pile beans, egg and cheese|on a tortilla.',
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
      'Heat oil in a pan|and add frozen hash browns.',
      'Cook 8 minutes, flipping once, until crisp.',
      'Fry an egg in a second pan|or push the hash browns aside.',
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
      'Whisk an egg|with a splash of milk and a pinch of cinnamon.',
      'Dip each bread slice in the mixture|on both sides.',
      'Fry in a buttered pan|2 minutes a side until golden.',
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
      'Heat a lightly oiled pan|over medium heat.',
      'Pour in small circles and cook until bubbles form, then flip.',
      'Cook another minute|and stack on a plate.'
    ]
  }
];

// The "Set up tonight" lines to choose from, grouped by the kind of breakfast they help with.
// Each line is short and in plain words, with its one key word between ** ** (shown highlighted),
// a small picture that goes with the words, and sometimes a second line of detail.
// A line's `id` is what gets saved, so the words can be improved later without losing anyone's ticks.
// Photos that come with the app, one for a step, shown small under it: how to do that step.
// Keyed by the step's words. Each is { file, credit, link }: the picture in the photos folder, who
// took it and its licence, and where it came from.
export const stepPhotos = {
  'Drop bread in the toaster.': {
    file: 'photos/toast-in-toaster.jpg',
    credit: 'Kansattica, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bread_sticking_out_of_toaster.jpg',
  },
  'Crack an egg into a hot pan lightly oiled.': {
    file: 'photos/egg-in-pan.jpg',
    credit: 'Horacio Cambeiro, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Fried_egg_cooking_in_a_pan.jpg',
  },
  'Cook 2\u20133 minutes until the white sets; flip if you like it firm.': {
    file: 'photos/egg-in-pan.jpg',
    credit: 'Horacio Cambeiro, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Fried_egg_cooking_in_a_pan.jpg',
  },
  'Cook two strips of bacon in a pan until crisp, then set aside.': {
    file: 'photos/bacon-in-pan.jpg',
    credit: 'Joy, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bacon_in_a_pan.jpg',
  },
  'Stack the bacon and egg between the bread.': {
    file: 'photos/bacon-egg-sandwich.jpg',
    credit: 'BrayLockBoy, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bacon_and_egg_sandwich_mid-assembly,_5_June_2024.jpg',
  },
  'Fry an egg in the same pan.': {
    file: 'photos/egg-in-pan.jpg',
    credit: 'Horacio Cambeiro, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Fried_egg_cooking_in_a_pan.jpg',
  },
  'Toast bread or a bun.': {
    file: 'photos/toast-in-toaster.jpg',
    credit: 'Kansattica, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bread_sticking_out_of_toaster.jpg',
  },
  'Slide the egg onto the toast salt it, done.': {
    file: 'photos/fried-egg-on-toast.jpg',
    credit: 'Acabashi, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Cafe_Max_egg_on_toast_Russell_Street_Stroud_Gloucestershire_England_01.jpg',
  },
  'Spoon yogurt into a bowl.': {
    file: 'photos/yogurt-in-bowl.jpg',
    credit: 'Jumbocombo0811, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Yogurt_fruit_bowl.jpg',
  },
  'Spoon Greek yogurt into a bowl.': {
    file: 'photos/yogurt-in-bowl.jpg',
    credit: 'Jumbocombo0811, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Yogurt_fruit_bowl.jpg',
  },
  'Peel banana.': {
    file: 'photos/peeled-banana.jpg',
    credit: 'Priwo, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:Banane-A-05_cropped.jpg',
  },
  'Throw everything into the blender. Frozen fruit, a splash of milk and a spoon of yogurt.': {
    file: 'photos/blender-fruit.jpg',
    credit: 'SSEKYANZI ANDREW DAISY MUSOKE NKURUKIYE, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:In_the_blender_the_smoothie_is_almost_ready.jpg',
  },
  'Add it all to a blender or shaker. Milk, a banana and a scoop of protein powder.': {
    file: 'photos/blender-fruit.jpg',
    credit: 'SSEKYANZI ANDREW DAISY MUSOKE NKURUKIYE, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:In_the_blender_the_smoothie_is_almost_ready.jpg',
  },
  'Pour into the cup you\u2019ll actually carry out the door.': {
    file: 'photos/pour-smoothie.jpg',
    credit: 'Shixart1985, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Fresh_fruit_smoothie_being_poured_into_a_glass.jpg',
  },
  'Eat straight from the jar, or pour into a bowl if you\u2019re feeling fancy.': {
    file: 'photos/oats-in-jar.jpg',
    credit: 'Nervy8924, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Protein_overnight_oats.jpg',
  },
  'Pour in eggs, stir slowly and often until just set.': {
    file: 'photos/scrambled-eggs.jpg',
    credit: 'Aerous, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Scrambled_egg_in_a_tray.jpg',
  },
  'Add milk.': {
    file: 'photos/cereal-with-milk.jpg',
    credit: 'The Eloquent Peasant, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bowl_of_cereal_and_milk.jpg',
  },
  'Eat straight from the jar or add fruit on top.': {
    file: 'photos/chia-pudding.jpg',
    credit: 'Miscellaneous contributor, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Chia_seed_pudding_in_a_tea_cup.jpg',
  },
  'Spoon cottage cheese into a bowl.': {
    file: 'photos/cottage-cheese-bowl.jpg',
    credit: '\u0412\u0430\u043B\u0435\u043D\u0442\u0438\u043D\u0430 \u0422\u0438\u043C\u043A\u0456\u0432, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:02._varenyky_with_cheese_-_crush_cottage_cheese.jpg',
  },
  'Spread cream cheese on both halves.': {
    file: 'photos/cream-cheese-bagel.jpg',
    credit: 'Renee Comet, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:NCI_cream_cheese_bagel.jpg',
  },
  'Roll it up tight and wrap it in a paper towel to eat on the way out.': {
    file: 'photos/egg-wrap.jpg',
    credit: 'Cajsa Lilliehook from Portland, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bacon_Kale_Breakfast_Burrito_(8429773809).jpg',
  },
  'Top with berries.': {
    file: 'photos/oatmeal-berries.jpg',
    credit: 'Shisma, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Oatmeal_porridge_with_fruits.jpg',
  },
  'Slide the egg on top of the rice.': {
    file: 'photos/egg-on-rice.jpg',
    credit: 'Neodymium+Nd, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Steamed_rice_with_char_siu_and_fried_egg.jpg',
  },
  'Slice an apple into wedges.': {
    file: 'photos/apple-slicer.jpg',
    credit: 'Vicki Nunn, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:AppleCorer%26Slicer.JPG',
  },
  'Peel them under a little running water.': {
    file: 'photos/peeled-eggs.jpg',
    credit: 'HungryHuy, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Hard_boiled_eggs_for_thit_heo_kho,_peeled.jpg',
  },
  'Stack it on crackers.': {
    file: 'photos/cheese-on-crackers.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Cheddar_cheese_and_Japanese_rice_crackers_with_black_sesame_and_soy_sauce_-_Massachusetts.jpg',
  },
  'Add jam on top.': {
    file: 'photos/toast-with-jam.jpg',
    credit: 'theblueli, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:HK_style_French_toast_with_blueberry_jam_2015.jpg',
  },
  'Spread jelly on the other slice.': {
    file: 'photos/pb-and-jelly-open.jpg',
    credit: 'JefferyGoldman, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut_Butter_and_Jelly_Sandwich.jpg',
  },
  'Press together and cut in half if you like.': {
    file: 'photos/pb-and-jelly-sandwich.jpg',
    credit: 'Evan-Amos, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut-Butter-Jelly-Sandwich.jpg',
  },
  'Blend or shake well.': {
    file: 'photos/protein-shaker.jpg',
    credit: 'Sandstein, CC BY 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Protein_shake.jpg',
  },
  'Toast two frozen waffles until crisp.': {
    file: 'photos/waffles.jpg',
    credit: 'Nenad Stojkovic, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Waffles_on_a_tray_with_two_small_glass_bowls_of_fruit_glaze_-_51642490145.jpg',
  },
  'Top with a second slice and eat.': {
    file: 'photos/turkey-sandwich.jpg',
    credit: 'Djoker180, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Turkey_and_cheese_sandwich.jpg',
  },
  'Add sliced tomato, salt and pepper.': {
    file: 'photos/tomato-on-toast.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Tunafish_and_Emmenthaler_cheese_sandwich_with_tomato_and_black_pepper_on_multigrain_toast_-_Massachusetts.jpg',
  },
  'Cut into wedges.': {
    file: 'photos/quesadilla-cut.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Chicken_quesadilla_-_Massachusetts.jpg',
  },
  'Fold in half and slide onto a plate.': {
    file: 'photos/omelet-on-plate.jpg',
    credit: 'HaJunkiyada, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Israeli_omelet_with_chopped_salad_and_coleslaw.jpg',
  },
  'Roll it up tight.': {
    file: 'photos/burritos.jpg',
    credit: 'Levi bernardo, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Burrito_chihuahuense_de_chile_verde.jpg',
  },
  'Plate together and season.': {
    file: 'photos/hash-brown-plate.jpg',
    credit: 'Ceeseven, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Full_breakfast_with_Fried_egg,_Pork_patty,_Bacon,_Pork_sausage,_Roasted_tomato,_Hash_brown_and_Mushrooms.jpg',
  },
  'Pour in small circles and cook until bubbles form, then flip.': {
    file: 'photos/pancake-bubbles.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2020-08-08_21_06_09_Blueberry_pancake_batter_a_few_minutes_after_being_poured_on_a_hot_pan_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
  },
  'Whisk an egg with a splash of milk and a pinch of cinnamon.': {
    file: 'photos/beaten-eggs.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2024-06-16_10_19_54_The_contents_of_two_chicken_eggs_after_being_whisked_in_a_bowl_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg',
  },
  'Whisk two eggs with a splash of milk and a pinch of salt.': {
    file: 'photos/beaten-eggs.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2024-06-16_10_19_54_The_contents_of_two_chicken_eggs_after_being_whisked_in_a_bowl_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg',
  },
  'Whisk two eggs with salt and pepper.': {
    file: 'photos/beaten-eggs.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2024-06-16_10_19_54_The_contents_of_two_chicken_eggs_after_being_whisked_in_a_bowl_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg',
  },
  'Fry in a buttered pan 2 minutes a side until golden.': {
    file: 'photos/french-toast-pan.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2024-06-16_10_26_07_Cooked_slices_of_Italian_bread_on_a_pan_after_being_soaked_in_the_contents_of_two_chicken_eggs_which_were_whisked_in_a_bowl_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg',
  },
  'Spread peanut butter while it\u2019s still hot, so it melts a little.': {
    file: 'photos/peanut-butter-toast.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut_butter_on_cinnamon_raisin_toast_-_Massachusetts.jpg',
  },
  'Drizzle honey over the top.': {
    file: 'photos/yogurt-honey.jpg',
    credit: 'LeonardKong, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Muesli,_Fresh_Fruit,_Honey_%26_Yogurt_(9646801012).jpg',
  },
  'Spread mashed avocado on the toast.': {
    file: 'photos/avocado-toast.jpg',
    credit: 'Jami430, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Avocado_toast_with_sesame_seeds.jpg',
  },
  'Top with whatever fruit is closest to going bad.': {
    file: 'photos/yogurt-in-bowl.jpg',
    credit: 'Jumbocombo0811, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Yogurt_fruit_bowl.jpg',
  },
  'Add a handful of granola or oats.': {
    file: 'photos/yogurt-honey.jpg',
    credit: 'LeonardKong, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Muesli,_Fresh_Fruit,_Honey_%26_Yogurt_(9646801012).jpg',
  },
  'Eat standing up if you have to.': {
    file: 'photos/breakfast-to-go.jpg',
    credit: 'Mack Male from Edmonton, AB, Canada, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Breakfast_on_the_go_(2125501639).jpg',
  },
  'Spread nut butter along one side with a knife, straight from the jar.': {
    file: 'photos/nut-butter-banana.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut_butter_and_banana_on_toasted_homemade_bread_-_Massachusetts.jpg',
  },
  'Eat it like a very inefficient sandwich.': {
    file: 'photos/nut-butter-banana.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut_butter_and_banana_on_toasted_homemade_bread_-_Massachusetts.jpg',
  },
  'Blend for 20 seconds.': {
    file: 'photos/blender-fruit.jpg',
    credit: 'SSEKYANZI ANDREW DAISY MUSOKE NKURUKIYE, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:In_the_blender_the_smoothie_is_almost_ready.jpg',
  },
  'Rinse the blender jar now before it dries on.': {
    file: 'photos/blender-jar.jpg',
    credit: 'Anna Powell, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Vitamix_5200_Classic_Blender.jpg',
  },
  'Take the jar out of the fridge.': {
    file: 'photos/fridge-open.jpg',
    credit: 'W.carter, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Open_refrigerator_with_food_at_night.jpg',
  },
  'Stir once.': {
    file: 'photos/porridge-spoon.jpg',
    credit: 'Keypunch, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bowl_of_porridge_with_spoon.jpg',
  },
  'Take 2 egg muffins from the fridge.': {
    file: 'photos/egg-sausage-cups.jpg',
    credit: 'Kelly Sue, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Egg_%26_Sausage_Cups.jpg',
  },
  'Microwave 45\u201360 seconds.': {
    file: 'photos/egg-sausage-cups.jpg',
    credit: 'Kelly Sue, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Egg_%26_Sausage_Cups.jpg',
  },
  'Eat with your hands, in the car if needed.': {
    file: 'photos/breakfast-to-go.jpg',
    credit: 'Mack Male from Edmonton, AB, Canada, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Breakfast_on_the_go_(2125501639).jpg',
  },
  'Toast the bread.': {
    file: 'photos/toast-in-toaster.jpg',
    credit: 'Kansattica, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bread_sticking_out_of_toaster.jpg',
  },
  'Slice half a banana on top.': {
    file: 'photos/banana-slices-bowl.jpg',
    credit: 'Alabama Extension, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Cut_Bananas.jpg',
  },
  'Fold in half and eat like a taco if you\u2019re walking out the door.': {
    file: 'photos/pb-and-jelly-sandwich.jpg',
    credit: 'Evan-Amos, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut-Butter-Jelly-Sandwich.jpg',
  },
  'Melt butter in a pan over low heat.': {
    file: 'photos/butter-in-pan.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2020-04-12_19_01_17_Melting_butter_on_a_hot_pan_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
  },
  'Drop the bread in the toaster while the eggs finish.': {
    file: 'photos/toast-in-toaster.jpg',
    credit: 'Kansattica, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bread_sticking_out_of_toaster.jpg',
  },
  'Plate both together sit down for this one.': {
    file: 'photos/scrambled-sausage-plate.jpg',
    credit: 'Deans Charbal, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:French_toasts_and_scramble_eggs_at_Sneakers_Bistro,_Winooski,_Vermont.jpg',
  },
  'Pour cereal into a bowl.': {
    file: 'photos/cereal-bowl.jpg',
    credit: 'SomeBodyAnyBody05, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Fiber_One_in_a_bowl_with_milk_and_a_spoon.jpg',
  },
  'Done. This one barely needs instructions.': {
    file: 'photos/cereal-with-milk.jpg',
    credit: 'The Eloquent Peasant, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bowl_of_cereal_and_milk.jpg',
  },
  'Give it a stir \u2014 it thickens overnight.': {
    file: 'photos/porridge-spoon.jpg',
    credit: 'Keypunch, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bowl_of_porridge_with_spoon.jpg',
  },
  'Top with a handful of berries.': {
    file: 'photos/berries-and-cream.jpg',
    credit: 'Anna, CC BY 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Summer_Desert_(176103799).jpeg',
  },
  'Slice the bagel in half.': {
    file: 'photos/bagel-halves.jpg',
    credit: 'Mx. Granger, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Miyoko%27s_Creamery_-_three_vegan_cheeses.jpg',
  },
  'Toast it while you get dressed.': {
    file: 'photos/toasted-bagel.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Salt_bagel,_toasted_-_Massachusetts.jpg',
  },
  'Mash the avocado in a bowl. Halve it, scoop it out, mash roughly with a fork.': {
    file: 'photos/guacamole.jpg',
    credit: 'Nikodem Nijaki, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Guacamole_IMGP1271.jpg',
  },
  'Salt, pepper, and a squeeze of lemon if you have one.': {
    file: 'photos/salt-pepper.jpg',
    credit: 'Josuiván Sierra Barrera, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Salt_and_pepper_by_Sierra.jpg',
  },
  'Whisk two eggs with a pinch of salt and scramble in a hot pan.': {
    file: 'photos/scrambled-in-pan.jpg',
    credit: 'Ramesh NG, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Egg_fry_-_Kerala_Style.jpg',
  },
  'Warm a tortilla in the same pan for 20 seconds a side.': {
    file: 'photos/tortilla.jpg',
    credit: 'Vigilantcosmicpenguin, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Corn_tortilla_and_flour_tortilla.jpg',
  },
  'Pile it all into the tortilla. The eggs, a handful of cheese and any leftover veg.': {
    file: 'photos/egg-wrap.jpg',
    credit: 'Cajsa Lilliehook from Portland, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bacon_Kale_Breakfast_Burrito_(8429773809).jpg',
  },
  'Combine oats and milk or water in a microwave-safe bowl.': {
    file: 'photos/oats-and-milk.jpg',
    credit: 'Federica Diliberto federyka, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Healthy_Breakfast_(Unsplash).jpg',
  },
  'Microwave 90 seconds, stir, then another 60 seconds.': {
    file: 'photos/microwave-oven.jpg',
    credit: 'Wrightmt, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:Microwave_oven_flashon.jpg',
  },
  'Stir in a spoon of peanut butter while it\u2019s hot.': {
    file: 'photos/porridge-spoon.jpg',
    credit: 'Keypunch, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Bowl_of_porridge_with_spoon.jpg',
  },
  'Slice banana on top.': {
    file: 'photos/oatmeal-banana.jpg',
    credit: 'Shisma, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Banana_oatmeal.jpg',
  },
  'Microwave leftover rice for a minute to loosen it up.': {
    file: 'photos/cooked-rice.jpg',
    credit: 'Douglas Perkins, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:A_bowl_of_rice.jpg',
  },
  'Fry an egg in a hot pan while the rice heats.': {
    file: 'photos/egg-in-pan.jpg',
    credit: 'Horacio Cambeiro, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Fried_egg_cooking_in_a_pan.jpg',
  },
  'Splash on soy sauce or hot sauce and eat straight from the bowl.': {
    file: 'photos/soy-sauce.jpg',
    credit: 'Creative Tools, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Kikkoman_soysauce.jpg',
  },
  'Add a handful of nuts and eat.': {
    file: 'photos/mixed-nuts.jpg',
    credit: 'HaJunkiyada, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Mixed_nuts_and_dried_fruit.jpg',
  },
  'Put a spoonful of peanut butter on the side for dipping.': {
    file: 'photos/peanut-butter-toast.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut_butter_on_cinnamon_raisin_toast_-_Massachusetts.jpg',
  },
  'Take two boiled eggs from the fridge.': {
    file: 'photos/fridge-open.jpg',
    credit: 'W.carter, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Open_refrigerator_with_food_at_night.jpg',
  },
  'Add salt and pepper.': {
    file: 'photos/salt-pepper.jpg',
    credit: 'Josuiván Sierra Barrera, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Salt_and_pepper_by_Sierra.jpg',
  },
  'Slice or break off some cheese.': {
    file: 'photos/cheese-and-knife.jpg',
    credit: 'Peachyeung316, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Parmesan_Slices_with_Small_Knife.jpg',
  },
  'Add a piece of fruit if you have one.': {
    file: 'photos/fruit-cheese-plate.jpg',
    credit: 'HaJunkiyada, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Crackers,_fruit,_nuts,_and_cheeses_plate.jpg',
  },
  'Spread butter while it is hot.': {
    file: 'photos/butter-in-pan.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2020-04-12_19_01_17_Melting_butter_on_a_hot_pan_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
  },
  'Spread peanut butter on one slice of bread.': {
    file: 'photos/peanut-butter-toast.jpg',
    credit: 'Daderot, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Peanut_butter_on_cinnamon_raisin_toast_-_Massachusetts.jpg',
  },
  'Pour the oatmeal packet into a bowl and add hot water or milk.': {
    file: 'photos/oatmeal-dry-oats.jpg',
    credit: 'Mx. Granger, CC0',
    link: 'https://commons.wikimedia.org/wiki/File:Quaker_apples_%26_cinnamon_instant_oatmeal_2.jpg',
  },
  'Microwave or wait a minute, then stir.': {
    file: 'photos/microwave-oven.jpg',
    credit: 'Wrightmt, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:Microwave_oven_flashon.jpg',
  },
  'Drink it on the way out.': {
    file: 'photos/protein-shaker.jpg',
    credit: 'Sandstein, CC BY 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Protein_shake.jpg',
  },
  'Top with sliced fruit.': {
    file: 'photos/waffles.jpg',
    credit: 'Nenad Stojkovic, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Waffles_on_a_tray_with_two_small_glass_bowls_of_fruit_glaze_-_51642490145.jpg',
  },
  'Add syrup or yogurt if you like.': {
    file: 'photos/waffles-syrup.jpg',
    credit: 'TheCulinaryGeek, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Waffles_with_maple_syrup_and_butter_on_a_white_plate.jpg',
  },
  'Crack two eggs into a mug and add a splash of milk and a pinch of salt.': {
    file: 'photos/cracking-egg-bowl.jpg',
    credit: 'USDAgov, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:Kids_Cooking_(Team_Nutrition)_(20210820-FNS-UNC-0039).jpg',
  },
  'Stir in cheese or leftover veg.': {
    file: 'photos/cheese-and-peppers.jpg',
    credit: 'Personal Creations, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Chopped_veggies_and_shredded_cheese_in_a_bowl_(14980801713).jpg',
  },
  'Microwave 60 seconds, stir, then 30 more seconds until set.': {
    file: 'photos/egg-sausage-cups.jpg',
    credit: 'Kelly Sue, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Egg_%26_Sausage_Cups.jpg',
  },
  'Spread hummus on top.': {
    file: 'photos/hummus-on-bread.jpg',
    credit: 'MichaelOpdenacker, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Houmous_on_Paleo_bread.jpg',
  },
  'Add sliced cucumber or tomato and a pinch of salt.': {
    file: 'photos/veggie-sandwich.jpg',
    credit: 'Jennifer from Vancouver, Canada, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Toasted_tomato,_avocado,_cucumber_and_hummus_sandwich_(4815088397).jpg',
  },
  'Layer turkey and cheese on a slice of bread.': {
    file: 'photos/ham-cheese-sandwich.jpg',
    credit: 'jeffreyw, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Homemade_sandwich.jpg',
  },
  'Add mustard or lettuce if you have it.': {
    file: 'photos/sandwich-lettuce.jpg',
    credit: 'jeffreyw, CC BY 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Submarine_sandwich_with_toppings_and_dijon_mustard.jpg',
  },
  'Lay slices of cheese on the warm toast.': {
    file: 'photos/cheese-toast.jpg',
    credit: 'Rainer Z ..., CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Toast_Hawaii_RZ.jpg',
  },
  'Heat a dry pan over medium heat.': {
    file: 'photos/frying-pan-stove.jpg',
    credit: 'Jim Stonos, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Stainless_Steel_Frying_Pan.jpg',
  },
  'Put a tortilla in the pan and cover half with cheese.': {
    file: 'photos/tortilla.jpg',
    credit: 'Vigilantcosmicpenguin, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Corn_tortilla_and_flour_tortilla.jpg',
  },
  'Fold it over and cook 2 minutes a side until golden.': {
    file: 'photos/quesadilla-cheese-pull.jpg',
    credit: 'Shaili Sharma, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Veg_Quesadilla_a_Mexican_dish_-_Gujarat_-_SHAILI_009.jpg',
  },
  'Soften chopped veg in a buttered pan for a minute.': {
    file: 'photos/veg-in-pan.jpg',
    credit: 'Robert Loescher, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Veggie_Stirfry_in_the_pan.jpg',
  },
  'Pour in the eggs and let them set for 2 minutes.': {
    file: 'photos/omelet-cooking.jpg',
    credit: 'Carldecanada, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Omelette.jpg',
  },
  'Warm canned or leftover beans in a pan or the microwave.': {
    file: 'photos/beans-pot.jpg',
    credit: 'Infrogmation of New Orleans, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Red_beans_cooking_in_a_pot,_New_Orleans.jpg',
  },
  'Scramble an egg if you want one.': {
    file: 'photos/scrambled-in-pan.jpg',
    credit: 'Ramesh NG, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Egg_fry_-_Kerala_Style.jpg',
  },
  'Pile beans, egg and cheese on a tortilla.': {
    file: 'photos/burritos.jpg',
    credit: 'Levi bernardo, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Burrito_chihuahuense_de_chile_verde.jpg',
  },
  'Heat oil in a pan and add frozen hash browns.': {
    file: 'photos/butter-in-pan.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2020-04-12_19_01_17_Melting_butter_on_a_hot_pan_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
  },
  'Cook 8 minutes, flipping once, until crisp.': {
    file: 'photos/hash-brown-plate.jpg',
    credit: 'Ceeseven, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Full_breakfast_with_Fried_egg,_Pork_patty,_Bacon,_Pork_sausage,_Roasted_tomato,_Hash_brown_and_Mushrooms.jpg',
  },
  'Fry an egg in a second pan or push the hash browns aside.': {
    file: 'photos/egg-in-pan.jpg',
    credit: 'Horacio Cambeiro, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Fried_egg_cooking_in_a_pan.jpg',
  },
  'Dip each bread slice in the mixture on both sides.': {
    file: 'photos/beaten-eggs.jpg',
    credit: 'Famartin, CC BY-SA 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:2024-06-16_10_19_54_The_contents_of_two_chicken_eggs_after_being_whisked_in_a_bowl_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg',
  },
  'Serve with syrup or fruit.': {
    file: 'photos/french-toast-plate.jpg',
    credit: 'Kim Scarborough from Chicago, IL, CC BY-SA 2.0',
    link: 'https://commons.wikimedia.org/wiki/File:Stuffed_French_Toast_(Ear_Wax_Cafe)_(485750003).jpg',
  },
  'Stir pancake mix with water or milk until just combined.': {
    file: 'photos/batter-stirring.jpg',
    credit: 'USDAgov, Public domain',
    link: 'https://commons.wikimedia.org/wiki/File:Kids_Cooking_(Team_Nutrition)_(20210820-FNS-UNC-0027).jpg',
  },
  'Heat a lightly oiled pan over medium heat.': {
    file: 'photos/nonstick-pan.jpg',
    credit: 'User:Lcarsdata, CC BY-SA 3.0',
    link: 'https://commons.wikimedia.org/wiki/File:Frying_pan_with_black_handle.jpg',
  },
  'Cook another minute and stack on a plate.': {
    file: 'photos/pancake-stack.jpg',
    credit: 'Shisma, CC BY 4.0',
    link: 'https://commons.wikimedia.org/wiki/File:Pancake_stack_3.jpg',
  },
};

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
        detail: 'Oats, milk, yogurt or chia. Put in the fridge.',
      },
      {
        id: 'lib-chia',
        icon: '\uD83E\uDD44',
        text: 'Make **chia pudding** in a jar',
        detail: 'Put it in the fridge.',
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
