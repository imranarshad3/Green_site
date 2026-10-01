import plant1 from "../../ProductsPage/Components/Collections/Plantify_Products/products/monstera.png";
import plant2 from "../../ProductsPage/Components/Collections/Plantify_Products/products/monstera.png";

export const orders = [
  {
    id: "PLT-2026-00124",
    date: "September 28, 2026",
    status: "Delivered",
    statusType: "delivered",
    total: 86,
    items: [
      {
        id: 1,
        name: "Monstera Deliciosa",
        image: plant1,
        price: 48,
        quantity: 1,
      },
      {
        id: 2,
        name: "Snake Plant",
        image: plant2,
        price: 38,
        quantity: 1,
      },
    ],
  },

  {
    id: "PLT-2026-00118",
    date: "September 21, 2026",
    status: "Shipped",
    statusType: "shipped",
    total: 64,
    items: [
      {
        id: 3,
        name: "Peace Lily",
        image: plant1,
        price: 64,
        quantity: 1,
      },
    ],
  },

  {
    id: "PLT-2026-00105",
    date: "September 12, 2026",
    status: "Processing",
    statusType: "processing",
    total: 42,
    items: [
      {
        id: 4,
        name: "Golden Pothos",
        image: plant2,
        price: 42,
        quantity: 1,
      },
    ],
  },
];
