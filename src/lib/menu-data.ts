export type MenuItemSize = {
  name: "M" | "L" | "Single" | "Standard";
  label: string;
  price: number;
};

export type MenuVariety = {
  id: string;
  name: string;
  description?: string | undefined;
  priceDelta?: number | undefined;
  image?: string | undefined;
};

export type CustomizationOption = {
  id: string;
  name: string;
  price: number;
  category: "milk" | "shot" | "misto" | "syrup" | "sauce" | "spice" | "addon";
  detail?: string | undefined;
};

export type MenuItem = {
  id: string;
  name: string;
  category: "seasonal" | "coffee" | "lattes" | "cold" | "breakfast" | "lunch" | "bakery";
  categoryLabel: string;
  description: string;
  ingredients?: string | undefined;
  basePrice: number;
  image?: string | undefined;
  sizes?: MenuItemSize[] | undefined;
  varieties?: MenuVariety[] | undefined;
  allowedCustomizations?: string[] | undefined;
  popular?: boolean | undefined;
  signature?: boolean | undefined;
  tag?: string | undefined;
  dietary?: string[] | undefined;
};

export const CHALKBOARD_CUSTOMIZATIONS: CustomizationOption[] = [
  { id: "milk-alt", name: "Plant Milk Alt (Oat, Almond, Soy)", price: 0.75, category: "milk", detail: "Oat, Almond, or Soy milk" },
  { id: "extra-shot", name: "Extra Espresso Shot", price: 1.00, category: "shot", detail: "Additional double-pulled shot" },
  { id: "misto", name: "Misto Style", price: 0.50, category: "misto", detail: "Topped with warm steamed milk foam" },
  { id: "syrup-vanilla", name: "Vanilla Syrup", price: 0.75, category: "syrup", detail: "Madagascar bourbon vanilla" },
  { id: "syrup-caramel", name: "Caramel Syrup", price: 0.75, category: "syrup", detail: "Sweet rich caramel" },
  { id: "syrup-hazelnut", name: "Hazelnut Syrup", price: 0.75, category: "syrup", detail: "Roasted hazelnut syrup" },
  { id: "sauce-mocha", name: "Dark Mocha Sauce", price: 1.00, category: "sauce", detail: "Belgian chocolate sauce" },
  { id: "sauce-caramel", name: "Caramel Drizzle", price: 1.00, category: "sauce", detail: "Salted caramel drizzle" },
  { id: "turmeric-boost", name: "Turmeric Boost", price: 1.50, category: "spice", detail: "Organic golden turmeric blend" },
  { id: "add-avocado", name: "Add Fresh Smashed Avocado", price: 1.50, category: "addon", detail: "Extra portion of fresh avocado" },
];

