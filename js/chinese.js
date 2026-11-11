import { MAX_MINUTES } from './breakfasts.js';
import { haveEntries, INGREDIENT_GROUPS, ownFoods } from './ingredients.js';

// Chinese words that go under the English ones. Only some breakfasts have them so far.
// Steps are found by their English words (without the bar that splits big and small words).
export const chineseNames = {
  'yogurt-bowl': '酸奶配水果和一把燕麦脆',
  'banana-nut-butter': '香蕉配坚果酱',
  smoothie: '边走边喝的果昔',
  'toast-egg': '煎蛋吐司',
  'overnight-oats': '隔夜燕麦（前一晚做好）',
  'egg-muffins': '加热蛋杯（提前批量做好）',
  'pb-toast': '花生酱香蕉吐司',
  'proper-eggs': '悠闲享用的炒蛋配吐司',
  cereal: '牛奶麦片',
  'chia-pudding': '奇亚籽布丁（前一晚做好）',
  'cottage-cheese': '茅屋芝士配莓果和蜂蜜',
  'bagel-cream-cheese': '奶油芝士贝果',
  'avocado-toast': '牛油果吐司',
  'breakfast-wrap': '炒蛋早餐卷饼',
  'pb-banana-oats': '微波花生酱香蕉燕麦粥',
  'leftovers-bowl': '剩米饭煎蛋饭',
  'greek-yogurt-honey': '希腊酸奶配蜂蜜和坚果',
  'apple-pb': '苹果片蘸花生酱',
  'boiled-eggs': '水煮蛋（需提前煮好）',
  'cheese-crackers': '芝士配饼干',
  'toast-jam': '黄油果酱吐司',
  'pb-jelly': '花生酱果酱三明治',
  'instant-oatmeal': '速食燕麦片配莓果',
  'protein-shake': '牛奶香蕉蛋白粉奶昔',
  'frozen-waffles': '冷冻华夫饼配水果',
  'mug-omelet': '微波马克杯蛋饼',
  'hummus-toast': '鹰嘴豆泥蔬菜吐司',
  'turkey-cheese': '火鸡肉芝士三明治',
  'tomato-cheese-toast': '番茄芝士吐司',
  'cheese-quesadilla': '墨西哥芝士饼',
  'bacon-egg-sandwich': '培根煎蛋三明治',
  'veggie-omelet': '蔬菜煎蛋卷',
  'bean-burrito': '芝士豆子早餐卷饼',
  'hash-brown-egg': '薯饼配煎蛋',
  'french-toast': '法式吐司',
  pancakes: '预拌粉松饼',
};

