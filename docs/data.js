/* Données : ingrédients et recettes (tous les cocktails se préparent au shaker).
 *
 * Un ingrédient de recette :
 *   { id, ml }            quantité en ml
 *   { id, qty, unit }     quantité en unités (feuille, blanc…)
 *   opt: true             optionnel (non requis pour la disponibilité)
 *   top: true             à compléter dans le verre après le shake
 *   float: true           versé délicatement sur le dessus
 *   alt: [ids]            ingrédients de remplacement acceptés
 */
window.DATA = (() => {
  const CATEGORIES = [
    { id: "spirit", name: "Alcools forts", emoji: "🥃" },
    { id: "liqueur", name: "Liqueurs & apéritifs", emoji: "🍯" },
    { id: "juice", name: "Jus", emoji: "🍊" },
    { id: "syrup", name: "Sirops & sucrants", emoji: "🍬" },
    { id: "other", name: "Autres", emoji: "🧊" },
  ];

  const INGREDIENTS = [
    // Alcools forts
    { id: "vodka", name: "Vodka", cat: "spirit" },
    { id: "gin", name: "Gin", cat: "spirit" },
    { id: "rhum_blanc", name: "Rhum blanc", cat: "spirit" },
    { id: "rhum_ambre", name: "Rhum ambré / brun", cat: "spirit" },
    { id: "tequila", name: "Tequila", cat: "spirit" },
    { id: "whisky", name: "Whisky / Bourbon", cat: "spirit" },
    { id: "cognac", name: "Cognac / Brandy", cat: "spirit" },
    // Liqueurs
    { id: "triple_sec", name: "Triple sec / Cointreau", cat: "liqueur" },
    { id: "amaretto", name: "Amaretto", cat: "liqueur" },
    { id: "liqueur_cafe", name: "Liqueur de café", cat: "liqueur" },
    { id: "liqueur_peche", name: "Liqueur de pêche", cat: "liqueur" },
    { id: "creme_cacao", name: "Crème de cacao", cat: "liqueur" },
    { id: "creme_mure", name: "Crème de mûre", cat: "liqueur" },
    { id: "maraschino", name: "Maraschino", cat: "liqueur" },
    { id: "campari", name: "Campari", cat: "liqueur" },
    // Jus
    { id: "jus_citron", name: "Jus de citron jaune", cat: "juice" },
    { id: "jus_citron_vert", name: "Jus de citron vert", cat: "juice" },
    { id: "jus_orange", name: "Jus d'orange", cat: "juice" },
    { id: "jus_ananas", name: "Jus d'ananas", cat: "juice" },
    { id: "jus_cranberry", name: "Jus de cranberry", cat: "juice" },
    { id: "jus_pamplemousse", name: "Jus de pamplemousse", cat: "juice" },
    // Sirops
    { id: "sirop_sucre", name: "Sirop de sucre (ou sucre)", cat: "syrup" },
    { id: "agave", name: "Sirop d'agave", cat: "syrup" },
    { id: "miel", name: "Miel", cat: "syrup" },
    { id: "grenadine", name: "Grenadine", cat: "syrup" },
    { id: "orgeat", name: "Sirop d'orgeat", cat: "syrup" },
    // Autres
    { id: "menthe", name: "Menthe fraîche", cat: "other" },
    { id: "blanc_oeuf", name: "Blanc d'œuf", cat: "other" },
    { id: "cafe", name: "Café espresso", cat: "other" },
    { id: "creme", name: "Crème liquide", cat: "other" },
    { id: "creme_coco", name: "Crème de coco", cat: "other" },
    { id: "soda", name: "Eau gazeuse / Soda", cat: "other" },
    { id: "petillant", name: "Champagne / Prosecco", cat: "other" },
  ];

  const SWEET = { id: "sirop_sucre", alt: ["agave", "miel"] };
  const sweet = (ml) => ({ ...SWEET, ml });

  const RECIPES = [
    {
      id: "daiquiri", name: "Daiquiri", emoji: "🍸", serve: "coupe",
      taste: "Frais · Acidulé", desc: "Le classique cubain : rhum, citron vert, sucre. Simple et parfait.",
      ing: [{ id: "rhum_blanc", ml: 60 }, { id: "jus_citron_vert", ml: 25 }, sweet(15)],
      garnish: "Une rondelle de citron vert sur le bord de la coupe.",
    },
    {
      id: "margarita", name: "Margarita", emoji: "🥃", serve: "rocks",
      taste: "Acidulé · Tequila", desc: "Tequila, triple sec et citron vert, avec un bord de sel.",
      ing: [{ id: "tequila", ml: 50 }, { id: "triple_sec", ml: 25 }, { id: "jus_citron_vert", ml: 25 }],
      pre: ["Frotte un quartier de citron vert sur le bord du verre, puis trempe-le dans du sel fin (optionnel)."],
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "tommys", name: "Tommy's Margarita", emoji: "🥃", serve: "rocks",
      taste: "Frais · Tequila", desc: "La version moderne, sans triple sec : tequila, citron vert, agave.",
      ing: [{ id: "tequila", ml: 50 }, { id: "jus_citron_vert", ml: 25 }, { id: "agave", alt: ["sirop_sucre", "miel"], ml: 15 }],
      garnish: "Une rondelle de citron vert.",
    },
    {
      id: "cosmopolitan", name: "Cosmopolitan", emoji: "🍸", serve: "coupe",
      taste: "Fruité · Acidulé", desc: "Vodka, triple sec, citron vert et cranberry. Rose et élégant.",
      ing: [{ id: "vodka", ml: 40 }, { id: "triple_sec", ml: 15 }, { id: "jus_citron_vert", ml: 15 }, { id: "jus_cranberry", ml: 30 }],
      garnish: "Un zeste d'orange pressé au-dessus du verre.",
    },
    {
      id: "whiskey_sour", name: "Whiskey Sour", emoji: "🥃", serve: "rocks",
      taste: "Acidulé · Rond", desc: "Bourbon, citron, sucre. Avec un blanc d'œuf, il devient soyeux.",
      ing: [{ id: "whisky", ml: 50 }, { id: "jus_citron", ml: 25 }, sweet(15), { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }],
      garnish: "Une cerise et un zeste d'orange.",
    },
    {
      id: "amaretto_sour", name: "Amaretto Sour", emoji: "🥃", serve: "rocks",
      taste: "Doux · Amande", desc: "Amande et citron : doux, rond, très facile à boire.",
      ing: [{ id: "amaretto", ml: 45 }, { id: "jus_citron", ml: 25 }, { ...SWEET, ml: 5, opt: true }, { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }],
      garnish: "Une cerise.",
    },
    {
      id: "sidecar", name: "Sidecar", emoji: "🍸", serve: "coupe",
      taste: "Acidulé · Cognac", desc: "Cognac, triple sec, citron : l'élégance à la française.",
      ing: [{ id: "cognac", ml: 50 }, { id: "triple_sec", ml: 20 }, { id: "jus_citron", ml: 20 }],
      pre: ["Optionnel : givre le bord de la coupe avec du sucre."],
      garnish: "Un zeste d'orange.",
    },
    {
      id: "gimlet", name: "Gimlet", emoji: "🍸", serve: "coupe",
      taste: "Sec · Acidulé", desc: "Gin et citron vert, le plus direct des cocktails au gin.",
      ing: [{ id: "gin", ml: 60 }, { id: "jus_citron_vert", ml: 20 }, sweet(15)],
      garnish: "Une rondelle de citron vert.",
    },
    {
      id: "bees_knees", name: "Bee's Knees", emoji: "🍸", serve: "coupe",
      taste: "Floral · Miel", desc: "Gin, citron et miel. Un classique de la Prohibition.",
      ing: [{ id: "gin", ml: 60 }, { id: "jus_citron", ml: 22 }, { id: "miel", ml: 15 }],
      pre: ["Dilue le miel : mélange 1 volume de miel et 1 volume d'eau tiède jusqu'à obtenir un sirop fluide."],
      garnish: "Un zeste de citron.",
    },
    {
      id: "white_lady", name: "White Lady", emoji: "🍸", serve: "coupe",
      taste: "Sec · Agrume", desc: "Gin, triple sec et citron. Avec un blanc d'œuf, la texture est crémeuse.",
      ing: [{ id: "gin", ml: 40 }, { id: "triple_sec", ml: 30 }, { id: "jus_citron", ml: 20 }, { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }],
      garnish: "Un zeste de citron.",
    },
    {
      id: "tom_collins", name: "Tom Collins", emoji: "🥤", serve: "tall",
      taste: "Pétillant · Frais", desc: "Une limonade au gin, longue et désaltérante.",
      ing: [{ id: "gin", ml: 50 }, { id: "jus_citron", ml: 25 }, sweet(15), { id: "soda", ml: 60, top: true }],
      garnish: "Une tranche de citron et une cerise.",
    },
    {
      id: "mai_tai", name: "Mai Tai", emoji: "🥃", serve: "rocks",
      taste: "Tiki · Amande", desc: "Deux rhums, orgeat et citron vert : le roi du tiki.",
      ing: [{ id: "rhum_ambre", ml: 30 }, { id: "rhum_blanc", ml: 30 }, { id: "triple_sec", ml: 15 }, { id: "orgeat", ml: 15 }, { id: "jus_citron_vert", ml: 25 }],
      garnish: "Un bouquet de menthe et une demi-coque de citron vert.",
    },
    {
      id: "espresso_martini", name: "Espresso Martini", emoji: "🍸", serve: "coupe",
      taste: "Café · Corsé", desc: "Vodka, liqueur de café et espresso frais, avec sa mousse dorée.",
      ing: [{ id: "vodka", ml: 50 }, { id: "liqueur_cafe", ml: 25 }, { id: "cafe", ml: 30 }, { ...SWEET, ml: 5, opt: true }],
      pre: ["Prépare un espresso et laisse-le refroidir quelques minutes : le café chaud ferait fondre les glaçons trop vite."],
      shake: 15,
      garnish: "Trois grains de café posés sur la mousse.",
    },
    {
      id: "kamikaze", name: "Kamikaze", emoji: "🍸", serve: "coupe",
      taste: "Vif · Fort", desc: "Trois parts égales : vodka, triple sec, citron vert.",
      ing: [{ id: "vodka", ml: 30 }, { id: "triple_sec", ml: 30 }, { id: "jus_citron_vert", ml: 30 }],
      garnish: "Une rondelle de citron vert.",
    },
    {
      id: "lemon_drop", name: "Lemon Drop", emoji: "🍸", serve: "coupe",
      taste: "Citron · Sucré-acide", desc: "Un bonbon au citron pour adultes.",
      ing: [{ id: "vodka", ml: 50 }, { id: "triple_sec", ml: 20 }, { id: "jus_citron", ml: 25 }, sweet(10)],
      pre: ["Optionnel : givre le bord de la coupe avec du sucre."],
      garnish: "Un zeste de citron.",
    },
    {
      id: "sex_on_the_beach", name: "Sex on the Beach", emoji: "🥤", serve: "tall",
      taste: "Fruité · Doux", desc: "Pêche, orange et cranberry : le cocktail de plage.",
      ing: [{ id: "vodka", ml: 40 }, { id: "liqueur_peche", ml: 20 }, { id: "jus_orange", ml: 40 }, { id: "jus_cranberry", ml: 40 }],
      garnish: "Une tranche d'orange.",
    },
    {
      id: "hemingway", name: "Hemingway Daiquiri", emoji: "🍸", serve: "coupe",
      taste: "Sec · Pamplemousse", desc: "Le daiquiri d'Ernest : rhum, maraschino, pamplemousse.",
      ing: [{ id: "rhum_blanc", ml: 50 }, { id: "maraschino", ml: 15 }, { id: "jus_pamplemousse", ml: 30 }, { id: "jus_citron_vert", ml: 15 }],
      garnish: "Une rondelle de citron vert.",
    },
    {
      id: "between_the_sheets", name: "Between the Sheets", emoji: "🍸", serve: "coupe",
      taste: "Fort · Agrume", desc: "Rhum, cognac et triple sec, relevés d'un peu de citron.",
      ing: [{ id: "rhum_blanc", ml: 30 }, { id: "cognac", ml: 30 }, { id: "triple_sec", ml: 30 }, { id: "jus_citron", ml: 20 }],
      garnish: "Un zeste de citron.",
    },
    {
      id: "paloma", name: "Paloma", emoji: "🥤", serve: "tall",
      taste: "Pamplemousse · Pétillant", desc: "Le cocktail mexicain préféré : tequila et pamplemousse.",
      ing: [{ id: "tequila", ml: 50 }, { id: "jus_pamplemousse", ml: 60 }, { id: "jus_citron_vert", ml: 15 }, { id: "soda", ml: 40, top: true }],
      pre: ["Optionnel : givre le bord du verre avec du sel."],
      garnish: "Un quartier de pamplemousse.",
    },
    {
      id: "southside", name: "Southside", emoji: "🍸", serve: "coupe",
      taste: "Frais · Menthe", desc: "Gin, citron vert et menthe : un mojito qui se prend pour un martini.",
      ing: [{ id: "gin", ml: 60 }, { id: "jus_citron_vert", ml: 25 }, sweet(15), { id: "menthe", qty: 8, unit: "feuille" }],
      pre: ["Claque les feuilles de menthe dans le creux de la main pour libérer leur arôme."],
      garnish: "Une feuille de menthe.",
    },
    {
      id: "bramble", name: "Bramble", emoji: "🥃", serve: "rocks",
      taste: "Fruits rouges · Gin", desc: "Gin, citron et un voile de crème de mûre versé à la fin.",
      ing: [{ id: "gin", ml: 50 }, { id: "jus_citron", ml: 25 }, sweet(12), { id: "creme_mure", ml: 15, float: true }],
      note: "Si tu as de la glace pilée, utilise-la dans le verre.",
      garnish: "Une mûre ou une tranche de citron.",
    },
    {
      id: "brandy_alexander", name: "Brandy Alexander", emoji: "🍸", serve: "coupe",
      taste: "Crémeux · Chocolat", desc: "Cognac, crème de cacao et crème : un dessert liquide.",
      ing: [{ id: "cognac", ml: 30 }, { id: "creme_cacao", ml: 30 }, { id: "creme", ml: 30 }],
      shake: 15,
      garnish: "Un peu de noix de muscade râpée.",
    },
    {
      id: "pina_colada", name: "Piña Colada (shaker)", emoji: "🥤", serve: "tall",
      taste: "Tropical · Crémeux", desc: "Rhum, ananas et crème de coco, version shakée.",
      ing: [{ id: "rhum_blanc", ml: 50 }, { id: "jus_ananas", ml: 50 }, { id: "creme_coco", ml: 30 }],
      shake: 15,
      garnish: "Une tranche d'ananas.",
    },
    {
      id: "jungle_bird", name: "Jungle Bird", emoji: "🥃", serve: "rocks",
      taste: "Amer · Tropical", desc: "Rhum ambré, Campari et ananas : le tiki des amateurs d'amer.",
      ing: [{ id: "rhum_ambre", ml: 45 }, { id: "campari", ml: 22 }, { id: "jus_ananas", ml: 45 }, { id: "jus_citron_vert", ml: 15 }, sweet(15)],
      garnish: "Une feuille d'ananas ou une tranche d'ananas.",
    },
    {
      id: "planters_punch", name: "Planter's Punch", emoji: "🥤", serve: "tall",
      taste: "Fruité · Rhum", desc: "Rhum ambré, orange, ananas et grenadine.",
      ing: [{ id: "rhum_ambre", ml: 60 }, { id: "jus_orange", ml: 30 }, { id: "jus_ananas", ml: 30 }, { id: "jus_citron_vert", ml: 20 }, { id: "grenadine", ml: 10 }],
      garnish: "Une tranche d'orange et une cerise.",
    },
    {
      id: "whiskey_smash", name: "Whiskey Smash", emoji: "🥃", serve: "rocks",
      taste: "Frais · Menthe", desc: "Un julep sour : bourbon, citron et menthe fraîche.",
      ing: [{ id: "whisky", ml: 50 }, { id: "jus_citron", ml: 25 }, sweet(15), { id: "menthe", qty: 8, unit: "feuille" }],
      pre: ["Claque les feuilles de menthe dans le creux de la main pour libérer leur arôme."],
      garnish: "Un bouquet de menthe.",
    },
    {
      id: "gold_rush", name: "Gold Rush", emoji: "🥃", serve: "rocks",
      taste: "Rond · Miel", desc: "Bourbon, citron et miel : un whiskey sour plus doux.",
      ing: [{ id: "whisky", ml: 60 }, { id: "jus_citron", ml: 22 }, { id: "miel", ml: 22 }],
      pre: ["Dilue le miel : mélange 1 volume de miel et 1 volume d'eau tiède jusqu'à obtenir un sirop fluide."],
      garnish: "Un zeste de citron.",
    },
    {
      id: "french_75", name: "French 75", emoji: "🥂", serve: "flute",
      taste: "Pétillant · Festif", desc: "Gin, citron, sucre et un trait de champagne.",
      ing: [{ id: "gin", ml: 30 }, { id: "jus_citron", ml: 15 }, sweet(10), { id: "petillant", ml: 60, top: true }],
      garnish: "Un zeste de citron en spirale.",
    },
  ];

  return { CATEGORIES, INGREDIENTS, RECIPES };
})();
