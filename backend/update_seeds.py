import re

with open('seedProducts.js', 'r', encoding='utf-8') as f:
    content = f.read()

images = {
    "Blue Denim Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    "Black Slim Fit Jeans": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
    "Grey Formal Trousers": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    "White Cotton Shirt": "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=400&q=80",
    "Navy Blue Blazer": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    "Checked Casual Shirt": "https://images.unsplash.com/photo-1588359348347-9bc6cbea68ca?w=400&q=80",
    "Men's Polo T-Shirt": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
    "Black Leather Jacket": "https://images.unsplash.com/photo-1551028719-0125fd6b9aa8?w=400&q=80",
    "Khaki Chinos Pants": "https://images.unsplash.com/photo-1624378439575-d10c6d508215?w=400&q=80",
    "Men's Hoodie Sweatshirt": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    
    "Red Party Dress": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
    "Floral Summer Dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",
    "Women's Denim Jacket": "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80",
    "Pink Kurti": "https://images.unsplash.com/photo-1583391733958-d25e07facd44?w=400&q=80",
    "Black Evening Gown": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80",
    "Women's Palazzo Pants": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    "Blue Saree": "https://images.unsplash.com/photo-1610189014169-3733362a7fb4?w=400&q=80",
    "White Cotton Top": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    "Women's Cardigan Sweater": "https://images.unsplash.com/photo-1434389678007-926eb39db700?w=400&q=80",
    "Women's Yoga Leggings": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    
    "Kids Cartoon T-Shirt": "https://images.unsplash.com/photo-1519238263530-99abad674e21?w=400&q=80",
    "Boys Denim Shorts": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80",
    "Girls Party Frock": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80",
    "Kids School Uniform Shirt": "https://images.unsplash.com/photo-1601633519808-1cc6786a3d90?w=400&q=80",
    "Kids Winter Jacket": "https://images.unsplash.com/photo-1516480564539-77ba8ab20b34?w=400&q=80",
    "Baby Romper Suit": "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80",
    "Kids Pajama Set": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80",

    "Black Sports Jacket": "https://images.unsplash.com/photo-1500468756762-a401b6f17b46?w=400&q=80",
    "Running Track Pants": "https://images.unsplash.com/photo-1483726234545-481d6e880fcb?w=400&q=80",
    "Sports Dry-Fit T-Shirt": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
    "Gym Compression Wear": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
    "Men's Training Shorts": "https://images.unsplash.com/photo-1565314777596-7c64a39b33a5?w=400&q=80",
    "Women's Sports Bra": "https://images.unsplash.com/photo-1609804294025-cf80efab54d0?w=400&q=80",
    "Fitness Hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",

    "Black Party Suit": "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
    "Women's Sequin Dress": "https://images.unsplash.com/photo-1612336307408-888e0fdcc4dc?w=400&q=80",
    "Men's Party Blazer": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    "Cocktail Dress": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80",

    "Casual Printed T-Shirt": "https://images.unsplash.com/photo-1588628566587-dc597ec59c87?w=400&q=80",
    "Casual Denim Shorts": "https://images.unsplash.com/photo-1591195853828-11db59a3eaeb?w=400&q=80",
    "Casual Hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    "Casual Cotton Dress": "https://images.unsplash.com/photo-1515347619362-e67406aee616?w=400&q=80",
    "Oversized T-Shirt": "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&q=80"
}

def replacer(match):
    name = match.group(1)
    if name in images:
        return f'name: "{name}",\n    price: {match.group(2)},\n    category: "{match.group(3)}",\n    description: "{match.group(4)}",\n    stock: {match.group(5)},\n    image: "{images[name]}"'
    else:
        # Fallback image if not found
        return match.group(0)

# Replace the block
pattern = r'name:\s*"([^"]+)",\s*price:\s*(\d+),\s*category:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*stock:\s*(\d+),\s*image:\s*"https://placehold\.co/[^"]+"'

new_content = re.sub(pattern, replacer, content)

with open('seedProducts.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Images replaced successfully.")