// Each step has the big Chinese words, and the small ones when the English has small words too.
export const chineseSteps = {
  'Drop bread in the toaster.': { main: '把面包放进烤面包机。', extra: '' },
  'Crack an egg into a hot pan lightly oiled.': { main: '把鸡蛋打入热锅。', extra: '锅里先刷一层薄油。' },
  'Cook 2–3 minutes until the white sets; flip if you like it firm.': {
    main: '煎 2–3 分钟。',
    extra: '煎到蛋白凝固，想吃全熟就翻面。',
  },
  'Slide the egg onto the toast salt it, done.': { main: '把煎蛋盛到吐司上。', extra: '撒点盐，就好了。' },
  'Take two boiled eggs from the fridge.': { main: '从冰箱里拿出两个煮好的鸡蛋。', extra: '' },
  'Peel them under a little running water.': { main: '在流水下剥蛋壳。', extra: '' },
  'Add salt and pepper.': { main: '撒点盐和胡椒粉。', extra: '' },
  'Spoon yogurt into a bowl.': { main: '舀几勺酸奶到碗里。', extra: '' },
  'Top with whatever fruit is closest to going bad.': { main: '再放上水果。', extra: '挑最快放坏的那种。' },
  'Add a handful of granola or oats.': { main: '撒一小把燕麦脆或燕麦片。', extra: '' },
  'Eat standing up if you have to.': { main: '站着吃也行。', extra: '赶时间的话。' },
  'Peel banana.': { main: '剥开香蕉。', extra: '' },
  'Spread nut butter along one side with a knife, straight from the jar.': { main: '沿着香蕉一侧抹上坚果酱。', extra: '用刀从罐子里直接挖。' },
  'Eat it like a very inefficient sandwich.': { main: '就当它是个不太方便的三明治吃。', extra: '' },
  'Throw everything into the blender. Frozen fruit, a splash of milk and a spoon of yogurt.': { main: '把材料都倒进搅拌机。', extra: '冷冻水果、一点牛奶和一勺酸奶。' },
  'Blend for 20 seconds.': { main: '搅打 20 秒。', extra: '' },
  'Pour into the cup you’ll actually carry out the door.': { main: '倒进杯子里。', extra: '用你真会带出门的那一个。' },
  'Rinse the blender jar now before it dries on.': { main: '现在就把搅拌杯冲干净。', extra: '免得干在上面。' },
  'Take the jar out of the fridge.': { main: '从冰箱里拿出罐子。', extra: '' },
  'Stir once.': { main: '搅拌一下。', extra: '' },
  'Eat straight from the jar, or pour into a bowl if you’re feeling fancy.': { main: '直接对着罐子吃。', extra: '想讲究点，也可以倒进碗里。' },
  'Take 2 egg muffins from the fridge.': { main: '从冰箱里拿出 2 个蛋杯。', extra: '' },
  'Microwave 45–60 seconds.': { main: '微波加热 45–60 秒。', extra: '' },
  'Eat with your hands, in the car if needed.': { main: '用手拿着吃，车上也行。', extra: '需要的话。' },
  'Toast the bread.': { main: '把面包烤一下。', extra: '' },
  'Spread peanut butter while it’s still hot, so it melts a little.': { main: '抹上花生酱。', extra: '趁面包还热，花生酱会化开一点。' },
  'Slice half a banana on top.': { main: '在上面放半根切片香蕉。', extra: '' },
  'Fold in half and eat like a taco if you’re walking out the door.': { main: '对折起来。', extra: '赶着出门的话，像塔可饼那样拿着吃。' },
  'Whisk two eggs with a splash of milk and a pinch of salt.': { main: '打散两个鸡蛋。', extra: '加一点牛奶和一小撮盐。' },
  'Melt butter in a pan over low heat.': { main: '在锅里化开黄油。', extra: '用小火。' },
  'Pour in eggs, stir slowly and often until just set.': { main: '倒入蛋液，慢慢多翻拌。', extra: '炒到刚刚凝固就好。' },
  'Drop the bread in the toaster while the eggs finish.': { main: '把面包放进烤面包机。', extra: '这时鸡蛋也快好了。' },
  'Plate both together sit down for this one.': { main: '一起装盘。', extra: '这一顿坐下来慢慢吃。' },
  'Pour cereal into a bowl.': { main: '把麦片倒进碗里。', extra: '' },
  'Add milk.': { main: '倒入牛奶。', extra: '' },
  'Done. This one barely needs instructions.': { main: '好了。', extra: '这个几乎不用看步骤。' },
  'Give it a stir — it thickens overnight.': { main: '搅拌一下。', extra: '放了一夜，它会变稠。' },
  'Eat straight from the jar or add fruit on top.': { main: '直接对着罐子吃。', extra: '也可以在上面加点水果。' },
  'Spoon cottage cheese into a bowl.': { main: '舀一些茅屋芝士到碗里。', extra: '' },
  'Top with a handful of berries.': { main: '放上一小把莓果。', extra: '' },
  'Drizzle honey over the top.': { main: '淋上蜂蜜。', extra: '' },
  'Slice the bagel in half.': { main: '把贝果横切成两半。', extra: '' },
  'Toast it while you get dressed.': { main: '烤一下。', extra: '趁你换衣服的时候。' },
  'Spread cream cheese on both halves.': { main: '两半都抹上奶油芝士。', extra: '' },
  'Mash the avocado in a bowl. Halve it, scoop it out, mash roughly with a fork.': { main: '在碗里把牛油果捣碎。', extra: '对半切开，挖出果肉，用叉子粗粗捣烂。' },
  'Spread mashed avocado on the toast.': { main: '把牛油果泥抹在吐司上。', extra: '' },
  'Salt, pepper, and a squeeze of lemon if you have one.': { main: '撒盐和胡椒，挤一点柠檬汁。', extra: '家里有柠檬的话。' },
  'Whisk two eggs with a pinch of salt and scramble in a hot pan.': { main: '打散两个鸡蛋。', extra: '加一小撮盐，在热锅里炒熟。' },
  'Warm a tortilla in the same pan for 20 seconds a side.': { main: '就在这个锅里加热一张墨西哥薄饼。', extra: '每面 20 秒。' },
  'Pile it all into the tortilla. The eggs, a handful of cheese and any leftover veg.': { main: '把所有料都放到薄饼上。', extra: '炒蛋、一小把芝士和剩下的蔬菜。' },
  'Roll it up tight and wrap it in a paper towel to eat on the way out.': { main: '卷紧。', extra: '再用厨房纸包好，出门路上吃。' },
  'Combine oats and milk or water in a microwave-safe bowl.': { main: '把燕麦和牛奶（或水）混在一起。', extra: '放进能微波的碗里。' },
  'Microwave 90 seconds, stir, then another 60 seconds.': { main: '微波 90 秒，搅一搅。', extra: '再微波 60 秒。' },
  'Stir in a spoon of peanut butter while it’s hot.': { main: '加一勺花生酱拌匀。', extra: '趁热拌。' },
  'Slice banana on top.': { main: '在上面放香蕉片。', extra: '' },
  'Microwave leftover rice for a minute to loosen it up.': { main: '把剩米饭微波 1 分钟。', extra: '让饭粒松开。' },
  'Fry an egg in a hot pan while the rice heats.': { main: '在热锅里煎一个蛋。', extra: '趁饭在加热的时候。' },
  'Slide the egg on top of the rice.': { main: '把煎蛋盛起来。', extra: '放到米饭上面。' },
  'Splash on soy sauce or hot sauce and eat straight from the bowl.': { main: '淋上酱油或辣酱。', extra: '然后端着碗直接吃。' },
  'Spoon Greek yogurt into a bowl.': { main: '舀几勺希腊酸奶到碗里。', extra: '' },
  'Add a handful of nuts and eat.': { main: '加一小把坚果，开吃。', extra: '' },
  'Slice an apple into wedges.': { main: '把苹果切成瓣。', extra: '' },
  'Put a spoonful of peanut butter on the side for dipping.': { main: '放一勺花生酱。', extra: '放在旁边蘸着吃。' },
  'Slice or break off some cheese.': { main: '切一些芝士，或掰一小块。', extra: '' },
  'Stack it on crackers.': { main: '把芝士叠在饼干上。', extra: '' },
  'Add a piece of fruit if you have one.': { main: '再加一块水果。', extra: '家里有的话。' },
  'Spread butter while it is hot.': { main: '抹上黄油。', extra: '趁面包还热。' },
  'Add jam on top.': { main: '再抹上果酱。', extra: '' },
  'Spread peanut butter on one slice of bread.': { main: '抹上花生酱。', extra: '涂在其中一片面包上。' },
  'Spread jelly on the other slice.': { main: '在另一片面包上抹果酱。', extra: '' },
  'Press together and cut in half if you like.': { main: '合起来，切成两半。', extra: '喜欢的话。' },
  'Pour the oatmeal packet into a bowl and add hot water or milk.': { main: '把速食燕麦包倒进碗里。', extra: '加热水或牛奶。' },
  'Microwave or wait a minute, then stir.': { main: '微波一下，或等一分钟。', extra: '然后搅一搅。' },
  'Top with berries.': { main: '放上莓果。', extra: '' },
  'Add it all to a blender or shaker. Milk, a banana and a scoop of protein powder.': { main: '全部放进搅拌机或摇摇杯。', extra: '牛奶、一根香蕉和一勺蛋白粉。' },
  'Blend or shake well.': { main: '搅匀或摇匀。', extra: '' },
  'Drink it on the way out.': { main: '出门时边走边喝。', extra: '' },
  'Toast two frozen waffles until crisp.': { main: '把两块冷冻华夫饼烤一下。', extra: '烤到酥脆。' },
  'Top with sliced fruit.': { main: '放上水果片。', extra: '' },
  'Add syrup or yogurt if you like.': { main: '淋上糖浆或加点酸奶。', extra: '喜欢的话。' },
  'Crack two eggs into a mug and add a splash of milk and a pinch of salt.': { main: '把两个鸡蛋打进马克杯。', extra: '加一点牛奶和一小撮盐。' },
  'Stir in cheese or leftover veg.': { main: '加入芝士或剩下的蔬菜，拌一拌。', extra: '' },
  'Microwave 60 seconds, stir, then 30 more seconds until set.': { main: '微波 60 秒，搅一搅。', extra: '再微波 30 秒，直到凝固。' },
  'Spread hummus on top.': { main: '在上面抹鹰嘴豆泥。', extra: '' },
  'Add sliced cucumber or tomato and a pinch of salt.': { main: '放上黄瓜片或番茄片。', extra: '再撒一小撮盐。' },
  'Layer turkey and cheese on a slice of bread.': { main: '把火鸡肉和芝士叠起来。', extra: '放在一片面包上。' },
  'Add mustard or lettuce if you have it.': { main: '加芥末酱或生菜。', extra: '家里有的话。' },
  'Top with a second slice and eat.': { main: '盖上第二片面包，开吃。', extra: '' },
  'Lay slices of cheese on the warm toast.': { main: '铺上几片芝士。', extra: '放在热吐司上。' },
  'Add sliced tomato, salt and pepper.': { main: '放上番茄片，撒盐和胡椒。', extra: '' },
  'Heat a dry pan over medium heat.': { main: '用中火把干锅烧热。', extra: '' },
  'Put a tortilla in the pan and cover half with cheese.': { main: '把一张薄饼放进锅里。', extra: '一半铺上芝士。' },
  'Fold it over and cook 2 minutes a side until golden.': { main: '对折起来。', extra: '每面煎 2 分钟，煎到金黄。' },
  'Cut into wedges.': { main: '切成三角块。', extra: '' },
  'Cook two strips of bacon in a pan until crisp, then set aside.': { main: '煎两片培根。', extra: '用平底锅煎到酥脆，盛出备用。' },
  'Fry an egg in the same pan.': { main: '在同一个锅里煎一个蛋。', extra: '' },
  'Toast bread or a bun.': { main: '烤一下面包或小圆面包。', extra: '' },
  'Stack the bacon and egg between the bread.': { main: '把培根和煎蛋叠起来。', extra: '夹在面包中间。' },
  'Whisk two eggs with salt and pepper.': { main: '打散两个鸡蛋，加盐和胡椒。', extra: '' },
  'Soften chopped veg in a buttered pan for a minute.': { main: '在抹了黄油的锅里把蔬菜碎炒软。', extra: '炒 1 分钟。' },
  'Pour in the eggs and let them set for 2 minutes.': { main: '倒入蛋液。', extra: '静置 2 分钟，让它凝固。' },
  'Fold in half and slide onto a plate.': { main: '对折起来。', extra: '滑到盘子里。' },
  'Warm canned or leftover beans in a pan or the microwave.': { main: '把罐头豆子或剩豆子加热。', extra: '用平底锅或微波炉。' },
  'Scramble an egg if you want one.': { main: '炒一个蛋。', extra: '想吃的话。' },
  'Pile beans, egg and cheese on a tortilla.': { main: '把豆子、鸡蛋和芝士放好。', extra: '都放在薄饼上。' },
  'Roll it up tight.': { main: '卷紧。', extra: '' },
  'Heat oil in a pan and add frozen hash browns.': { main: '锅里加油烧热。', extra: '放入冷冻薯饼。' },
  'Cook 8 minutes, flipping once, until crisp.': { main: '煎 8 分钟，中途翻一次。', extra: '煎到酥脆。' },
  'Fry an egg in a second pan or push the hash browns aside.': { main: '在另一个锅里煎一个蛋。', extra: '或者把薯饼推到一边煎。' },
  'Plate together and season.': { main: '一起装盘，调味。', extra: '' },
  'Whisk an egg with a splash of milk and a pinch of cinnamon.': { main: '打散一个鸡蛋。', extra: '加一点牛奶和一小撮肉桂粉。' },
  'Dip each bread slice in the mixture on both sides.': { main: '把每片面包都蘸上蛋液。', extra: '两面都蘸到。' },
  'Fry in a buttered pan 2 minutes a side until golden.': { main: '放进抹了黄油的锅里煎。', extra: '每面煎 2 分钟，煎到金黄。' },
  'Serve with syrup or fruit.': { main: '配糖浆或水果吃。', extra: '' },
  'Stir pancake mix with water or milk until just combined.': { main: '把松饼预拌粉和水（或牛奶）拌在一起。', extra: '拌到刚好混匀。' },
  'Heat a lightly oiled pan over medium heat.': { main: '把平底锅刷一层薄油烧热。', extra: '用中火。' },
  'Pour in small circles and cook until bubbles form, then flip.': { main: '倒入小圆形面糊煎。', extra: '煎到冒泡，再翻面。' },
  'Cook another minute and stack on a plate.': { main: '再煎一分钟。', extra: '然后叠到盘子里。' },
};