export const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // 1. SEASONAL FEATURES (Chalkboard)
  // ==========================================
  {
    id: "pumpkin-spice-latte",
    name: "Pumpkin Spice Latte",
    category: "seasonal",
    categoryLabel: "Seasonal Features",
    description: "House-made real pumpkin puree infused with warm autumn spices, pulled espresso, and silky steamed milk.",
    ingredients: "Espresso, spiced pumpkin reduction, cinnamon, nutmeg, steamed milk",
    basePrice: 6.25,
    image: "/images/menu/pumpkin-spice-latte.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 6.25 },
      { name: "L", label: "Large", price: 7.00 },
    ],
    allowedCustomizations: ["milk-alt", "extra-shot", "syrup-vanilla", "sauce-caramel"],
    signature: true,
    popular: true,
    tag: "Autumn Feature",
  },
  {
    id: "peanut-butter-mocha",
    name: "Peanut Butter Mocha",
    category: "seasonal",
    categoryLabel: "Seasonal Features",
    description: "Decadent fusion of artisanal peanut butter, rich Dutch cocoa, double espresso, and microfoamed milk.",
    ingredients: "Double espresso, peanut butter swirl, dark chocolate sauce, steamed milk",
    basePrice: 6.50,
    image: "/images/menu/peanut-butter-mocha.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 6.50 },
      { name: "L", label: "Large", price: 7.25 },
    ],
    allowedCustomizations: ["milk-alt", "extra-shot", "sauce-mocha", "sauce-caramel"],
    signature: true,
    popular: true,
    tag: "Chalkboard Special",
  },

  // ==========================================
  // 2. BREAKFAST (From Little Umbrella Card)
  // ==========================================
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    category: "breakfast",
    categoryLabel: "Breakfast & Morning",
    description: "Toasted artisan sourdough generously topped with freshly seasoned smashed avocado, sweet ripe cherry tomatoes, and dressed arugula salad.",
    ingredients: "Livia sourdough, smashed avocado, cherry tomatoes, arugula salad, lemon olive oil",
    basePrice: 12.50,
    image: "/images/menu/avocado-toast.jpg",
    allowedCustomizations: ["add-avocado"],
    popular: true,
    signature: true,
    tag: "Counter Favorite",
    dietary: ["Vegetarian", "Vegan friendly"],
  },
  {
    id: "avocado-breakfast-wrap",
    name: "Avocado Breakfast Wrap",
    category: "breakfast",
    categoryLabel: "Breakfast & Morning",
    description: "Warm pressed wrap filled with creamy avocado, freshly baked vegetable egg frittata, melted Swiss cheese, tender baby spinach, and house tomato mayo.",
    ingredients: "Avocado, egg frittata (onion, bell pepper, spinach), swiss cheese, baby spinach, tomato mayo",
    basePrice: 10.00,
    image: "/images/menu/avocado-breakfast-wrap.jpg",
    allowedCustomizations: ["add-avocado"],
    popular: true,
    tag: "House Recipe",
    dietary: ["Vegetarian"],
  },
  {
    id: "breakfast-sandwich",
    name: "Breakfast Sandwich",
    category: "breakfast",
    categoryLabel: "Breakfast & Morning",
    description: "Fluffy scrambled eggs, melted aged sharp cheddar, and aromatic garlic mayo tucked into a soft butter-toasted potato bun with fresh peppery arugula.",
    ingredients: "Potato bun, aged cheddar, garlic mayo, scrambled eggs, arugula",
    basePrice: 9.50,
    image: "/images/menu/breakfast-sandwich.jpg",
    allowedCustomizations: ["add-avocado"],
    popular: true,
    tag: "Daily Essential",
  },

  // ==========================================
  // 3. LUNCH (From Little Umbrella Card)
  // ==========================================
  {
    id: "edamame-hummus-salad",
    name: "Edamame Hummus Salad",
    category: "lunch",
    categoryLabel: "Lunch & Bowls",
    description: "Vibrant garden bowl with housemade velvety edamame hummus, tender marinated artichoke hearts, sweet cherry tomatoes, and organic mixed greens in an aged balsamic vinaigrette.",
    ingredients: "Housemade edamame hummus, artichoke hearts, cherry tomato, mixed greens, balsamic dressing",
    basePrice: 10.00,
    image: "/images/menu/edamame-hummus-salad.jpg",
    allowedCustomizations: ["add-avocado"],
    signature: true,
    tag: "Chef's Salad",
    dietary: ["Vegetarian", "Plant-based"],
  },
  {
    id: "turkey-avocado-sandwich",
    name: "Turkey Avocado Sandwich",
    category: "lunch",
    categoryLabel: "Lunch & Sandwiches",
    description: "Oven-roasted sliced turkey breast, sliced fresh avocado, melted Swiss cheese, tangy pickled banana peppers, and garlic mayo on toasted artisan ciabatta.",
    ingredients: "Artisan ciabatta, garlic mayo, swiss cheese, banana pepper, roasted turkey, fresh avocado",
    basePrice: 10.00,
    image: "/images/menu/turkey-avocado-sandwich.jpg",
    allowedCustomizations: ["add-avocado"],
    popular: true,
    tag: "Top Pick",
  },
  {
    id: "msm-sandwich",
    name: "MSM Sandwich (Montreal Smoked Meat)",
    category: "lunch",
    categoryLabel: "Lunch & Sandwiches",
    description: "Generous layers of authentic tender Montreal smoked meat, aged Canadian white cheddar, and crisp fresh mixed greens on a toasted potato bun.",
    ingredients: "Potato bun, aged white cheddar, montreal smoked meat, mixed greens, mustard aioli",
    basePrice: 11.50,
    image: "/images/menu/msm-sandwich.jpg",
    allowedCustomizations: ["add-avocado"],
    signature: true,
    tag: "Montreal Classic",
  },
  {
    id: "grilled-cheese",
    name: "Gourmet Grilled Cheese",
    category: "lunch",
    categoryLabel: "Lunch & Sandwiches",
    description: "Golden griddled Livia sourdough layered with melted provolone and aged cheddar, elevated with our signature lemon chive mayo.",
    ingredients: "Livia sourdough, lemon chive mayo, provolone cheese, aged cheddar",
    basePrice: 11.50,
    image: "/images/menu/grilled-cheese.jpg",
    allowedCustomizations: ["add-avocado"],
    popular: true,
    tag: "Comfort Melt",
    dietary: ["Vegetarian"],
  },

  // ==========================================
  // 4. ESPRESSO & COFFEE (Chalkboard)
  // ==========================================
  {
    id: "espresso",
    name: "Espresso",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Rich, concentrated double shot featuring deep chocolate undertones and a dense golden crema.",
    ingredients: "Locally roasted double-shot espresso blend",
    basePrice: 3.00,
    image: "/images/menu/espresso.jpg",
    sizes: [{ name: "Standard", label: "Double Shot (2 oz)", price: 3.00 }],
    allowedCustomizations: ["extra-shot", "milk-alt"],
    tag: "Barista Foundation",
  },
  {
    id: "macchiato",
    name: "Macchiato",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Bold espresso double-shot marked with a spoon of silky textured microfoam.",
    ingredients: "Double espresso, dollop of textured milk foam",
    basePrice: 3.25,
    image: "/images/menu/macchiato.jpg",
    sizes: [{ name: "Standard", label: "Standard (3 oz)", price: 3.25 }],
    allowedCustomizations: ["extra-shot", "milk-alt", "syrup-vanilla", "syrup-caramel"],
    tag: "Classic Italian",
  },
  {
    id: "cortado",
    name: "Cortado",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Harmonious 1:1 balance of espresso and warm steamed milk to soften acidity while highlighting aromatics.",
    ingredients: "Equal parts espresso and warm microfoamed milk (4 oz)",
    basePrice: 3.50,
    image: "/images/menu/cortado.jpg",
    sizes: [{ name: "Standard", label: "Standard (4 oz)", price: 3.50 }],
    allowedCustomizations: ["extra-shot", "milk-alt", "syrup-vanilla"],
    popular: true,
    tag: "Barista Favorite",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Balanced espresso, silky steamed milk, and a luxurious cloud-like dome of aerated milk foam.",
    ingredients: "Double espresso, steamed milk, velvety foam cap",
    basePrice: 3.75,
    image: "/images/menu/cappuccino.jpg",
    sizes: [{ name: "Standard", label: "Standard (6 oz)", price: 3.75 }],
    allowedCustomizations: ["extra-shot", "milk-alt", "syrup-vanilla", "sauce-mocha"],
    popular: true,
    tag: "Morning Staple",
  },
  {
    id: "drip",
    name: "Drip Coffee",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Freshly brewed batch filter coffee with rotated single origins for clean, vibrant cup clarity.",
    ingredients: "Single-origin whole beans, filtered soft water",
    basePrice: 2.75,
    image: "/images/menu/drip.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 2.75 },
      { name: "L", label: "Large", price: 3.00 },
    ],
    allowedCustomizations: ["misto", "milk-alt", "syrup-vanilla", "extra-shot"],
    tag: "Batch Brewed",
  },
  {
    id: "americano",
    name: "Americano",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Double espresso pulled over hot filtered water for a clean body and pronounced crema.",
    ingredients: "Double espresso, hot water",
    basePrice: 3.25,
    image: "/images/menu/americano.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 3.25 },
      { name: "L", label: "Large", price: 3.75 },
    ],
    allowedCustomizations: ["extra-shot", "milk-alt", "misto", "syrup-vanilla"],
    tag: "Smooth Depth",
  },
  {
    id: "latte",
    name: "Caffè Latte",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Rich espresso poured over velvety steamed milk, topped with a delicate pour of latte art.",
    ingredients: "Double espresso, textured sweet microfoamed milk",
    basePrice: 4.25,
    image: "/images/menu/latte.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 4.25 },
      { name: "L", label: "Large", price: 4.75 },
    ],
    allowedCustomizations: ["milk-alt", "extra-shot", "syrup-vanilla", "syrup-caramel", "syrup-hazelnut", "sauce-caramel", "turmeric-boost"],
    popular: true,
    tag: "House Favorite",
  },
  {
    id: "mocha",
    name: "Caffè Mocha",
    category: "coffee",
    categoryLabel: "Espresso & Coffee",
    description: "Double espresso married with molten Belgian dark cocoa, steamed milk, and cocoa powder.",
    ingredients: "Espresso, dark chocolate sauce, steamed milk, cocoa",
    basePrice: 4.75,
    image: "/images/menu/mocha.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 4.75 },
      { name: "L", label: "Large", price: 5.25 },
    ],
    allowedCustomizations: ["milk-alt", "extra-shot", "sauce-mocha", "sauce-caramel", "syrup-vanilla"],
    popular: true,
    tag: "Decadent",
  },

  // ==========================================
  // 5. SPECIALTY WARMERS & TEA (Chalkboard)
  // ==========================================
  {
    id: "turmeric-latte",
    name: "Turmeric Latte",
    category: "lattes",
    categoryLabel: "Specialty Warmers & Botanicals",
    description: "Our famous house golden warmer: freshly blended turmeric, ginger root, cracked pepper, cinnamon, and silky steamed milk.",
    ingredients: "Organic golden turmeric blend, warm aromatic spices, steamed milk",
    basePrice: 4.75,
    image: "/images/menu/turmeric-latte.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 4.75 },
      { name: "L", label: "Large", price: 5.25 },
    ],
    allowedCustomizations: ["milk-alt", "turmeric-boost", "syrup-vanilla", "extra-shot"],
    signature: true,
    popular: true,
    tag: "House Signature",
    dietary: ["Anti-inflammatory"],
  },
  {
    id: "chai-latte",
    name: "Chai Latte",
    category: "lattes",
    categoryLabel: "Specialty Warmers & Botanicals",
    description: "Slow-steeped spiced black tea concentrate infused with crushed cardamom, cinnamon, clove, ginger, and steamed milk.",
    ingredients: "Spiced artisan chai reduction, steamed milk, cinnamon dust",
    basePrice: 4.50,
    image: "/images/menu/chai-latte.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 4.50 },
      { name: "L", label: "Large", price: 5.00 },
    ],
    allowedCustomizations: ["milk-alt", "extra-shot", "syrup-vanilla", "turmeric-boost"],
    popular: true,
    tag: "Spiced Warmth",
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    category: "lattes",
    categoryLabel: "Specialty Warmers & Botanicals",
    description: "Ceremonial Japanese stone-ground green tea whisked with bamboo chasen, finished with sweet silky milk microfoam.",
    ingredients: "Ceremonial Uji matcha, steamed milk",
    basePrice: 4.50,
    image: "/images/menu/matcha-latte.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 4.50 },
      { name: "L", label: "Large", price: 5.00 },
    ],
    allowedCustomizations: ["milk-alt", "syrup-vanilla", "extra-shot"],
    popular: true,
    tag: "Ceremonial Matcha",
    dietary: ["Antioxidant-Rich"],
  },
  {
    id: "london-fog",
    name: "London Fog",
    category: "lattes",
    categoryLabel: "Specialty Warmers & Botanicals",
    description: "Fragrant Earl Grey bergamot tea gently steeped with vanilla syrup and blanketed in velvety steamed milk foam.",
    ingredients: "Earl Grey tea, pure vanilla, steamed milk foam",
    basePrice: 4.75,
    image: "/images/menu/london-fog.jpg",
    sizes: [{ name: "L", label: "Large", price: 4.75 }],
    allowedCustomizations: ["milk-alt", "syrup-vanilla", "extra-shot"],
    tag: "Vancouver Tradition",
  },
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    category: "lattes",
    categoryLabel: "Specialty Warmers & Botanicals",
    description: "Rich dark cocoa melted into steamed whole milk, topped with delicate chocolate velvet.",
    ingredients: "European chocolate sauce, steamed milk, cocoa powder",
    basePrice: 3.75,
    image: "/images/menu/hot-chocolate.jpg",
    sizes: [
      { name: "M", label: "Medium", price: 3.75 },
      { name: "L", label: "Large", price: 4.25 },
    ],
    allowedCustomizations: ["milk-alt", "sauce-mocha", "sauce-caramel", "syrup-vanilla"],
    tag: "Comforting",
  },
  {
    id: "tea",
    name: "Loose Leaf Tea",
    category: "lattes",
    categoryLabel: "Specialty Warmers & Botanicals",
    description: "Artisanal hand-selected loose leaf teas steeped to perfection in hot mountain spring water.",
    ingredients: "Hand-picked whole tea leaves",
    basePrice: 3.00,
    image: "/images/menu/earl-grey-tea.jpg",
    sizes: [{ name: "L", label: "Pot / Large", price: 3.00 }],
    varieties: [
      { id: "earl-grey", name: "Earl Grey Bergamot", description: "Bold black tea scented with cold-pressed Italian bergamot", image: "/images/menu/earl-grey-tea.jpg" },
      { id: "english-breakfast", name: "English Breakfast", description: "Robust malty Ceylon & Assam blend", image: "/images/menu/earl-grey-tea.jpg" },
      { id: "jasmine-green", name: "Jasmine Blossom Green", description: "Delicate green tea layered with fragrant jasmine petals", image: "/images/menu/jasmine-green-tea.jpg" },
      { id: "peppermint", name: "Organic Peppermint", description: "Crisp, soothing caffeine-free herbal mint", image: "/images/menu/jasmine-green-tea.jpg" },
      { id: "chamomile", name: "Egyptian Chamomile", description: "Floral whole blossoms with sweet apple honey notes", image: "/images/menu/chamomile-tea.jpg" },
    ],
    allowedCustomizations: ["milk-alt", "misto"],
    tag: "Loose Leaf Pot",
  },

  // ==========================================
  // 6. CHILLED, SMOOTHIES & FRAPPES (Chalkboard)
  // ==========================================
  {
    id: "cold-brew",
    name: "Craft Cold Brew",
    category: "cold",
    categoryLabel: "Cold Brew & Chilled",
    description: "18-hour cold steeped single-origin coffee. Incredibly smooth, low acidity with natural chocolate and caramel notes.",
    ingredients: "Slow-steeped cold brew over crystal clear ice",
    basePrice: 5.00,
    image: "/images/menu/cold-brew.jpg",
    sizes: [{ name: "L", label: "Large on Ice", price: 5.00 }],
    allowedCustomizations: ["milk-alt", "syrup-vanilla", "syrup-caramel", "sauce-caramel", "extra-shot"],
    popular: true,
    tag: "18-Hour Slow Steep",
  },
  {
    id: "iced-tea",
    name: "Fresh Iced Tea",
    category: "cold",
    categoryLabel: "Cold Brew & Chilled",
    description: "Freshly brewed whole leaf tea flash-chilled over ice and finished with a wheel of fresh lemon.",
    ingredients: "Brewed tea, ice, lemon wedge",
    basePrice: 3.75,
    image: "/images/menu/citrus-black-iced-tea.jpg",
    sizes: [{ name: "L", label: "Large on Ice", price: 3.75 }],
    varieties: [
      { id: "black-lemon", name: "Classic Citrus Black", description: "Crisp black tea over ice with lemon", image: "/images/menu/citrus-black-iced-tea.jpg" },
      { id: "hibiscus-berry", name: "Hibiscus Berry Herbal", description: "Ruby tart caffeine-free herbal iced tea", image: "/images/menu/hibiscus-berry-iced-tea.jpg" },
    ],
    allowedCustomizations: ["syrup-vanilla"],
    tag: "Crisp & Chilled",
  },
  {
    id: "smoothie",
    name: "Fresh Blended Smoothie",
    category: "cold",
    categoryLabel: "Cold Brew & Chilled",
    description: "100% whole fruits and superfoods blended fresh to order without artificial sugars or syrups.",
    ingredients: "Fresh whole fruits, natural juices, nutrient-rich botanicals",
    basePrice: 7.50,
    image: "/images/menu/berry-blast.jpg",
    sizes: [{ name: "L", label: "Full Glass (16 oz)", price: 7.50 }],
    varieties: [
      {
        id: "berry-blast",
        name: "Berry Blast",
        description: "Organic blueberries, raspberries, strawberries, banana, Greek yogurt, chia seeds",
        image: "/images/menu/berry-blast.jpg",
      },
      {
        id: "turmeric-sunshine",
        name: "Turmeric Sunshine",
        description: "Alphonso mango, golden turmeric, pineapple, fresh ginger, coconut water",
        image: "/images/menu/turmeric-sunshine.jpg",
      },
      {
        id: "creamy-avocado",
        name: "Creamy Avocado",
        description: "Ripe Hass avocado, organic baby spinach, banana, almond milk, raw honey",
        image: "/images/menu/creamy-avocado.jpg",
      },
    ],
    allowedCustomizations: ["turmeric-boost", "milk-alt"],
    signature: true,
    popular: true,
    tag: "Chalkboard Special",
    dietary: ["Gluten-Free", "Blended Fresh"],
  },
  {
    id: "frappe",
    name: "Handcrafted Frappe",
    category: "cold",
    categoryLabel: "Cold Brew & Chilled",
    description: "Chilled blended espresso frappe with fresh milk and ice, topped with whipped cream and drizzle.",
    ingredients: "Espresso, cream, crushed ice, specialty flavor drizzle",
    basePrice: 5.50,
    image: "/images/menu/mocha-frappe.jpg",
    sizes: [{ name: "L", label: "Large Blended", price: 5.50 }],
    varieties: [
      {
        id: "vanilla-frappe",
        name: "Vanilla Frappe",
        description: "Espresso, pure bourbon vanilla bean, blended cream",
        image: "/images/menu/vanilla-frappe.jpg",
      },
      {
        id: "mocha-frappe",
        name: "Mocha Frappe",
        description: "Double espresso, rich Belgian dark cocoa, chocolate drizzle",
        image: "/images/menu/mocha-frappe.jpg",
      },
    ],
    allowedCustomizations: ["milk-alt", "extra-shot", "sauce-mocha", "sauce-caramel"],
    tag: "Blended Coffee",
  },

  // ==========================================
  // 7. BAKERY (From Little Umbrella)
  // ==========================================
  {
    id: "croissant",
    name: "Artisan French Croissant",
    category: "bakery",
    categoryLabel: "Bakery & Morning Bakes",
    description: "Golden, shatteringly flaky all-butter pastry laminated with French Normandy cultured butter.",
    ingredients: "Normandy cultured butter, wheat flour, slow fermented dough",
    basePrice: 4.25,
    image: "/images/menu/butter-croissant.jpg",
    varieties: [
      { id: "butter", name: "Pure Butter Croissant", description: "Traditional flaky golden layers", priceDelta: 0, image: "/images/menu/butter-croissant.jpg" },
      { id: "chocolate", name: "Pain au Chocolat", description: "Filled with two batons of 64% dark chocolate (+$0.50)", priceDelta: 0.50, image: "/images/menu/chocolate-croissant.jpg" },
      { id: "almond", name: "Twice-Baked Almond Croissant", description: "Stuffed with rich almond frangipane cream and sliced almonds (+$0.75)", priceDelta: 0.75, image: "/images/menu/almond-croissant.jpg" },
    ],
    popular: true,
    tag: "Baked Every Morning",
  },
  {
    id: "mushroom-danish",
    name: "Wild Mushroom Danish",
    category: "bakery",
    categoryLabel: "Bakery & Morning Bakes",
    description: "Flaky square puff pastry loaded with pan-roasted wild chanterelles and cremini mushrooms, garden thyme, and creamy goat cheese.",
    ingredients: "Wild mushrooms, thyme, chèvre goat cheese, puff pastry",
    basePrice: 4.75,
    image: "/images/menu/mushroom-danish.jpg",
    signature: true,
    tag: "Chef's Danish",
    dietary: ["Vegetarian"],
  },
  {
    id: "chocolate-chip-cookie",
    name: "Chocolate Chip Sea Salt Cookie",
    category: "bakery",
    categoryLabel: "Bakery & Morning Bakes",
    description: "Chewy brown-butter cookie dough loaded with pools of 70% dark chocolate and finished with flaky Maldon sea salt.",
    ingredients: "Brown butter, dark chocolate chunks, Maldon sea salt",
    basePrice: 3.50,
    image: "/images/menu/chocolate-chip-cookie.jpg",
    popular: true,
    tag: "Maldon Sea Salt",
  },
];

