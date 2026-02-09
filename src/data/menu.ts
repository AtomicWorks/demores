export type MenuItem = {
  name: string;
  description: string;
  price: string;
  tags?: string[];
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export const menuData: MenuCategory[] = [
  {
    category: "Coffee",
    items: [
      {
        name: "Atomic House Drip",
        description: "Single-origin rotation, slow-filtered for clarity and sweetness.",
        price: "$4.5",
        tags: ["Hot", "Iced"]
      },
      {
        name: "Cold Bloom",
        description: "24-hour cold brew with cacao nibs and orange peel.",
        price: "$5.5",
        tags: ["Iced"]
      },
      {
        name: "Milk & Honey",
        description: "Double filter with oat milk and raw sugar infusion.",
        price: "$5.0",
        tags: ["Hot", "Iced"]
      }
    ]
  },
  {
    category: "Espresso",
    items: [
      {
        name: "Atomic Espresso",
        description: "Rich, syrupy shot with notes of cacao and molasses.",
        price: "$3.5",
        tags: ["Hot"]
      },
      {
        name: "Cappuccino",
        description: "Silky microfoam and caramelized crema.",
        price: "$5.5",
        tags: ["Hot"]
      },
      {
        name: "Midnight Mocha",
        description: "House chocolate, espresso, and cocoa dust.",
        price: "$6.0",
        tags: ["Hot", "Iced"]
      }
    ]
  },
  {
    category: "Tea",
    items: [
      {
        name: "Citrus Sencha",
        description: "Green tea with yuzu zest and jasmine petals.",
        price: "$4.5",
        tags: ["Hot", "Iced"]
      },
      {
        name: "Smoked Earl Grey",
        description: "Bergamot tea finished with cedar smoke.",
        price: "$4.5",
        tags: ["Hot"]
      }
    ]
  },
  {
    category: "Pastries",
    items: [
      {
        name: "Cardamom Bun",
        description: "Butter-laminated pastry with spiced sugar.",
        price: "$4.0"
      },
      {
        name: "Burnt Sugar Croissant",
        description: "Caramelized crust with vanilla custard.",
        price: "$4.5"
      }
    ]
  },
  {
    category: "Snacks",
    items: [
      {
        name: "Truffle Toast",
        description: "Brioche, whipped ricotta, black truffle honey.",
        price: "$7.5"
      },
      {
        name: "Seeded Granola Bowl",
        description: "Coconut yogurt, seasonal fruit, toasted seeds.",
        price: "$6.5"
      }
    ]
  }
];
