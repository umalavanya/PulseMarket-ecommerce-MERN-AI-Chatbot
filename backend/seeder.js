const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const categories = [
  {
    name: 'Audio',
    brands: ['AuraAudio', 'SoundPulse', 'SonicWave', 'Vocalis', 'ZenAcoustics'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    items: ['Headphones', 'Earbuds', 'Soundbar', 'Studio Monitor', 'Bluetooth Speaker', 'Condenser Microphone', 'DAC Amplifier', 'Noise-Canceling Pods', 'Wireless Neckband', 'Desktop Speakers'],
    descriptors: ['Studio Pro', 'Ultra Clarity', 'BassBoost X', 'Spatial Audio', 'Wireless Lossless', 'Active ANC', 'Audiophile Edition', 'Compact Travel', 'Hi-Res Audio', 'Ergonomic']
  },
  {
    name: 'Wearables',
    brands: ['PulseTech', 'ChronoFit', 'AuraWatch', 'TitanMotion', 'VigorTech'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
    ],
    items: ['Smartwatch', 'Fitness Tracker', 'Smart Ring', 'ECG Heart Band', 'GPS Sports Watch', 'Outdoor Tact Watch', 'Titanium Quartz Watch', 'Chronograph Wristwatch', 'Minimalist Dial Watch', 'Hybrid Smartwatch'],
    descriptors: ['AMOLED HD', 'Titanium Bezel', 'Solar Powered', 'Waterproof 50m', 'BioSensor Pro', 'Endurance Sport', 'Sapphire Glass', 'Ultra Light', 'Fitness Suite', 'Sleek Ceramic']
  },
  {
    name: 'Electronics',
    brands: ['ZenSys', 'HyperGear', 'VisionTech', 'NovaCore', 'ApexDigital'],
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    ],
    items: ['Ultra Slim Laptop', 'Mechanical Keyboard', '4K Web Camera', 'Wireless Mouse', 'Curved Monitor', 'Portable Power Bank', 'USB-C Docking Hub', 'External SSD Drive', 'Wi-Fi 6 Router', 'Tablet Pro'],
    descriptors: ['OLED 4K', 'RGB Backlit', 'High Speed', 'Ergonomic', '1TB NVMe', 'Fast Charge 100W', 'Aluminum Unibody', 'Thunderbolt 4', 'Zero Lag', 'Ultra Portable']
  },
  {
    name: 'Footwear',
    brands: ['AeroStep', 'StrideCraft', 'ApexSole', 'VeloKicks', 'UrbanTread'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
    ],
    items: ['Running Sneakers', 'Leather Trainers', 'Trail Hiking Boots', 'Slip-on Loafers', 'Basketball Shoes', 'Court Tennis Shoes', 'Knit Mesh Walkers', 'Minimalist Runners', 'High-Top Kicks', 'Cushioned Sandals'],
    descriptors: ['Nitrogen Cushion', 'Breathable Mesh', 'All-Terrain Traction', 'Lightweight Flyknit', 'Shock Absorbing', 'Full-Grain Leather', 'Vibrant Colorway', 'Orthotic Arch', 'Carbon Fiber Plate', 'Streetwear Edition']
  },
  {
    name: 'Accessories',
    brands: ['NomadCraft', 'AeroPack', 'UrbanCarrier', 'ApexVault', 'LuxCarry'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    ],
    items: ['Travel Backpack', 'Leather Crossbody Bag', 'Minimalist RFID Wallet', 'Polarized Sunglasses', 'Laptop Sleeve 15"', 'Duffle Travel Bag', 'Key Organizer Clip', 'Passport Travel Pouch', 'Canvas Tote Bag', 'Cardholder Case'],
    descriptors: ['Full-Grain Leather', 'Water Resistant', 'Anti-Theft RFID', 'UV400 Protection', 'Padded Protection', 'Compact Modular', 'Handcrafted', 'Minimalist Profile', 'Travel Ready', 'Heavy Duty Canvas']
  },
  {
    name: 'Gaming',
    brands: ['HyperGear', 'ViperGaming', 'RageTech', 'CyberArc', 'PhantomX'],
    images: [
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
    ],
    items: ['Esports Mouse', 'Optical Gaming Keyboard', '7.1 Surround Headset', 'RGB Desk Mat', 'Ergonomic Gaming Chair', '4K Capture Card', 'Gamepad Controller', 'Streaming Boom Arm', 'Dual Monitor Arm', 'Cooling Pad'],
    descriptors: ['8000Hz Polling', 'Hot-Swappable', 'Zero Latency', 'Chroma RGB', 'Lumbar Support', 'Pass-through 60fps', 'Tactile Feedback', 'Broadcast Grade', 'Heavy Duty Steel', 'Dual Fan Silent']
  },
  {
    name: 'Smart Home',
    brands: ['NovaHome', 'AeroLiving', 'PulseSense', 'OmniSmart', 'EchoNest'],
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80',
    ],
    items: ['Robot Vacuum', 'Smart Security Camera', 'RGB Smart LED Light', 'Smart Doorbell', 'Wi-Fi Air Purifier', 'Smart Thermostat', 'Automatic Pet Feeder', 'Smart Lock Keypad', 'Aroma Diffuser', 'Indoor Weather Station'],
    descriptors: ['LiDAR Navigation', 'Night Vision 2K', 'Voice Controlled', 'HD Video Motion', 'HEPA Filter 99.9%', 'Energy Saving', 'Programmable Timer', 'Fingerprint Unlocking', 'Ultrasonic Mist', 'App Synced']
  },
  {
    name: 'Photography',
    brands: ['VisionTech', 'ApexOptics', 'LuminaCam', 'KromaShot', 'OrbitAerial'],
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    ],
    items: ['4K Action Camera', 'Mirrorless Camera Body', '50mm f/1.8 Lens', 'Carbon Fiber Tripod', 'Bi-Color Ring Light', '3-Axis Gimbal Stabilizer', 'Foldable Drone 4K', 'Camera Leather Strap', 'ND Filter Set', 'Speedlite Flash'],
    descriptors: ['Waterproof 30m', 'Full-Frame 45MP', 'Ultra-Fast Autofocus', 'Lightweight Travel', 'Dimmable CRI 95+', 'Smooth Pan-Tilt', 'GPS Auto Return', 'Vintage Leather', 'Multi-Coated Glass', 'Wireless Trigger']
  },
  {
    name: 'Workspace',
    brands: ['ZenWork', 'ErgoCraft', 'AuraDesk', 'FormaSpace', 'ModDesk'],
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    ],
    items: ['Ergonomic Mesh Chair', 'Electric Standing Desk', 'Felt Wool Desk Mat', 'Dual Monitor Arm Stand', 'LED Eye-Care Desk Lamp', 'Under-Desk Footrest', 'Magnetic Cable Manager', 'Ceramic Mug Warmer', 'Document Tray Organizer', 'Vertical Laptop Stand'],
    descriptors: ['3D Armrests', 'Dual Motor Memory', 'Eco-Friendly Wool', 'Gas Spring Tilt', 'Touch Dimmer Warm', 'Memory Foam Cushion', 'Neodymium Magnet', 'Constant 55°C', 'Stackable Mesh', 'Solid Aluminum']
  },
  {
    name: 'Fitness',
    brands: ['AeroFit', 'PulseCore', 'TitanIron', 'VigorFlex', 'ZenGym'],
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
      'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
    ],
    items: ['Adjustable Dumbbell Set', 'Non-Slip Yoga Mat', 'Resistance Loop Bands', 'Deep Tissue Massage Gun', 'Weighted Speed Jump Rope', 'Insulated Stainless Shaker', 'Ab Roller Wheel', 'Pull-Up Bar Doorway', 'Foam Roller Massager', 'Gym Fitness Gloves'],
    descriptors: ['Fast Dial Change', 'Extra Thick 6mm', 'Latex Heavy Duty', 'Quiet Brushless Motor', 'Ball Bearing Speed', 'Vacuum Insulated', 'Dual Wheel Stability', 'Heavy Cushion Grip', 'High Density EVA', 'Breathable Padded']
  },
  {
    name: 'Home Appliances',
    brands: ['BrewMaster', 'ChefPulse', 'PureAir', 'ThermoCraft', 'VortexKitchen'],
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
      'https://images.unsplash.com/photo-1517668808822-9ebe02f2a698?w=800&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    ],
    items: ['Espresso Coffee Machine', 'Digital Air Fryer', 'High-Speed Smoothie Blender', 'Gooseneck Electric Kettle', 'Cold Brew Coffee Maker', 'Automatic Milk Frother', 'Compact Microwave Oven', 'Sous Vide Precision Cooker', 'Cast Iron Dutch Oven', 'Toaster Oven 4-Slice'],
    descriptors: ['19-Bar Pressure', 'Dual Heating Zone', '1500W Ice Crush', 'Precision Temp Dial', 'Stainless Mesh Filter', 'Induction Whisk', 'Digital Touch Control', 'Wi-Fi Immersion', 'Enamel Coated', 'Convection Air Flow']
  },
  {
    name: 'Beauty & Care',
    brands: ['GlowAura', 'SilkSkin', 'SonicSmile', 'LuxeLather', 'VigorGroom'],
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
      'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&q=80',
      'https://images.unsplash.com/photo-1512290900673-70020992890b?w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&q=80',
    ],
    items: ['Sonic Electric Toothbrush', 'Ionic Hair Dryer', 'Facial Cleansing Brush', 'Beard Trimmer Kit', 'Jade Facial Roller Set', 'LED Light Therapy Mask', 'Water Flosser Dental', 'Ceramic Hair Straightener', 'Nail Care Manicure Set', 'Aromatherapy Oil Set'],
    descriptors: ['40,000 VPM Motor', 'Negative Ion Care', 'Silicone Waterproof', 'Titanium Blades', 'Natural Rose Quartz', '7-Color Spectrum', 'Pulse Jet Pressure', 'Infrared Heat', 'Precision Stainless', 'Organic Essential']
  },
  {
    name: 'Outdoor & Camping',
    brands: ['TerraCamp', 'AlpineRidge', 'WildernessPro', 'SolarCamp', 'SummitTrek'],
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80',
      'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800&q=80',
      'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=800&q=80',
    ],
    items: ['Waterproof Pop-up Tent', 'Rechargeable Camping Lantern', 'Thermal Sleeping Bag', 'Portable Solar Power Station', 'Folding Camping Chair', 'Insulated Cooler Bag', 'Compact Gas Stove', 'Trekking Poles Pair', 'Water Filter Straw', 'Headlamp LED Torch'],
    descriptors: ['4-Person Double Layer', '1000 Lumens Dimmer', 'Zero Degree Rated', '500W LiFePO4', 'Ultra Light Aluminum', '72-Hour Ice Retention', 'Piezo Ignition', 'Carbon Fiber Lock', '0.1 Micron Membrane', 'Sensor Motion Active']
  },
  {
    name: 'Pets',
    brands: ['PawPulse', 'PetHaven', 'FurComfort', 'TailWag', 'OmniPet'],
    images: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    ],
    items: ['Automatic Pet Feeder', 'Smart Water Fountain', 'GPS Pet Tracker Collar', 'Orthopedic Dog Bed', 'Interactive Cat Laser Toy', 'Self-Cleaning Litter Box', 'Pet Grooming Vacuum', 'Dog Harness Reflective', 'Cat Scratching Post Tower', 'Travel Pet Carrier Bag'],
    descriptors: ['HD Camera Voice', 'Ultra Silent Filter', 'Real-Time Cellular', 'Memory Foam Base', 'Automatic Motion 360', 'Odor Control Sealed', 'Quiet Suction Kit', 'No-Pull Padded', 'Sisal Rope Covered', 'Airline Approved']
  },
  {
    name: 'Luggage & Travel',
    brands: ['NomadVoyage', 'ApexJet', 'SkyCarrier', 'UrbanWay', 'LuxLuggage'],
    images: [
      'https://images.unsplash.com/photo-1565026057447-b88e3f29042b?w=800&q=80',
      'https://images.unsplash.com/photo-1581553680321-4fffae59febd?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    items: ['Hardshell Carry-on Suitcase', 'Garment Travel Duffle', 'Compression Packing Cubes', 'TSA Approved Cable Lock', 'Travel Neck Pillow', 'Leather Hanging Toiletry Bag', 'Luggage Weight Scale', 'Foldable Travel Backpack', 'Passport Document Holder', 'Luggage Tag Set'],
    descriptors: ['Polycarbonate Spinner', 'Wrinkle-Free Suit', '4-Piece Mesh Set', '3-Digit Combination', 'Memory Foam Ergonomic', 'Waterproof Canvas', 'Digital LCD Screen', 'Waterproof Packable', 'RFID Blocking Leather', 'Aluminum ID Strap']
  }
];