export const CATEGORIES = [
  { id: "all", label: "Full Collection", icon: "Sparkles" },
  { id: "seasonal", label: "Seasonal Features", icon: "Flame" },
  { id: "breakfast", label: "Breakfast & Morning", icon: "UtensilsCrossed" },
  { id: "lunch", label: "Lunch & Sandwiches", icon: "Sandwich" },
  { id: "coffee", label: "Espresso & Coffee", icon: "Coffee" },
  { id: "lattes", label: "Specialty Warmers", icon: "CupSoda" },
  { id: "cold", label: "Chilled & Smoothies", icon: "Snowflake" },
  { id: "bakery", label: "Fresh Bakery", icon: "Croissant" },
] as const;

export const FEATURED_VARIETIES = [
  {
    id: "croissant-trio",
    title: "Artisan French Croissant Trio",
    category: "Fresh Morning Bakery",
    description: "Slow-fermented dough laminated with Normandy butter, baked fresh every morning on West 10th.",
    varieties: [
      { name: "Pure Butter Croissant", price: "$4.25", image: "/images/menu/butter-croissant.jpg", tag: "Golden Honeycomb" },
      { name: "Pain au Chocolat", price: "$4.75", image: "/images/menu/chocolate-croissant.jpg", tag: "64% Dark Chocolate Batons" },
      { name: "Twice-Baked Almond", price: "$5.00", image: "/images/menu/almond-croissant.jpg", tag: "Almond Frangipane Cream" },
    ],
  },
  {
    id: "smoothie-trio",
    title: "100% Whole Superfood Smoothies",
    category: "Fresh Chilled Blends",
    description: "Real whole fruits and organic superfoods blended fresh to order without artificial syrups.",
    varieties: [
      { name: "Berry Blast", price: "$7.50", image: "/images/menu/berry-blast.jpg", tag: "Wild Berries & Greek Yogurt" },
      { name: "Turmeric Sunshine", price: "$7.50", image: "/images/menu/turmeric-sunshine.jpg", tag: "Mango, Ginger & Turmeric" },
      { name: "Creamy Avocado", price: "$7.50", image: "/images/menu/creamy-avocado.jpg", tag: "Hass Avocado & Almond Milk" },
    ],
  },
  {
    id: "frappe-iced-tea",
    title: "Chilled Frappes & Steeped Iced Teas",
    category: "Cold Brew & Chilled",
    description: "Handcrafted dessert frappes with whipped cream, and flash-chilled whole-leaf iced teas.",
    varieties: [
      { name: "Mocha Frappe", price: "$5.50", image: "/images/menu/mocha-frappe.jpg", tag: "Belgian Dark Cocoa" },
      { name: "Vanilla Frappe", price: "$5.50", image: "/images/menu/vanilla-frappe.jpg", tag: "Bourbon Vanilla Bean" },
      { name: "Citrus Black Iced Tea", price: "$3.75", image: "/images/menu/citrus-black-iced-tea.jpg", tag: "Fresh Lemon Wheels" },
      { name: "Hibiscus Berry Iced Tea", price: "$3.75", image: "/images/menu/hibiscus-berry-iced-tea.jpg", tag: "Tart Ruby Botanicals" },
    ],
  },
  {
    id: "loose-leaf-teas",
    title: "Artisanal Loose Leaf Teas",
    category: "Steeped Pots & Infusions",
    description: "Hand-picked whole tea leaves and delicate blossom botanicals steeped in mountain spring water.",
    varieties: [
      { name: "Earl Grey Bergamot", price: "$3.00", image: "/images/menu/earl-grey-tea.jpg", tag: "Italian Bergamot" },
      { name: "Jasmine Blossom Green", price: "$3.00", image: "/images/menu/jasmine-green-tea.jpg", tag: "Fragrant Jasmine Petals" },
      { name: "Egyptian Chamomile", price: "$3.00", image: "/images/menu/chamomile-tea.jpg", tag: "Whole Honey Blossoms" },
    ],
  },
];
