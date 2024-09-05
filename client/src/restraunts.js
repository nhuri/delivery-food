const restaurants = [
  {
    id: 1,
    name: "Bella Italia",
    logo: "https://example.com/logos/bella-italia.png",
    address: "123 Pasta Street, Rome, Italy",
    location: { lat: 41.9028, lng: 12.4964 },
    menu: [
      {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, mozzarella, and basil.",
        price: 12.99,
        image: "https://example.com/menu/margherita-pizza.jpg",
      },
      {
        name: "Spaghetti Carbonara",
        description: "Spaghetti with pancetta, eggs, and parmesan cheese.",
        price: 15.99,
        image: "https://example.com/menu/spaghetti-carbonara.jpg",
      },
    ],
    statistics: {
      orders: 250,
      reviews: 120,
      rating: 4.5,
    },
  },
  {
    id: 2,
    name: "Sushi World",
    logo: "https://example.com/logos/sushi-world.png",
    address: "456 Sushi Avenue, Tokyo, Japan",
    location: { lat: 35.6762, lng: 139.6503 },
    menu: [
      {
        name: "California Roll",
        description: "Sushi roll with crab, avocado, and cucumber.",
        price: 10.99,
        image: "https://example.com/menu/california-roll.jpg",
      },
      {
        name: "Spicy Tuna Roll",
        description: "Spicy tuna with cucumber and spicy mayo.",
        price: 13.99,
        image: "https://example.com/menu/spicy-tuna-roll.jpg",
      },
    ],
    statistics: {
      orders: 180,
      reviews: 95,
      rating: 4.7,
    },
  },
];

export default restaurants;