function generate1000Products() {
  const products = [];
  const targetCount = 1000;
  const itemsPerCategory = Math.ceil(targetCount / categories.length); // ~67 per category

  for (let c = 0; c < categories.length; c++) {
    const cat = categories[c];
    for (let i = 0; i < itemsPerCategory; i++) {
      if (products.length >= targetCount) break;

      const brand = cat.brands[i % cat.brands.length];
      const item = cat.items[i % cat.items.length];
      const descriptor = cat.descriptors[i % cat.descriptors.length];
      const image = cat.images[i % cat.images.length];

      const variantNumber = Math.floor(i / cat.items.length) + 1;
      const variantSuffix = variantNumber > 1 ? ` (V${variantNumber})` : '';
      const name = `${brand} ${descriptor} ${item}${variantSuffix}`;

      let basePrice = 29.99;
      if (cat.name === 'Electronics' || cat.name === 'Photography') basePrice = 149.99 + (i * 12.5);
      else if (cat.name === 'Wearables' || cat.name === 'Gaming') basePrice = 79.99 + (i * 8.2);
      else if (cat.name === 'Workspace' || cat.name === 'Audio' || cat.name === 'Home Appliances') basePrice = 49.99 + (i * 6.4);
      else basePrice = 19.99 + (i * 3.8);

      const price = parseFloat(((basePrice % 1499.99) + 12.99).toFixed(2));
      const countInStock = (i * 7 + 5) % 95 + 3;
      const rating = parseFloat(((i % 14) * 0.1 + 3.7).toFixed(1));
      const numReviews = (i * 13 + 18) % 450 + 12;

      const description = `The ${name} is designed with premium quality, ultra-durable materials, and intuitive modern styling. Crafted by ${brand} for exceptional performance, durability, and daily elegance. Key highlights include ${descriptor.toLowerCase()} finishing, precision engineering, and ergonomic comfort.`;

      products.push({
        name,
        image,
        description,
        brand,
        category: cat.name,
        price,
        countInStock,
        rating: Math.min(5.0, rating),
        numReviews,
      });
    }
  }

  return products;
}

