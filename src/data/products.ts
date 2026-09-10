export interface ProductFlavor {
  id: string;
  name: string;
  badge: string;
  color: string;
  accentBg: string;
  hueFilter: string;
  description: string;
  scentNotes: string[];
}

export interface ProductSize {
  id: string;
  name: string;
  volume: string;
  price: number;
  originalPrice?: number;
  savingsBadge?: string;
  popular?: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  flavor?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  category: "litter" | "accessory" | "care";
  description: string;
  longDescription: string;
  flavors?: ProductFlavor[];
  sizes: ProductSize[];
  features: string[];
  benefits: { title: string; desc: string; icon: string }[];
  ingredients: { name: string; percentage: string; purpose: string }[];
  usageSteps: { step: number; title: string; instruction: string }[];
  faqs: { question: string; answer: string }[];
  reviews: ProductReview[];
}

export const PRODUCTS: Product[] = [
  {
    id: "clean-bean",
    slug: "clean-bean",
    name: "Clean Bean Tofu Litter",
    subtitle: "Original Organic Tofu Formula",
    tagline: "100% natural, flushable, dust-free cat litter crafted from upcycled food-grade soybean fiber.",
    basePrice: 19.99,
    rating: 4.9,
    reviewCount: 1284,
    image: "/product-bag.png",
    badge: "Best Seller",
    category: "litter",
    description: "The revolutionary organic cat litter that started it all. Say goodbye to dust clouds and heavy clay, and hello to effortless, flushable scooping. Plant-based and purr-fectly safe.",
    longDescription: "MeowGanics Clean Bean is made with 100% human-grade, non-GMO food soybean fiber. Our innovative ultra-tight pellet extrusion locks in odors instantly while forming firm, mess-free clumps in under 2 seconds. Free from harmful silica dust, synthetic perfumes, and chemical binders, it is completely biodegradable and safe to flush directly down the toilet in small scoops.",
    flavors: [
      {
        id: "original",
        name: "Original Unscented",
        badge: "Pure & Natural",
        color: "#8FBEE5",
        accentBg: "#EBF4FC",
        hueFilter: "hue-rotate(0deg)",
        description: "Classic fragrance-free formula for sensitive feline noses and discerning pet parents.",
        scentNotes: ["Subtle natural soybean", "Zero artificial perfumes", "Hypoallergenic"]
      },
      {
        id: "berry",
        name: "Berry Fresh",
        badge: "Odor Defense",
        color: "#DB2777",
        accentBg: "#FCE7F3",
        hueFilter: "hue-rotate(90deg)",
        description: "Infused with natural wild berry botanicals that neutralize ammonia odors upon contact.",
        scentNotes: ["Wild raspberry extract", "Sweet blueberry aroma", "Invigorating"]
      },
      {
        id: "peach",
        name: "Peach Paradise",
        badge: "Sweet Aroma",
        color: "#EA580C",
        accentBg: "#FFEDD5",
        hueFilter: "hue-rotate(180deg)",
        description: "Refreshing natural summer peach extracts that leave the litter room smelling like a sunny orchard.",
        scentNotes: ["Ripe white peach", "Gentle blossom notes", "Refreshing"]
      },
      {
        id: "green-tea",
        name: "Fresh Green Tea",
        badge: "Active Catechins",
        color: "#059669",
        accentBg: "#D1FAE5",
        hueFilter: "hue-rotate(270deg)",
        description: "Fortified with natural green tea catechins for supreme antibacterial and deodorizing power.",
        scentNotes: ["Organic matcha essence", "Crisp herbal botanicals", "Purifying"]
      }
    ],
    sizes: [
      {
        id: "6l",
        name: "Single Bag",
        volume: "6 Liters (~2.5 kg)",
        price: 19.99,
        originalPrice: 22.00,
        popular: false
      },
      {
        id: "12l",
        name: "2-Bag Duo Pack",
        volume: "12 Liters (~5.0 kg)",
        price: 35.99,
        originalPrice: 44.00,
        savingsBadge: "SAVE 18%",
        popular: true
      },
      {
        id: "18l",
        name: "3-Bag Multi-Cat Box",
        volume: "18 Liters (~7.5 kg)",
        price: 49.99,
        originalPrice: 66.00,
        savingsBadge: "BEST VALUE • SAVE 24%",
        popular: false
      }
    ],
    features: [
      "99.9% Dust-Free — Zero silica dust",
      "2-Second Rapid Clumping technology",
      "Septic & Toilet Safe (Flushable)",
      "Gentle cylindrical pellets don't stick to paws",
      "Upcycled food-grade soybean fiber",
      "30-Day Odor Lock guarantee"
    ],
    benefits: [
      {
        title: "99.9% Dust-Free",
        desc: "Protect your cat's delicate lungs and say farewell to dusty paw prints on furniture.",
        icon: "✨"
      },
      {
        title: "Flushable & Biodegradable",
        desc: "Dissolves in water within seconds. Scoop straight into the toilet or compost cleanly.",
        icon: "🚽"
      },
      {
        title: "Instant Rock-Solid Clumps",
        desc: "Forms tight, non-stick clumps in 2 seconds that never crumble when sifting.",
        icon: "💧"
      },
      {
        title: "Ultra Soft on Tender Paws",
        desc: "Polished 2mm micro-pellets are soft and soothing for kittens and senior cats alike.",
        icon: "🐾"
      }
    ],
    ingredients: [
      { name: "Upcycled Soybean Fiber", percentage: "72%", purpose: "Core absorbent structure and high moisture retention" },
      { name: "Food-Grade Corn Starch", percentage: "20%", purpose: "Natural binding agent that enables instant clump lock" },
      { name: "Plant-Based Guar Gum", percentage: "6%", purpose: "Organic vegetable gum for clump tensile strength" },
      { name: "Natural Botanical Extracts", percentage: "2%", purpose: "Ammonia neutralizing bio-enzymes & gentle aroma" }
    ],
    usageSteps: [
      {
        step: 1,
        title: "Fill the Litter Pan",
        instruction: "Pour Clean Bean to a depth of 2 to 3 inches (5-8 cm) in a clean, dry litter box."
      },
      {
        step: 2,
        title: "Daily Sifting",
        instruction: "Scoop out solid waste and urine clumps daily with our Zen Sifter Scoop."
      },
      {
        step: 3,
        title: "Flush or Compost",
        instruction: "Drop clumps directly into the toilet bowl, let soak for 15 seconds, and flush safely."
      },
      {
        step: 4,
        title: "Top Off",
        instruction: "Add fresh Clean Bean as needed to maintain 2-3 inch depth. Full change recommended every 3-4 weeks."
      }
    ],
    faqs: [
      {
        question: "Is Clean Bean truly safe to flush down the toilet?",
        answer: "Yes! Because Clean Bean is made of 100% natural, water-soluble plant fibers, it completely breaks down into harmless organic matter when submerged in water. We recommend flushing 1-2 clumps at a time."
      },
      {
        question: "How long does one 6L bag last for one cat?",
        answer: "One 6L bag typically lasts 3 to 4 weeks for a single average-sized adult cat when scooped daily and maintained at the recommended 2-3 inch depth."
      },
      {
        question: "What if my cat tries to eat it?",
        answer: "Clean Bean is made exclusively from 100% food-grade soybean fiber, corn starch, and natural guar gum. If an inquisitive kitten swallows a pellet, it will digest harmlessly without causing gastrointestinal blockage."
      },
      {
        question: "How do I transition my cat from clay or silica litter?",
        answer: "Mix 1/3 Clean Bean with 2/3 of your previous litter during Week 1. Move to a 50/50 mix in Week 2, and 100% Clean Bean by Week 3. Most cats adapt immediately thanks to the soft texture."
      }
    ],
    reviews: [
      {
        id: "r1",
        author: "Sarah M.",
        rating: 5,
        date: "2 days ago",
        verified: true,
        title: "Total game changer for my apartment!",
        comment: "I live in a small NYC studio with two British Shorthairs. Regular clay litter created a cloud of dust and tracked everywhere. Clean Bean Peach smells incredible, doesn't track, and being able to flush it is life-changing!",
        flavor: "Peach Paradise"
      },
      {
        id: "r2",
        author: "Marcus T.",
        rating: 5,
        date: "1 week ago",
        verified: true,
        title: "My asthma is completely relieved",
        comment: "Zero dust means both my cat Luna and I can breathe easy. The clumps are tight and don't stick to the bottom of the box. Highly recommend the 3-bag box subscription.",
        flavor: "Original Unscented"
      },
      {
        id: "r3",
        author: "Elena R.",
        rating: 5,
        date: "2 weeks ago",
        verified: true,
        title: "The Green Tea scent is pure magic",
        comment: "Not overpowering at all, just a fresh, natural herbal breeze that actually stops ammonia in its tracks. Plus, my cat took to it on the very first day!",
        flavor: "Fresh Green Tea"
      },
      {
        id: "r4",
        author: "David K.",
        rating: 4,
        date: "3 weeks ago",
        verified: true,
        title: "Super easy cleanup, great clumping",
        comment: "Clumps in literally two seconds. I paired it with their Zen Scoop and bathroom cleanup takes less than 30 seconds a day now.",
        flavor: "Berry Fresh"
      }
    ]
  },
  {
    id: "zen-scoop",
    slug: "zen-scoop",
    name: "The Zen Sifter Scoop",
    subtitle: "Ergonomic Tofu Pellet Sifter",
    tagline: "Custom-spaced geometric slats engineered specifically for cylindrical tofu pellets without wasting clean litter.",
    basePrice: 18.00,
    rating: 4.8,
    reviewCount: 420,
    image: "/product-bag.png", // Will render with custom SVG/UI styling
    badge: "Essential",
    category: "accessory",
    description: "Designed exclusively for Clean Bean. Precision non-stick aluminum alloy with an ergonomic FSC-certified solid beechwood handle.",
    longDescription: "Standard scoops break tofu pellets or trap excess clean litter. The Zen Sifter Scoop features tapered 5.5mm slot apertures that allow clean Clean Bean pellets to glide right back into the box in a single shake while cleanly catching clumps.",
    sizes: [
      {
        id: "standard",
        name: "Standard Sifter",
        volume: "1 unit",
        price: 18.00
      }
    ],
    features: [
      "Precision 5.5mm slots optimized for tofu litter",
      "Ergonomic smoothed beechwood grip",
      "Matte non-stick aluminum shovel",
      "Wall-mounting silicone hang loop included"
    ],
    benefits: [
      {
        title: "Saves 30% Litter",
        desc: "Clean pellets drop through effortlessly so you only throw away actual waste.",
        icon: "⚖️"
      },
      {
        title: "Non-Stick Surface",
        desc: "Hydrophobic matte coating prevents damp litter from clinging to the shovel.",
        icon: "✨"
      }
    ],
    ingredients: [
      { name: "Recycled Aluminum Alloy", percentage: "70%", purpose: "Ultra-light durable scooper body" },
      { name: "FSC Beechwood Handle", percentage: "30%", purpose: "Comfort grip with natural antibacterial properties" }
    ],
    usageSteps: [
      {
        step: 1,
        title: "Glide & Lift",
        instruction: "Slide gently under the clump at a 45-degree angle."
      },
      {
        step: 2,
        title: "Gentle Sift",
        instruction: "Give one gentle horizontal shake to allow clean pellets to filter through."
      }
    ],
    faqs: [
      {
        question: "Does it work with non-tofu litters?",
        answer: "Yes, it works well with all pellet and clumping litters, though it is calibrated specifically for cylindrical tofu litters."
      }
    ],
    reviews: [
      {
        id: "z1",
        author: "Chloe P.",
        rating: 5,
        date: "5 days ago",
        verified: true,
        title: "Best scoop I've ever owned",
        comment: "Sturdy, feels great in the hand, and doesn't bend like plastic ones."
      }
    ]
  },
  {
    id: "cloud-mat",
    slug: "cloud-mat",
    name: "Cloud Trap Litter Mat",
    subtitle: "Double-Layer Honeycomb Catcher",
    tagline: "Catches 99% of stray litter pellets with an easy-pour envelope design to recycle clean litter back into the box.",
    basePrice: 28.00,
    rating: 4.9,
    reviewCount: 310,
    image: "/product-bag.png",
    badge: "New",
    category: "accessory",
    description: "Soft on delicate feline paws with deep honeycomb pockets that trap tracking pellets instantly. Waterproof base protects floors.",
    longDescription: "Crafted with BPA-free, odorless EVA foam, the Cloud Trap Mat stops litter scatter dead in its tracks. The top honeycomb layer lets stray pellets fall into the bottom waterproof barrier. Simply open the side pocket to pour captured clean litter right back into your cat's box!",
    sizes: [
      {
        id: "large",
        name: "Large (24\" x 18\")",
        volume: "Single Box Setup",
        price: 28.00
      },
      {
        id: "xl",
        name: "XL Jumbo (30\" x 24\")",
        volume: "Multi-Box Setup",
        price: 36.00,
        originalPrice: 42.00,
        savingsBadge: "SAVE $6"
      }
    ],
    features: [
      "Dual-layer honeycomb pellet trap",
      "Easy-pour open envelope design",
      "100% waterproof & urine-proof bottom",
      "Ultra-soft EVA foam gentle on sensitive paws"
    ],
    benefits: [
      {
        title: "Zero Tracking",
        desc: "Captures stray pellets before they make it onto hardwood or rugs.",
        icon: "🐾"
      },
      {
        title: "Easy Recycling",
        desc: "Pour clean trapped pellets straight back into the box in 5 seconds.",
        icon: "🔄"
      }
    ],
    ingredients: [
      { name: "Non-Toxic EVA Foam", percentage: "100%", purpose: "BPA-free, phthalate-free cushioning" }
    ],
    usageSteps: [
      {
        step: 1,
        title: "Position at Entry",
        instruction: "Place mat directly outside the litter box exit."
      },
      {
        step: 2,
        title: "Pour & Reuse",
        instruction: "Pinch the edges open weekly and tip clean trapped pellets back into the litter pan."
      }
    ],
    faqs: [
      {
        question: "How do I wash the mat?",
        answer: "Simply rinse with warm soapy water in the shower or spray with a hose and air dry. It dries completely in minutes."
      }
    ],
    reviews: [
      {
        id: "c1",
        author: "Liam H.",
        rating: 5,
        date: "1 week ago",
        verified: true,
        title: "Saved my floors!",
        comment: "My cat used to sprint out of the box kicking pellets everywhere. This mat caught everything."
      }
    ]
  },
  {
    id: "catnip-mist",
    slug: "catnip-mist",
    name: "Pure Organic Catnip Mist",
    subtitle: "Steam-Distilled Euphoria Spray",
    tagline: "100% pure organic catnip hydrosol spray to encourage positive scratching and calm play.",
    basePrice: 14.00,
    rating: 4.9,
    reviewCount: 180,
    image: "/product-bag.png",
    badge: "Organic",
    category: "care",
    description: "Steam-distilled from organic Canadian nepeta cataria. Leaves zero flaky mess and activates instant joyful zoomies.",
    longDescription: "Our pure steam distillation extracts the potent nepetalactone essential oils from farm-grown organic catnip leaves. Spray on scratchers, cat trees, or toys for instant mess-free playtime excitement.",
    sizes: [
      {
        id: "100ml",
        name: "100ml Spray Bottle",
        volume: "100 ml (~500 sprays)",
        price: 14.00
      }
    ],
    features: [
      "100% Certified Organic Canadian catnip",
      "Steam-distilled hydrosol — no messy flakes",
      "Safe on fabrics, scratchers, and toys",
      "Vet formulated non-addictive formula"
    ],
    benefits: [
      {
        title: "Mess-Free Fun",
        desc: "Get all the joyful benefits of catnip without bits stuck in your carpet.",
        icon: "🌿"
      }
    ],
    ingredients: [
      { name: "Organic Nepeta Cataria Hydrosol", percentage: "100%", purpose: "Pure active essential oil distillate" }
    ],
    usageSteps: [
      {
        step: 1,
        title: "Shake & Mist",
        instruction: "Shake bottle well and spray 2-3 pumps onto your cat's favorite scratcher or bed."
      }
    ],
    faqs: [
      {
        question: "Will it stain my furniture?",
        answer: "No, our clear distilled hydrosol is water-based and leaves no oily residue or stains on fabrics."
      }
    ],
    reviews: [
      {
        id: "cm1",
        author: "Jessica B.",
        rating: 5,
        date: "2 weeks ago",
        verified: true,
        title: "My cats went crazy for this!",
        comment: "Great quality spray, no mess like dry catnip flakes."
      }
    ]
  }
];

export function getProductById(id: string): Product {
  return PRODUCTS.find((p) => p.id === id || p.slug === id) || PRODUCTS[0];
}

export function getProductBySlug(slug: string): Product {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}
