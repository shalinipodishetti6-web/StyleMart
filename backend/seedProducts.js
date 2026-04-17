import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  // MEN CATEGORY
  {
    name: "Blue Denim Jeans",
    price: 899,
    category: "jeans",
    description: "Comfortable blue denim jeans for everyday wear",
    stock: 35,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Black Slim Fit Jeans",
    price: 999,
    category: "jeans",
    description: "Stylish black slim fit jeans perfect for casual occasions",
    stock: 28,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
    rating: 4.3,
    reviews: []
  },
  {
    name: "Grey Formal Trousers",
    price: 799,
    category: "formal",
    description: "Professional grey formal trousers for office wear",
    stock: 22,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    rating: 4.6,
    reviews: []
  },
  {
    name: "White Cotton Shirt",
    price: 699,
    category: "shirt",
    description: "Classic white cotton shirt made from premium fabric",
    stock: 40,
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=400&q=80",
    rating: 4.4,
    reviews: []
  },
  {
    name: "Navy Blue Blazer",
    price: 1999,
    category: "jacket",
    description: "Elegant navy blue blazer for formal events",
    stock: 18,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    rating: 4.7,
    reviews: []
  },
  {
    name: "Checked Casual Shirt",
    price: 749,
    category: "shirt",
    description: "Trendy checked casual shirt for weekend wear",
    stock: 32,
    image: "https://images.unsplash.com/photo-1588359348347-9bc6cbea68ca?w=400&q=80",
    rating: 4.2,
    reviews: []
  },
  {
    name: "Men's Polo T-Shirt",
    price: 499,
    category: "shirt",
    description: "Comfortable polo t-shirt for casual looks",
    stock: 50,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Black Leather Jacket",
    price: 2299,
    category: "jacket",
    description: "Premium black leather jacket for a bold statement",
    stock: 15,
    image: "https://images.unsplash.com/photo-1551028719-0125fd6b9aa8?w=400&q=80",
    rating: 4.8,
    reviews: []
  },
  {
    name: "Khaki Chinos Pants",
    price: 899,
    category: "casual",
    description: "Versatile khaki chinos for casual and semi-formal wear",
    stock: 28,
    image: "https://images.unsplash.com/photo-1624378439575-d10c6d508215?w=400&q=80",
    rating: 4.4,
    reviews: []
  },
  {
    name: "Men's Hoodie Sweatshirt",
    price: 999,
    category: "casual",
    description: "Warm and cozy hoodie sweatshirt for cool weather",
    stock: 25,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    rating: 4.6,
    reviews: []
  },

  // WOMEN CATEGORY
  {
    name: "Red Party Dress",
    price: 1299,
    category: "dress",
    description: "Stunning red party dress for special occasions",
    stock: 20,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
    rating: 4.7,
    reviews: []
  },
  {
    name: "Floral Summer Dress",
    price: 999,
    category: "dress",
    description: "Beautiful floral summer dress perfect for sunny days",
    stock: 30,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Women's Denim Jacket",
    price: 1499,
    category: "jacket",
    description: "Classic denim jacket for layering and style",
    stock: 24,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80",
    rating: 4.4,
    reviews: []
  },
  {
    name: "Pink Kurti",
    price: 699,
    category: "casual",
    description: "Traditional pink kurti perfect for everyday wear",
    stock: 35,
    image: "https://images.unsplash.com/photo-1583391733958-d25e07facd44?w=400&q=80",
    rating: 4.3,
    reviews: []
  },
  {
    name: "Black Evening Gown",
    price: 1999,
    category: "formal",
    description: "Elegant black evening gown for formal dinners and events",
    stock: 12,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80",
    rating: 4.8,
    reviews: []
  },
  {
    name: "Women's Palazzo Pants",
    price: 799,
    category: "casual",
    description: "Comfortable palazzo pants for casual outings",
    stock: 28,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    rating: 4.2,
    reviews: []
  },
  {
    name: "Blue Saree",
    price: 1599,
    category: "formal",
    description: "Traditional blue saree with intricate designs",
    stock: 16,
    image: "https://images.unsplash.com/photo-1610189014169-3733362a7fb4?w=400&q=80",
    rating: 4.6,
    reviews: []
  },
  {
    name: "White Cotton Top",
    price: 499,
    category: "shirt",
    description: "Simple white cotton top for everyday comfort",
    stock: 45,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    rating: 4.3,
    reviews: []
  },
  {
    name: "Women's Cardigan Sweater",
    price: 899,
    category: "casual",
    description: "Cozy cardigan sweater for layering and warmth",
    stock: 26,
    image: "https://images.unsplash.com/photo-1434389678007-926eb39db700?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Women's Yoga Leggings",
    price: 599,
    category: "sports",
    description: "Stretchy yoga leggings for fitness and comfort",
    stock: 38,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    rating: 4.4,
    reviews: []
  },

  // KIDS CATEGORY
  {
    name: "Kids Cartoon T-Shirt",
    price: 299,
    category: "kids",
    description: "Colorful cartoon t-shirt for kids",
    stock: 50,
    image: "https://images.unsplash.com/photo-1519238263530-99abad674e21?w=400&q=80",
    rating: 4.2,
    reviews: []
  },
  {
    name: "Boys Denim Shorts",
    price: 399,
    category: "kids",
    description: "Durable denim shorts for active boys",
    stock: 35,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80",
    rating: 4.0,
    reviews: []
  },
  {
    name: "Girls Party Frock",
    price: 699,
    category: "kids",
    description: "Beautiful party frock for girls' special occasions",
    stock: 22,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Kids School Uniform Shirt",
    price: 349,
    category: "kids",
    description: "Comfortable school uniform shirt for daily wear",
    stock: 48,
    image: "https://images.unsplash.com/photo-1601633519808-1cc6786a3d90?w=400&q=80",
    rating: 4.1,
    reviews: []
  },
  {
    name: "Kids Winter Jacket",
    price: 999,
    category: "kids",
    description: "Warm winter jacket to keep kids cozy",
    stock: 20,
    image: "https://images.unsplash.com/photo-1516480564539-77ba8ab20b34?w=400&q=80",
    rating: 4.4,
    reviews: []
  },
  {
    name: "Baby Romper Suit",
    price: 499,
    category: "kids",
    description: "Cute and comfortable romper suit for babies",
    stock: 30,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80",
    rating: 4.3,
    reviews: []
  },
  {
    name: "Kids Pajama Set",
    price: 549,
    category: "kids",
    description: "Soft and cozy pajama set for kids",
    stock: 32,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80",
    rating: 4.2,
    reviews: []
  },

  // SPORTS CATEGORY
  {
    name: "Black Sports Jacket",
    price: 1199,
    category: "sports",
    description: "Professional black sports jacket for athletes",
    stock: 26,
    image: "https://images.unsplash.com/photo-1500468756762-a401b6f17b46?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Running Track Pants",
    price: 699,
    category: "sports",
    description: "Comfortable track pants for running and training",
    stock: 34,
    image: "https://images.unsplash.com/photo-1483726234545-481d6e880fcb?w=400&q=80",
    rating: 4.3,
    reviews: []
  },
  {
    name: "Sports Dry-Fit T-Shirt",
    price: 499,
    category: "sports",
    description: "Moisture-wicking dry-fit t-shirt for sports",
    stock: 44,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
    rating: 4.4,
    reviews: []
  },
  {
    name: "Gym Compression Wear",
    price: 899,
    category: "sports",
    description: "Supportive compression wear for gym workouts",
    stock: 28,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
    rating: 4.6,
    reviews: []
  },
  {
    name: "Men's Training Shorts",
    price: 549,
    category: "sports",
    description: "Lightweight training shorts for workouts",
    stock: 37,
    image: "https://images.unsplash.com/photo-1565314777596-7c64a39b33a5?w=400&q=80",
    rating: 4.2,
    reviews: []
  },
  {
    name: "Women's Sports Bra",
    price: 499,
    category: "sports",
    description: "Supportive sports bra for all activities",
    stock: 42,
    image: "https://images.unsplash.com/photo-1609804294025-cf80efab54d0?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Fitness Hoodie",
    price: 999,
    category: "sports",
    description: "Warm fitness hoodie for pre and post-workout",
    stock: 24,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    rating: 4.4,
    reviews: []
  },

  // PARTY/FORMAL CATEGORY
  {
    name: "Black Party Suit",
    price: 2299,
    category: "formal",
    description: "Sophisticated black party suit for men",
    stock: 14,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
    rating: 4.7,
    reviews: []
  },
  {
    name: "Women's Sequin Dress",
    price: 1499,
    category: "formal",
    description: "Glamorous sequin dress for parties and celebrations",
    stock: 18,
    image: "https://images.unsplash.com/photo-1612336307408-888e0fdcc4dc?w=400&q=80",
    rating: 4.6,
    reviews: []
  },
  {
    name: "Men's Party Blazer",
    price: 1799,
    category: "formal",
    description: "Stylish party blazer for formal events",
    stock: 16,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    rating: 4.5,
    reviews: []
  },
  {
    name: "Cocktail Dress",
    price: 1399,
    category: "formal",
    description: "Elegant cocktail dress for evening events",
    stock: 20,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80",
    rating: 4.6,
    reviews: []
  },

  // CASUAL CATEGORY
  {
    name: "Casual Printed T-Shirt",
    price: 399,
    category: "casual",
    description: "Trendy casual printed t-shirt",
    stock: 48,
    image: "https://images.unsplash.com/photo-1588628566587-dc597ec59c87?w=400&q=80",
    rating: 4.2,
    reviews: []
  },
  {
    name: "Casual Denim Shorts",
    price: 499,
    category: "casual",
    description: "Comfortable denim shorts for casual outings",
    stock: 36,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a3eaeb?w=400&q=80",
    rating: 4.1,
    reviews: []
  },
  {
    name: "Casual Hoodie",
    price: 899,
    category: "casual",
    description: "Cozy casual hoodie for relaxed days",
    stock: 32,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    rating: 4.4,
    reviews: []
  },
  {
    name: "Casual Cotton Dress",
    price: 999,
    category: "casual",
    description: "Simple and comfortable cotton dress",
    stock: 26,
    image: "https://images.unsplash.com/photo-1515347619362-e67406aee616?w=400&q=80",
    rating: 4.3,
    reviews: []
  },
  {
    name: "Oversized T-Shirt",
    price: 449,
    category: "casual",
    description: "Trendy oversized t-shirt for a relaxed fit",
    stock: 40,
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&q=80",
    rating: 4.2,
    reviews: []
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stylemart');
    console.log('MongoDB connected for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${result.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