// The Chinese words for a step ({ main, extra }), or null if it has none yet.
export function chineseForStep(text) {
  return Object.hasOwn(chineseSteps, text) ? chineseSteps[text] : null;
}

// Chinese words for the home page: the label by name.
export const chineseUi = {
  hero: '早晨不容易，早餐可以很简单。',
  kind: '想吃哪种？（可选）',
  favorites: '收藏',
  myKitchen: '我的厨房',
  kitchenEmpty: '你家里有什么？',
  kitchenItems: (count) => `${count} 样 · 点击修改`,
  onlyWhatIHave: '只看我有的',
  hideCantMake: '隐藏我做不了的',
  decide: '帮我决定',
  addBreakfast: '添加早餐',
  show: '查看早餐',
  setUpTonight: '今晚准备',
  doTonight: '今晚做这些。',
  saveTime: '明天省时间。',
  chooseTasks: '选择任务',
  changeOrder: '调整顺序',
  done: '完成',
  tags: { 'no-stove': '免开火', vegetarian: '素食', 'high-protein': '高蛋白', sweet: '甜口', savory: '咸口' },
};

// The Chinese for "3 of 5 done · 2 to go": { done, left }, like the English wording.
export function chineseProgress(done, total) {
  if (total === 0) return { done: '还没选任务', left: '点“选择任务”' };
  if (done >= total) return { done: `${total} 项全部完成`, left: '明天的准备好了' };
  return { done: `已完成 ${done}/${total}`, left: `还剩 ${total - done}` };
}