const userSeeds = [
  { name: 'Admin User', email: 'admin@example.com', password: 'password123', isAdmin: true },
  { name: 'John Doe', email: 'john@example.com', password: 'password123', isAdmin: false },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', isAdmin: false },
  { name: 'Robert Johnson', email: 'robert@example.com', password: 'password123', isAdmin: false },
  { name: 'Emily Davis', email: 'emily@example.com', password: 'password123', isAdmin: false },
  { name: 'Michael Wilson', email: 'michael@example.com', password: 'password123', isAdmin: false },
  { name: 'Sarah Brown', email: 'sarah@example.com', password: 'password123', isAdmin: false },
  { name: 'David Martinez', email: 'david@example.com', password: 'password123', isAdmin: false },
  { name: 'Jessica Taylor', email: 'jessica@example.com', password: 'password123', isAdmin: false },
  { name: 'James Anderson', email: 'james@example.com', password: 'password123', isAdmin: false },
  { name: 'Sophia Thomas', email: 'sophia@example.com', password: 'password123', isAdmin: false },
  { name: 'Daniel Jackson', email: 'daniel@example.com', password: 'password123', isAdmin: false },
  { name: 'White Harris', email: 'white@example.com', password: 'password123', isAdmin: false },
  { name: 'Olivia Martin', email: 'olivia@example.com', password: 'password123', isAdmin: false },
  { name: 'William Thompson', email: 'william@example.com', password: 'password123', isAdmin: false },
];

