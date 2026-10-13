/* Données : ingrédients et recettes.
 *
 * Ingrédient (INGREDIENTS) : { id, name, cat, abv? }   abv = degré d'alcool (% vol)
 *
 * Recette :
 *   method   "shaker" (défaut) | "stir" (mélangé au verre à mélange) | "build" (directement dans le verre)
 *   serve    "coupe" | "rocks" | "tall" | "flute" | "wine"
 *   noIce    true : servi sans glaçons (même en verre rocks / tall)
 *   muddle   [ids] ingrédients écrasés dans le verre (méthode "build")
 *   pre      étapes de préparation (texte)
 *
 * Ingrédient d'une recette :
 *   { id, ml }            quantité en ml
 *   { id, qty, unit }     quantité en unités (feuille, trait, quartier…)
 *   opt: true             optionnel (non requis pour la disponibilité)
 *   top: true             à compléter dans le verre en fin de préparation
 *   float: true           versé délicatement sur le dessus
 *   alt: [ids]            ingrédients de remplacement acceptés
 */
window.DATA = (() => {
  const CATEGORIES = [
    { id: "spirit", name: "Alcools forts", emoji: "🥃" },
    { id: "liqueur", name: "Liqueurs", emoji: "🍯" },
    { id: "aperitif", name: "Apéritifs & vins", emoji: "🍷" },
    { id: "juice", name: "Jus & fruits", emoji: "🍊" },
    { id: "syrup", name: "Sirops & sucrants", emoji: "🍬" },
    { id: "other", name: "Autres", emoji: "🧊" },
  ];

  const INGREDIENTS = [
    // Alcools forts
    { id: "vodka", name: "Vodka", cat: "spirit", abv: 40 },
    { id: "gin", name: "Gin", cat: "spirit", abv: 40 },
    { id: "rhum_blanc", name: "Rhum blanc", cat: "spirit", abv: 40 },
    { id: "rhum_ambre", name: "Rhum ambré / brun", cat: "spirit", abv: 40 },
    { id: "tequila", name: "Tequila", cat: "spirit", abv: 40 },
    { id: "whisky", name: "Whisky / Bourbon", cat: "spirit", abv: 40 },
    { id: "cognac", name: "Cognac / Brandy", cat: "spirit", abv: 40 },
    { id: "cachaca", name: "Cachaça", cat: "spirit", abv: 40 },
    { id: "pisco", name: "Pisco", cat: "spirit", abv: 40 },
    // Liqueurs
    { id: "triple_sec", name: "Triple sec / Cointreau", cat: "liqueur", abv: 30 },
    { id: "amaretto", name: "Amaretto", cat: "liqueur", abv: 24 },
    { id: "liqueur_cafe", name: "Liqueur de café", cat: "liqueur", abv: 20 },
    { id: "liqueur_peche", name: "Liqueur de pêche", cat: "liqueur", abv: 20 },
    { id: "creme_cacao", name: "Crème de cacao", cat: "liqueur", abv: 25 },
    { id: "creme_menthe", name: "Crème de menthe", cat: "liqueur", abv: 24 },
    { id: "creme_mure", name: "Crème de mûre", cat: "liqueur", abv: 16 },
    { id: "creme_cassis", name: "Crème de cassis", cat: "liqueur", abv: 16 },
    { id: "liqueur_sureau", name: "Liqueur de sureau", cat: "liqueur", abv: 20 },
    { id: "maraschino", name: "Maraschino", cat: "liqueur", abv: 32 },
    { id: "chartreuse_verte", name: "Chartreuse verte", cat: "liqueur", abv: 55 },
    // Apéritifs & vins
    { id: "campari", name: "Campari", cat: "aperitif", abv: 25 },
    { id: "aperol", name: "Aperol", cat: "aperitif", abv: 11 },
    { id: "vermouth_rouge", name: "Vermouth rouge", cat: "aperitif", abv: 16 },
    { id: "vermouth_sec", name: "Vermouth sec", cat: "aperitif", abv: 16 },
    { id: "vin_blanc", name: "Vin blanc", cat: "aperitif", abv: 12 },
    { id: "petillant", name: "Champagne / Prosecco", cat: "aperitif", abv: 11 },
    // Jus & fruits
    { id: "jus_citron", name: "Citron jaune (frais ou jus)", cat: "juice", abv: 0 },
    { id: "jus_citron_vert", name: "Citron vert (frais ou jus)", cat: "juice", abv: 0 },
    { id: "jus_orange", name: "Orange (fraîche ou jus)", cat: "juice", abv: 0 },
    { id: "jus_ananas", name: "Jus d'ananas", cat: "juice", abv: 0 },
    { id: "jus_cranberry", name: "Jus de cranberry", cat: "juice", abv: 0 },
    { id: "jus_pamplemousse", name: "Pamplemousse (frais ou jus)", cat: "juice", abv: 0 },
    { id: "jus_tomate", name: "Jus de tomate", cat: "juice", abv: 0 },
    // Sirops
    { id: "sirop_sucre", name: "Sirop de sucre (ou sucre)", cat: "syrup", abv: 0 },
    { id: "agave", name: "Sirop d'agave", cat: "syrup", abv: 0 },
    { id: "miel", name: "Miel", cat: "syrup", abv: 0 },
    { id: "grenadine", name: "Grenadine", cat: "syrup", abv: 0 },
    { id: "orgeat", name: "Sirop d'orgeat", cat: "syrup", abv: 0 },
    { id: "framboise", name: "Sirop de framboise", cat: "syrup", abv: 0 },
    // Autres
    { id: "soda", name: "Eau gazeuse / Soda", cat: "other", abv: 0 },
    { id: "tonic", name: "Tonic", cat: "other", abv: 0 },
    { id: "ginger_beer", name: "Ginger beer", cat: "other", abv: 0 },
    { id: "cola", name: "Cola", cat: "other", abv: 0 },
    { id: "angostura", name: "Angostura (bitter)", cat: "other", abv: 0 },
    { id: "menthe", name: "Menthe fraîche", cat: "other", abv: 0 },
    { id: "blanc_oeuf", name: "Blanc d'œuf", cat: "other", abv: 0 },
    { id: "cafe", name: "Café espresso", cat: "other", abv: 0 },
    { id: "creme", name: "Crème liquide", cat: "other", abv: 0 },
    { id: "creme_coco", name: "Crème de coco", cat: "other", abv: 0 },
  ];

  const SWEET = { id: "sirop_sucre", alt: ["agave", "miel"] };
  const sweet = (ml, extra) => ({ ...SWEET, ml, ...extra });
  const dash = (n, extra) => ({ id: "angostura", qty: n, unit: "trait", ...extra });
  const SM = "stir";
  const BD = "build";
  const HONEY = "Dilue le miel : mélange 1 volume de miel et 1 volume d'eau tiède jusqu'à obtenir un sirop fluide.";
  const SMACK = "Claque les feuilles de menthe dans le creux de la main pour libérer leur arôme.";

  const RECIPES = [
    /* ---------- Classiques au shaker ---------- */
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
      ing: [{ id: "amaretto", ml: 45 }, { id: "jus_citron", ml: 25 }, sweet(5, { opt: true }), { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }],
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
      pre: [HONEY],
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
      id: "gin_fizz", name: "Gin Fizz", emoji: "🥤", serve: "tall", noIce: true,
      taste: "Pétillant · Citron", desc: "Comme un Collins, mais servi sans glaçons : plus vif et plus mousseux.",
      ing: [{ id: "gin", ml: 45 }, { id: "jus_citron", ml: 25 }, sweet(15), { id: "soda", ml: 60, top: true }, { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }],
      garnish: "Une rondelle de citron.",
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
      ing: [{ id: "vodka", ml: 50 }, { id: "liqueur_cafe", ml: 25 }, { id: "cafe", ml: 30 }, sweet(5, { opt: true })],
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
      pre: [SMACK],
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
      pre: [SMACK],
      garnish: "Un bouquet de menthe.",
    },
    {
      id: "gold_rush", name: "Gold Rush", emoji: "🥃", serve: "rocks",
      taste: "Rond · Miel", desc: "Bourbon, citron et miel : un whiskey sour plus doux.",
      ing: [{ id: "whisky", ml: 60 }, { id: "jus_citron", ml: 22 }, { id: "miel", ml: 22 }],
      pre: [HONEY],
      garnish: "Un zeste de citron.",
    },
    {
      id: "french_75", name: "French 75", emoji: "🥂", serve: "flute",
      taste: "Pétillant · Festif", desc: "Gin, citron, sucre et un trait de champagne.",
      ing: [{ id: "gin", ml: 30 }, { id: "jus_citron", ml: 15 }, sweet(10), { id: "petillant", ml: 60, top: true }],
      garnish: "Un zeste de citron en spirale.",
    },
    {
      id: "clover_club", name: "Clover Club", emoji: "🍸", serve: "coupe",
      taste: "Fruité · Soyeux", desc: "Gin, framboise et citron, avec un blanc d'œuf pour la mousse.",
      ing: [{ id: "gin", ml: 45 }, { id: "jus_citron", ml: 15 }, { id: "framboise", ml: 15 }, { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }],
      garnish: "Trois framboises sur un pique, si tu en as.",
    },
    {
      id: "last_word", name: "Last Word", emoji: "🍸", serve: "coupe",
      taste: "Herbacé · Vif", desc: "Quatre parts égales : gin, chartreuse, maraschino, citron vert.",
      ing: [{ id: "gin", ml: 25 }, { id: "chartreuse_verte", ml: 25 }, { id: "maraschino", ml: 25 }, { id: "jus_citron_vert", ml: 25 }],
      garnish: "Une cerise (optionnel).",
    },
    {
      id: "pisco_sour", name: "Pisco Sour", emoji: "🍸", serve: "coupe",
      taste: "Acidulé · Mousseux", desc: "Le grand classique péruvien, avec sa mousse parfumée.",
      ing: [{ id: "pisco", ml: 60 }, { id: "jus_citron_vert", ml: 30 }, sweet(20), { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }, dash(3, { opt: true })],
      garnish: "Quelques gouttes d'angostura sur la mousse si tu en as.",
    },
    {
      id: "vodka_sour", name: "Vodka Sour", emoji: "🥃", serve: "rocks",
      taste: "Acidulé · Net", desc: "Vodka, citron et sucre : l'équilibre d'un sour, sans fioriture.",
      ing: [{ id: "vodka", ml: 50 }, { id: "jus_citron", ml: 25 }, sweet(15), { id: "blanc_oeuf", qty: 1, unit: "blanc", opt: true }],
      garnish: "Une demi-rondelle de citron.",
    },
    {
      id: "rum_sour", name: "Rum Sour", emoji: "🥃", serve: "rocks",
      taste: "Acidulé · Caramel", desc: "Rhum ambré, citron et sucre : un sour gourmand.",
      ing: [{ id: "rhum_ambre", ml: 50 }, { id: "jus_citron", ml: 25 }, sweet(15)],
      garnish: "Une rondelle d'orange.",
    },
    {
      id: "matador", name: "Matador", emoji: "🍸", serve: "coupe",
      taste: "Tropical · Frais", desc: "Tequila, ananas et citron vert.",
      ing: [{ id: "tequila", ml: 45 }, { id: "jus_ananas", ml: 45 }, { id: "jus_citron_vert", ml: 15 }],
      garnish: "Une feuille d'ananas ou une rondelle de citron vert.",
    },
    {
      id: "bacardi", name: "Bacardi", emoji: "🍸", serve: "coupe",
      taste: "Acidulé · Rosé", desc: "Rhum blanc, citron vert et grenadine : un daiquiri rosé.",
      ing: [{ id: "rhum_blanc", ml: 45 }, { id: "jus_citron_vert", ml: 20 }, { id: "grenadine", ml: 10 }],
      garnish: "Une rondelle de citron vert.",
    },
    {
      id: "long_island", name: "Long Island Iced Tea", emoji: "🥤", serve: "tall",
      taste: "Fort · Cola", desc: "Cinq alcools et du cola : il a le goût d'un thé glacé, mais attention.",
      ing: [
        { id: "vodka", ml: 15 }, { id: "gin", ml: 15 }, { id: "rhum_blanc", ml: 15 }, { id: "tequila", ml: 15 },
        { id: "triple_sec", ml: 15 }, { id: "jus_citron", ml: 25 }, sweet(10), { id: "cola", ml: 30, top: true },
      ],
      garnish: "Une tranche de citron.",
    },
    {
      id: "painkiller", name: "Painkiller", emoji: "🥤", serve: "tall",
      taste: "Tropical · Crémeux", desc: "Rhum, ananas, orange et crème de coco : le tiki des îles Vierges.",
      ing: [{ id: "rhum_ambre", ml: 60 }, { id: "jus_ananas", ml: 60 }, { id: "jus_orange", ml: 15 }, { id: "creme_coco", ml: 15 }],
      shake: 15,
      garnish: "Un peu de noix de muscade râpée et une tranche d'ananas.",
    },
    {
      id: "stinger", name: "Stinger", emoji: "🍸", serve: "coupe",
      taste: "Menthe · Fort", desc: "Cognac et crème de menthe : digestif et glacial.",
      ing: [{ id: "cognac", ml: 50 }, { id: "creme_menthe", ml: 20 }],
      garnish: "Une feuille de menthe.",
    },
    {
      id: "grasshopper", name: "Grasshopper", emoji: "🍸", serve: "coupe",
      taste: "Menthe · Chocolat", desc: "Menthe, cacao et crème : on dirait une glace After Eight.",
      ing: [{ id: "creme_menthe", ml: 30 }, { id: "creme_cacao", ml: 30 }, { id: "creme", ml: 30 }],
      shake: 15,
      garnish: "Un peu de chocolat râpé.",
    },

    /* ---------- Mélangés au verre à mélange ---------- */
    {
      id: "negroni", name: "Negroni", emoji: "🥃", serve: "rocks", method: SM,
      taste: "Amer · Intense", desc: "À parts égales : gin, Campari, vermouth rouge. L'apéritif italien par excellence.",
      ing: [{ id: "gin", ml: 30 }, { id: "campari", ml: 30 }, { id: "vermouth_rouge", ml: 30 }],
      garnish: "Un zeste d'orange pressé au-dessus du verre, puis une demi-rondelle d'orange.",
    },
    {
      id: "boulevardier", name: "Boulevardier", emoji: "🥃", serve: "rocks", method: SM,
      taste: "Amer · Boisé", desc: "Le Negroni au bourbon : plus rond, plus chaud.",
      ing: [{ id: "whisky", ml: 40 }, { id: "campari", ml: 30 }, { id: "vermouth_rouge", ml: 30 }],
      garnish: "Un zeste d'orange.",
    },
    {
      id: "manhattan", name: "Manhattan", emoji: "🍸", serve: "coupe", method: SM,
      taste: "Boisé · Corsé", desc: "Whisky, vermouth rouge et angostura. Le roi des cocktails new-yorkais.",
      ing: [{ id: "whisky", ml: 50 }, { id: "vermouth_rouge", ml: 20 }, dash(2)],
      garnish: "Une cerise.",
    },
    {
      id: "old_fashioned", name: "Old Fashioned", emoji: "🥃", serve: "rocks", method: SM,
      taste: "Boisé · Fort", desc: "Whisky, un peu de sucre et d'angostura. Rien de plus, rien de moins.",
      ing: [{ id: "whisky", ml: 60 }, sweet(10), dash(2)],
      garnish: "Un zeste d'orange pressé au-dessus du verre.",
    },
    {
      id: "dry_martini", name: "Dry Martini", emoji: "🍸", serve: "coupe", method: SM,
      taste: "Sec · Net", desc: "Gin et un soupçon de vermouth sec. Il doit être glacial.",
      ing: [{ id: "gin", ml: 60 }, { id: "vermouth_sec", ml: 10 }],
      garnish: "Une olive ou un zeste de citron.",
    },
    {
      id: "vodka_martini", name: "Vodka Martini", emoji: "🍸", serve: "coupe", method: SM,
      taste: "Sec · Net", desc: "La version à la vodka du Dry Martini.",
      ing: [{ id: "vodka", ml: 60 }, { id: "vermouth_sec", ml: 10 }],
      garnish: "Une olive ou un zeste de citron.",
    },
    {
      id: "martinez", name: "Martinez", emoji: "🍸", serve: "coupe", method: SM,
      taste: "Rond · Herbacé", desc: "L'ancêtre du Martini : gin, vermouth rouge et une touche de maraschino.",
      ing: [{ id: "gin", ml: 45 }, { id: "vermouth_rouge", ml: 30 }, { id: "maraschino", ml: 5 }, dash(2)],
      garnish: "Un zeste d'orange.",
    },

    /* ---------- Directement dans le verre ---------- */
    {
      id: "gin_tonic", name: "Gin Tonic", emoji: "🥤", serve: "tall", method: BD,
      taste: "Sec · Pétillant", desc: "Gin et tonic bien frais, c'est tout.",
      ing: [{ id: "gin", ml: 50 }, { id: "tonic", ml: 150, top: true }],
      garnish: "Un zeste ou une rondelle de citron.",
    },
    {
      id: "gin_rickey", name: "Gin Rickey", emoji: "🥤", serve: "tall", method: BD,
      taste: "Sec · Citron vert", desc: "Gin, citron vert et eau gazeuse, sans sucre.",
      ing: [{ id: "gin", ml: 50 }, { id: "jus_citron_vert", ml: 15 }, { id: "soda", ml: 100, top: true }],
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "moscow_mule", name: "Moscow Mule", emoji: "🥤", serve: "tall", method: BD,
      taste: "Piquant · Frais", desc: "Vodka, citron vert et ginger beer.",
      ing: [{ id: "vodka", ml: 50 }, { id: "jus_citron_vert", ml: 15 }, { id: "ginger_beer", ml: 120, top: true }],
      garnish: "Un quartier de citron vert et un bouquet de menthe.",
    },
    {
      id: "kentucky_mule", name: "Kentucky Mule", emoji: "🥤", serve: "tall", method: BD,
      taste: "Piquant · Boisé", desc: "Le Mule au bourbon.",
      ing: [{ id: "whisky", ml: 50 }, { id: "jus_citron_vert", ml: 15 }, { id: "ginger_beer", ml: 120, top: true }],
      garnish: "Un quartier de citron vert et un bouquet de menthe.",
    },
    {
      id: "dark_n_stormy", name: "Dark 'n' Stormy", emoji: "🥤", serve: "tall", method: BD,
      taste: "Épicé · Rhum", desc: "Rhum brun et ginger beer, avec un trait de citron vert.",
      ing: [{ id: "rhum_ambre", ml: 60 }, { id: "jus_citron_vert", ml: 10 }, { id: "ginger_beer", ml: 100, top: true }],
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "cuba_libre", name: "Cuba Libre", emoji: "🥤", serve: "tall", method: BD,
      taste: "Doux · Cola", desc: "Rhum, cola et citron vert.",
      ing: [{ id: "rhum_blanc", ml: 50 }, { id: "jus_citron_vert", ml: 10 }, { id: "cola", ml: 120, top: true }],
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "whisky_coca", name: "Whisky Coca", emoji: "🥤", serve: "tall", method: BD,
      taste: "Doux · Cola", desc: "Whisky et cola : simple et efficace.",
      ing: [{ id: "whisky", ml: 50 }, { id: "cola", ml: 120, top: true }],
      garnish: "Une tranche de citron.",
    },
    {
      id: "whisky_soda", name: "Whisky Highball", emoji: "🥤", serve: "tall", method: BD,
      taste: "Sec · Léger", desc: "Whisky et eau gazeuse : le highball japonais.",
      ing: [{ id: "whisky", ml: 45 }, { id: "soda", ml: 135, top: true }],
      garnish: "Un zeste de citron.",
    },
    {
      id: "mojito", name: "Mojito", emoji: "🥤", serve: "tall", method: BD, muddle: ["menthe", "sirop_sucre", "jus_citron_vert"],
      taste: "Frais · Menthe", desc: "Rhum, menthe, citron vert, sucre et eau gazeuse.",
      ing: [{ id: "rhum_blanc", ml: 50 }, { id: "jus_citron_vert", ml: 25 }, sweet(15), { id: "menthe", qty: 8, unit: "feuille" }, { id: "soda", ml: 60, top: true }],
      note: "Remue de bas en haut avec la cuillère pour bien mélanger la menthe.",
      garnish: "Un bouquet de menthe, tapé dans la main pour réveiller l'arôme.",
    },
    {
      id: "caipirinha", name: "Caipirinha", emoji: "🥃", serve: "rocks", method: BD, muddle: ["jus_citron_vert", "sirop_sucre"],
      taste: "Acidulé · Brut", desc: "Cachaça, citron vert écrasé et sucre : le cocktail brésilien.",
      ing: [{ id: "cachaca", ml: 60 }, { id: "jus_citron_vert", qty: 4, unit: "quartier" }, sweet(15)],
      note: "Avec de la glace pilée, c'est encore meilleur.",
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "caipiroska", name: "Caipiroska", emoji: "🥃", serve: "rocks", method: BD, muddle: ["jus_citron_vert", "sirop_sucre"],
      taste: "Acidulé · Net", desc: "Comme la Caipirinha, mais à la vodka.",
      ing: [{ id: "vodka", ml: 60 }, { id: "jus_citron_vert", qty: 4, unit: "quartier" }, sweet(15)],
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "tequila_sunrise", name: "Tequila Sunrise", emoji: "🥤", serve: "tall", method: BD,
      taste: "Fruité · Doux", desc: "Tequila, orange et grenadine, avec son dégradé de lever de soleil.",
      ing: [{ id: "tequila", ml: 45 }, { id: "jus_orange", ml: 90 }, { id: "grenadine", ml: 15, float: true }],
      garnish: "Une tranche d'orange et une cerise.",
    },
    {
      id: "screwdriver", name: "Screwdriver", emoji: "🥤", serve: "tall", method: BD,
      taste: "Fruité · Simple", desc: "Vodka et jus d'orange.",
      ing: [{ id: "vodka", ml: 50 }, { id: "jus_orange", ml: 100, top: true }],
      garnish: "Une tranche d'orange.",
    },
    {
      id: "cape_codder", name: "Cape Codder", emoji: "🥤", serve: "tall", method: BD,
      taste: "Acidulé · Simple", desc: "Vodka et cranberry, avec un trait de citron vert.",
      ing: [{ id: "vodka", ml: 50 }, { id: "jus_cranberry", ml: 100, top: true }],
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "sea_breeze", name: "Sea Breeze", emoji: "🥤", serve: "tall", method: BD,
      taste: "Fruité · Amer", desc: "Vodka, cranberry et pamplemousse.",
      ing: [{ id: "vodka", ml: 40 }, { id: "jus_cranberry", ml: 120 }, { id: "jus_pamplemousse", ml: 30 }],
      garnish: "Un quartier de citron vert.",
    },
    {
      id: "bay_breeze", name: "Bay Breeze", emoji: "🥤", serve: "tall", method: BD,
      taste: "Tropical · Doux", desc: "Vodka, ananas et cranberry.",
      ing: [{ id: "vodka", ml: 40 }, { id: "jus_ananas", ml: 60 }, { id: "jus_cranberry", ml: 20 }],
      garnish: "Une tranche d'ananas.",
    },
    {
      id: "madras", name: "Madras", emoji: "🥤", serve: "tall", method: BD,
      taste: "Fruité · Doux", desc: "Vodka, cranberry et orange.",
      ing: [{ id: "vodka", ml: 40 }, { id: "jus_cranberry", ml: 40 }, { id: "jus_orange", ml: 20 }],
      garnish: "Une tranche d'orange.",
    },
    {
      id: "greyhound", name: "Greyhound", emoji: "🥤", serve: "tall", method: BD,
      taste: "Amer · Frais", desc: "Gin (ou vodka) et pamplemousse.",
      ing: [{ id: "gin", alt: ["vodka"], ml: 50 }, { id: "jus_pamplemousse", ml: 120, top: true }],
      garnish: "Une tranche de pamplemousse.",
    },
    {
      id: "bloody_mary", name: "Bloody Mary", emoji: "🥤", serve: "tall", method: BD,
      taste: "Salé · Épicé", desc: "Vodka, tomate, citron et épices : le cocktail du brunch.",
      ing: [{ id: "vodka", ml: 45 }, { id: "jus_tomate", ml: 90 }, { id: "jus_citron", ml: 15 }],
      pre: ["Prépare l'assaisonnement : une pincée de sel, du poivre, quelques gouttes de Tabasco et de sauce Worcestershire (si tu en as)."],
      garnish: "Une branche de céleri ou une rondelle de citron.",
    },
    {
      id: "garibaldi", name: "Garibaldi", emoji: "🥤", serve: "tall", method: BD,
      taste: "Amer · Orange", desc: "Campari et jus d'orange bien frais.",
      ing: [{ id: "campari", ml: 45 }, { id: "jus_orange", ml: 150, top: true }],
      garnish: "Une demi-rondelle d'orange.",
    },
    {
      id: "americano", name: "Americano", emoji: "🥤", serve: "tall", method: BD,
      taste: "Amer · Pétillant", desc: "Campari, vermouth rouge et eau gazeuse : le Negroni allégé.",
      ing: [{ id: "campari", ml: 30 }, { id: "vermouth_rouge", ml: 30 }, { id: "soda", ml: 60, top: true }],
      garnish: "Une demi-rondelle d'orange.",
    },
    {
      id: "sbagliato", name: "Negroni Sbagliato", emoji: "🍷", serve: "wine", method: BD,
      taste: "Amer · Pétillant", desc: "Un Negroni « raté » avec du prosecco à la place du gin.",
      ing: [{ id: "campari", ml: 30 }, { id: "vermouth_rouge", ml: 30 }, { id: "petillant", ml: 60, top: true }],
      garnish: "Une demi-rondelle d'orange.",
    },
    {
      id: "spritz", name: "Aperol Spritz", emoji: "🍷", serve: "wine", method: BD,
      taste: "Amer-doux · Pétillant", desc: "L'apéritif de l'été : prosecco, Aperol et eau gazeuse.",
      ing: [{ id: "aperol", ml: 60 }, { id: "petillant", ml: 90, top: true }, { id: "soda", ml: 30, top: true }],
      note: "Verse le prosecco avant l'Aperol pour mieux mélanger.",
      garnish: "Une demi-rondelle d'orange.",
    },
    {
      id: "hugo", name: "Hugo", emoji: "🍷", serve: "wine", method: BD,
      taste: "Floral · Frais", desc: "Sureau, prosecco et menthe : léger et floral.",
      ing: [{ id: "liqueur_sureau", ml: 20 }, { id: "petillant", ml: 90, top: true }, { id: "soda", ml: 30, top: true }, { id: "menthe", qty: 6, unit: "feuille" }],
      pre: [SMACK],
      garnish: "Un bouquet de menthe et une rondelle de citron vert.",
    },
    {
      id: "kir", name: "Kir", emoji: "🥂", serve: "flute", method: BD,
      taste: "Fruité · Léger", desc: "Vin blanc et crème de cassis.",
      ing: [{ id: "creme_cassis", ml: 10 }, { id: "vin_blanc", ml: 90, top: true }],
      garnish: "Aucune : on le boit tel quel.",
    },
    {
      id: "kir_royal", name: "Kir Royal", emoji: "🥂", serve: "flute", method: BD,
      taste: "Fruité · Festif", desc: "La version au champagne du Kir.",
      ing: [{ id: "creme_cassis", ml: 10 }, { id: "petillant", ml: 90, top: true }],
      garnish: "Aucune : on le boit tel quel.",
    },
    {
      id: "mimosa", name: "Mimosa", emoji: "🥂", serve: "flute", method: BD,
      taste: "Fruité · Léger", desc: "Champagne et jus d'orange à parts égales.",
      ing: [{ id: "jus_orange", ml: 75 }, { id: "petillant", ml: 75, top: true }],
      garnish: "Un zeste d'orange (optionnel).",
    },
    {
      id: "mint_julep", name: "Mint Julep", emoji: "🥃", serve: "rocks", method: BD, muddle: ["menthe", "sirop_sucre"],
      taste: "Frais · Boisé", desc: "Bourbon, menthe et sucre sur glace pilée : le cocktail du Kentucky Derby.",
      ing: [{ id: "whisky", ml: 60 }, { id: "menthe", qty: 8, unit: "feuille" }, sweet(10)],
      note: "Utilise de la glace pilée si possible, et remue jusqu'à ce que le verre givre.",
      garnish: "Un gros bouquet de menthe.",
    },
    {
      id: "godfather", name: "Godfather", emoji: "🥃", serve: "rocks", method: BD,
      taste: "Doux · Amande", desc: "Whisky et amaretto.",
      ing: [{ id: "whisky", ml: 40 }, { id: "amaretto", ml: 20 }],
      garnish: "Aucune, ou un zeste d'orange.",
    },
    {
      id: "black_russian", name: "Black Russian", emoji: "🥃", serve: "rocks", method: BD,
      taste: "Café · Fort", desc: "Vodka et liqueur de café.",
      ing: [{ id: "vodka", ml: 50 }, { id: "liqueur_cafe", ml: 20 }],
      garnish: "Aucune.",
    },
    {
      id: "white_russian", name: "White Russian", emoji: "🥃", serve: "rocks", method: BD,
      taste: "Café · Crémeux", desc: "Vodka, liqueur de café et crème : le cocktail du Dude.",
      ing: [{ id: "vodka", ml: 50 }, { id: "liqueur_cafe", ml: 20 }, { id: "creme", ml: 30, float: true }],
      garnish: "Aucune.",
    },
    {
      id: "el_diablo", name: "El Diablo", emoji: "🥤", serve: "tall", method: BD,
      taste: "Piquant · Cassis", desc: "Tequila, cassis, citron vert et ginger beer.",
      ing: [{ id: "tequila", ml: 40 }, { id: "creme_cassis", ml: 15 }, { id: "jus_citron_vert", ml: 15 }, { id: "ginger_beer", ml: 90, top: true }],
      garnish: "Un quartier de citron vert.",
    },
  ];

  return { CATEGORIES, INGREDIENTS, RECIPES };
})();