// The page class for each language choice lives in js/languages.js (it is used by the tests and the app from here).
export { languageClass } from './languages.js';

// Chinese for the fixed English words on the list and breakfast screens, found by the exact English.
export const chineseText = {
  'Change choices': '更改选择',
  'All matching breakfasts': '全部符合的早餐',
  'Up to\nminutes': '最多\n分钟',
  Any: '不限',
  Change: '更改',
  Previous: '上一页',
  Next: '下一页',
  'Show all breakfasts': '显示全部早餐',
  Ingredients: '食材',
  'Salt, oil and more': '盐、油等调料',
  Pause: '暂停',
  Resume: '继续',
  Reset: '重置',
  'Time is up. Eat!': '时间到，开吃！',
  'Delete this breakfast': '删除这份早餐',
  Yours: '我的',
  'Your kitchen:': '你的厨房：',
  'nothing yet': '还没有',
  'No favorites yet.': '还没有收藏。',
  'No match.': '没有符合的早餐。',
  'Tap \u2665 on a breakfast to save it here.': '点早餐上的 \u2665，就能收藏到这里。',
  'You can\u2019t make anything yet. Add more food in My kitchen.': '你现在还做不了任何一种。去“我的厨房”多选几样食材吧。',
  'Try more minutes or fewer filters.': '试试更多分钟，或少选几个条件。',
  'Change My kitchen': '更改我的厨房',
  '+ Add your own breakfast': '+ 添加我自己的早餐',
  'You can\u2019t make any yet.': '你现在还一种都做不了。',
  'Open \u201cAlmost there\u201d to see more.': '打开“快做好了”看看更多。',
  'Photo or video': '照片或视频',
  'Add your own breakfast': '添加我自己的早餐',
  'It is saved on this device.': '保存在这台设备上。',
  Name: '名称',
  Minutes: '时间（分钟）',
  Steps: '步骤',
  'e.g. Leftover pasta omelet': '例如：番茄鸡蛋面',
  'e.g. 10': '例如：10',
  'One step per line': '每行写一步',
  'Tags (optional)': '标签（可选）',
  'Food it uses (optional)': '用到的食材（可选）',
  'Tick what it uses.': '勾选它用到的食材。',
  'Then it shows with \u201cOnly what I have\u201d.': '这样它就会出现在“只看我有的”里。',
  'Save for later': '先保存',
  'Save and eat now': '保存并开始做',
  'Not saved. It will be lost if you reload.': '没保存成功。刷新后会丢失。',
  'Add a name.': '先写名称。',
  [`Enter minutes, 1 to ${MAX_MINUTES}.`]: `填写分钟数，1 到 ${MAX_MINUTES}。`,
  'Add a step. One per line.': '写一个步骤，每行一步。',
  Settings: '设置',
  Photo: '照片',
  Video: '视频',
  'Photo: ': '照片：',
  'Not playing?': '播放不了？',
  'Open the link in your browser.': '在浏览器里打开链接。',
  'Open link': '打开链接',
  Close: '关闭',
  'Change photo': '更换照片',
  'Add photo': '添加照片',
  'Paste a video link.': '粘贴视频链接。',
  'YouTube, Vimeo or a video file.': 'YouTube、Vimeo 或视频文件。',
  Save: '保存',
  'Use a YouTube, Vimeo or video link.': '请用 YouTube、Vimeo 或视频链接。',
  'No room left. Remove a photo.': '没有空间了。删掉一张照片。',
  'Not a photo.': '这不是照片。',
  'Could not read it.': '读不出来。',
  Picture: '图案',
  'Highlighted words': '重点词',
  'Tap words to highlight.': '点词语，标出重点。',
  'Or type an emoji': '或输入表情',
  'Use it': '使用',
  'Not an emoji. Try again.': '这不是表情，再试一次。',
  'If you did not tick one:': '没勾选调料时：',
  'Salt, oil, sugar and more.': '盐、油、糖等。',
  Optional: '可选',
  'Still show it.': '照样显示。',
  Required: '必须有',
  'Hide it.': '不显示。',
  'English only': '仅英文',
  'Chinese only': '仅中文',
  'French only': '仅法文',
  'English and Chinese': '中英对照',
  'English and French': '英法对照',
  'Write a food first.': '先写食材名称。',
  'Already in the list.': '列表里已经有了。',
  'My own foods': '我自己的食材',
  'Type a food, then tap Add.': '输入食材，再点“添加”。',
  'e.g. Kimchi': '例如：泡菜',
  'Any breakfast': '任何早餐',
  'Oats and jars': '燕麦和罐子',
  Eggs: '鸡蛋',
  'Toast and bread': '吐司和面包',
  Smoothies: '果昔',
  'Grab and go': '带着走',
  'Choose tasks': '选择任务',
  'Tap a line to add it.': '点一行就能加上。',
  'My own': '我自己的',
  'Pick from ideas': '从推荐里选',
  'Tap a line to turn it on or off.': '点一行，开或关。',
  'Remove deletes it.': '点“删除”会彻底删掉。',
  'Write your own lines here.': '在这里写你自己的任务。',
  Add: '添加',
  Done: '完成',
  Remove: '删除',
  Delete: '删除',
  Cancel: '取消',
  'You cannot undo this.': '删掉就找不回来了。',
  'Choose a picture': '选一个图案',
  'No tasks. Tap Choose tasks.': '还没有任务。点“选择任务”。',
  'Tap \u25B2 \u25BC to move a line.': '点 \u25B2 \u25BC 移动一行。',
  'Then tap Done.': '然后点“完成”。',
  Saved: '已保存',
  Added: '已添加',
  Removed: '已删除',
  'e.g. Thaw chicken': '例如：解冻鸡肉',
  'Write something first.': '先写点什么。',
  'Too long.': '太长了。',
  'Already on your list.': '清单里已经有了。',
  Edit: '编辑',
  '(missing)': '（缺）',
  'Missing:': '缺：',
  Back: '返回',
  'What\u2019s in your kitchen?': '你家里有什么？',
  'Tap what you have.': '点选你有的食材。',
  'Water is counted.': '水默认有，不用选。',
  'Clear all': '清空',
  'Tap what you have': '先点选你有的食材',
  'Show what I can make': '看看我能做什么',
  'Eggs and dairy': '蛋奶类',
  'Fruit and vegetables': '蔬菜水果',
  'Bread and grains': '面包和主食',
  'Spreads and extras': '酱料和配料',
  'Meat and beans': '肉类和豆类',
  'Cooking basics': '基础调味料',
  'Salt, oil, sugar and more. No worries if you miss some.': '盐、油、糖等。缺几样也没关系。',
};