const sampleAddresses = [
  { address: '742 Evergreen Terrace', city: 'Springfield', postalCode: '97477', country: 'USA' },
  { address: '123 Market Street, Apt 4B', city: 'New York', postalCode: '10001', country: 'USA' },
  { address: '456 Ocean Avenue', city: 'Miami', postalCode: '33139', country: 'USA' },
  { address: '789 Sunset Boulevard', city: 'Los Angeles', postalCode: '90028', country: 'USA' },
  { address: '101 Pine Street', city: 'Seattle', postalCode: '98101', country: 'USA' },
  { address: '202 Michigan Avenue', city: 'Chicago', postalCode: '60601', country: 'USA' },
  { address: '303 Peachtree Road', city: 'Atlanta', postalCode: '30309', country: 'USA' },
  { address: '505 Austin Parkway', city: 'Austin', postalCode: '78701', country: 'USA' },
];

const paymentOptions = ['Credit Card', 'PayPal', 'Cash on Delivery'];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 1. Create Users
    const createdUsers = [];
    for (const u of userSeeds) {
      const newUser = await User.create(u);
      createdUsers.push(newUser);
    }
    console.log(`Successfully created ${createdUsers.length} Users.`);

    // 2. Create Products
    const generatedProducts = generate1000Products();
    console.log(`Generated ${generatedProducts.length} unique products across ${categories.length} categories.`);
    const createdProducts = await Product.insertMany(generatedProducts);
    console.log(`Successfully imported ${createdProducts.length} Products into MongoDB!`);

    // 3. Create 120 Orders
    const generatedOrders = [];
    const targetOrderCount = 120;

    for (let i = 0; i < targetOrderCount; i++) {
      const user = createdUsers[i % createdUsers.length];
      const address = sampleAddresses[i % sampleAddresses.length];
      const itemCount = (i % 3) + 1; // 1 to 3 items per order

      const orderItems = [];
      let itemsPrice = 0;

      for (let j = 0; j < itemCount; j++) {
        const productIndex = (i * 7 + j * 13) % createdProducts.length;
        const prod = createdProducts[productIndex];
        const qty = (j % 2) + 1;
        orderItems.push({
          name: prod.name,
          qty,
          image: prod.image,
          price: prod.price,
          product: prod._id,
        });
        itemsPrice += prod.price * qty;
      }

      itemsPrice = Number(itemsPrice.toFixed(2));
      const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
      const shippingPrice = itemsPrice > 150 ? 0.00 : 15.00;
      const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));
      const paymentMethod = paymentOptions[i % paymentOptions.length];

      // Spread dates back over the last 60 days
      const createdAtDate = new Date(Date.now() - (120 - i) * 12 * 60 * 60 * 1000);
      const isDelivered = i % 8 !== 0; // ~87% delivered, ~13% pending
      const deliveredAt = isDelivered ? new Date(createdAtDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null;

      generatedOrders.push({
        user: user._id,
        orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: true,
        paidAt: createdAtDate,
        isDelivered,
        deliveredAt,
        createdAt: createdAtDate,
        updatedAt: createdAtDate,
      });
    }

    await Order.insertMany(generatedOrders);
    console.log(`Successfully seeded ${generatedOrders.length} Orders into MongoDB!`);

    process.exit();
  } catch (error) {
    console.error(`Seeder Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeder Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