// The Chinese for a fixed English text, or null if it has none yet.
export function chineseOf(english) {
  return Object.hasOwn(chineseText, english) ? chineseText[english] : null;
}

// Chinese names of foods, by ingredient id (items and kinds).
export const chineseFoods = {
  eggs: '鸡蛋',
  milk: '牛奶',
  'whole-milk': '全脂牛奶',
  'low-fat-milk': '低脂牛奶',
  'oat-milk': '燕麦奶',
  'almond-milk': '杏仁奶',
  'soy-milk': '豆浆',
  yogurt: '酸奶',
  'plain-yogurt': '原味酸奶',
  'greek-yogurt': '希腊酸奶',
  'flavored-yogurt': '风味酸奶',
  'cottage-cheese': '茅屋芝士',
  cheese: '芝士',
  cheddar: '切达芝士',
  mozzarella: '马苏里拉芝士',
  swiss: '瑞士芝士',
  'cream-cheese': '奶油芝士',
  butter: '黄油',
  'salted-butter': '有盐黄油',
  'unsalted-butter': '无盐黄油',
  banana: '香蕉',
  apple: '苹果',
  berries: '莓果',
  avocado: '牛油果',
  tomato: '番茄',
  vegetables: '其他蔬菜',
  bread: '面包',
  'white-bread': '白面包',
  'whole-wheat-bread': '全麦面包',
  sourdough: '酸种面包',
  bagel: '贝果',
  tortilla: '墨西哥薄饼',
  crackers: '饼干',
  oats: '燕麦',
  'rolled-oats': '传统燕麦片',
  'instant-oats': '即食燕麦',
  cereal: '麦片',
  granola: '燕麦脆',
  rice: '大米',
  'white-rice': '白米',
  'brown-rice': '糙米',
  waffles: '冷冻华夫饼',
  'pancake-mix': '松饼预拌粉',
  'hash-browns': '薯饼',
  'peanut-butter': '花生酱',
  jam: '果酱',
  honey: '蜂蜜',
  nuts: '坚果',
  chia: '奇亚籽',
  hummus: '鹰嘴豆泥',
  'protein-powder': '蛋白粉',
  bacon: '培根',
  turkey: '火鸡肉片',
  beans: '豆子',
  salt: '盐',
  'table-salt': '食用盐',
  'sea-salt': '海盐',
  'kosher-salt': '粗盐',
  pepper: '胡椒',
  'black-pepper': '黑胡椒',
  'white-pepper': '白胡椒',
  'cooking-oil': '食用油',
  'olive-oil': '橄榄油',
  'vegetable-oil': '植物油',
  'canola-oil': '菜籽油',
  'coconut-oil': '椰子油',
  'cooking-spray': '喷雾油',
  sugar: '糖',
  'white-sugar': '白砂糖',
  'brown-sugar': '红糖',
  cinnamon: '肉桂粉',
  'maple-syrup': '枫糖浆',
  'soy-sauce': '酱油',
  'hot-sauce': '辣酱',
};

// "鸡蛋", or "香蕉、苹果或莓果" for a list of alternatives.
export function chineseNeedLabel(need) {
  if (!Array.isArray(need)) return chineseFoodName(need);
  const names = need.map((id) => chineseFoodName(id));
  return names.length > 1 ? `${names.slice(0, -1).join('、')}或${names[names.length - 1]}` : names[0];
}

// What the student has, with the kinds they ticked in brackets: "牛奶（燕麦奶）".
export function chineseHaveLabels(haveIds) {
  return haveEntries(haveIds).map(({ item, kinds }) =>
    kinds.length > 0
      ? `${chineseFoodName(item.id)}（${kinds.map((kind) => chineseFoods[kind.id]).join('、')}）`
      : chineseFoodName(item.id)
  );
}

export function chineseMinutes(minutes) {
  return `${minutes} 分钟`;
}

// The line under the filters on the list screen: how many breakfasts, and for which choices.
export function chineseSummary({ count, anyTime, maxMinutes, useKitchen, strict, onlyFavorites, tags, almost }) {
  return [
    `${count} 份早餐`,
    anyTime ? '不限时间' : `最多 ${maxMinutes} 分钟`,
    ...(useKitchen ? [strict ? '用我厨房里的食材，含调料' : '用我厨房里的食材'] : []),
    ...(onlyFavorites ? ['收藏'] : []),
    ...tags.map((tag) => chineseUi.tags[tag]),
    ...(almost > 0 ? [`快做好 ${almost} 份`] : []),
  ].join(' \u00b7 ');
}

export function chineseShowing(first, last, total) {
  return `第 ${first}\u2013${last} 个，共 ${total} 个`;
}

// The bar that folds the breakfasts that are one food away.
export function chineseAlmost(count, open) {
  return { title: `快做好了（${count}）`, sub: `缺 1 样 \u00b7 点击${open ? '收起' : '展开'}` };
}

export function chineseNeedsSummary(total, missing) {
  return `需要准备（${total}）${missing > 0 ? `\u00b7 缺 ${missing} 样` : ''}`;
}

export function chineseStartTimer(minutes) {
  return `开始 ${minutes} 分钟计时`;
}

// "牛奶是哪一种？（可选）": the question under a food that has kinds.
export function chineseKindsLabel(itemId) {
  return `${chineseFoods[itemId]}是哪一种？（可选）`;
}

// "已选 3 样", or "还没选".
export function chineseKitchenCount(count) {
  return count === 0 ? '还没选' : `已选 ${count} 样`;
}

// Chinese for the suggested "Set up tonight" lines, by line id (the key word is between ** ** , like the English).
export const chineseTasks = {
  'lib-bowl': { text: '备好一个**碗**或罐子' },
  'lib-fruit': { text: '洗好、切好**水果**' },
  'lib-coffee': { text: '定好**咖啡**机或烧水壶的定时' },
  'lib-alarm': { text: '把**闹钟**放到离床远的地方' },
  'lib-supplies': { text: '看看**牛奶、鸡蛋和面包**够不够' },
  'lib-dishes': { text: '把**碗**洗干净' },
  'lib-oats-jar': { text: '在罐子里放好**燕麦或麦片**' },
  'lib-overnight-oats': { text: '在罐子里拌好**隔夜燕麦**', detail: '燕麦、牛奶、酸奶或奇亚籽，放进冰箱。' },
  'lib-chia': { text: '在罐子里做好**奇亚籽布丁**', detail: '放进冰箱。' },
  'lib-boil-eggs': { text: '提前煮几个**鸡蛋**', detail: '放在冰箱里。' },
  'lib-egg-muffins': { text: '把**蛋杯**挪到冷藏室', detail: '过一夜就解冻了。' },
  'lib-pan': { text: '备好**平底锅**和锅铲' },
  'lib-toaster': { text: '备好**烤面包机**和面包' },
  'lib-spreads': { text: '备好要抹的**酱**', detail: '花生酱、果酱或奶油奶酪。' },
  'lib-bagels': { text: '把**贝果或墨西哥薄饼**从冷冻室拿出来' },
  'lib-smoothie-pack': { text: '冻好一包**果昔料**', detail: '冷冻水果和菠菜，装进袋子。' },
  'lib-blender': { text: '备好**搅拌机**和杯子' },
  'lib-smoothie-milk': { text: '把**牛奶或酸奶**放在手边' },
  'lib-fruit-bag': { text: '带上一根**香蕉或一个苹果**' },
  'lib-water': { text: '把**水壶**装满水' },
  'lib-grab-bar': { text: '带上**能量棒或水煮蛋**' },
};

// "清单里有 4 项": how many tasks are on tonight's list.
export function chineseTaskCount(count) {
  return count === 0 ? '清单里还没有任务' : `清单里有 ${count} 项`;
}

// "已保存“My usual”": the floating message after saving a breakfast.
export function chineseSaved(name) {
  return `已保存\u201c${name}\u201d`;
}

// "第 3 步": the title of the window for one step.
export function chineseStepNumber(number) {
  return `第 ${number} 步`;
}

// The short waiting time on a step ("2–3 min", "20 sec") in Chinese ("2–3 分钟", "20 秒").
export function chineseStepTime(time) {
  return time.replace(/ sec$/, ' 秒').replace(/ min$/, ' 分钟');
}

// The id of a built-in food, or of one the student typed, that goes by this name (English or Chinese),
// or null. Capital letters do not matter.
export function findKnownFood(name) {
  const wanted = name.toLowerCase();
  const builtIn = Object.entries(chineseFoods).find(([id, chinese]) => chinese === name || foodLabelOf(id).toLowerCase() === wanted);
  if (builtIn) return builtIn[0];
  const typed = ownFoods().find((food) => food.label.toLowerCase() === wanted);
  return typed ? typed.id : null;
}

// The Chinese name of a food by id. A food the student typed has only the name they wrote.
export function chineseFoodName(id) {
  if (chineseFoods[id]) return chineseFoods[id];
  const typed = ownFoods().find((food) => food.id === id);
  return typed ? typed.label : id.startsWith('own:') ? id.slice(4) : '';
}

// The English label of a built-in food by id (kinds included), for matching typed names.
function foodLabelOf(id) {
  for (const group of INGREDIENT_GROUPS) {
    for (const item of group.items) {
      if (item.id === id) return item.label;
      const kind = (item.kinds || []).find((candidate) => candidate.id === id);
      if (kind) return kind.label;
    }
  }
  return '';
}
