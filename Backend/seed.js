const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const User   = require('./models/User');
const Mess   = require('./models/Mess');
const Review = require('./models/Review');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartmess';
const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log(' Connected to MongoDB');
  // Clear existing data
  await User.deleteMany();
  await Mess.deleteMany();
  await Review.deleteMany();
  console.log(' Cleared old data');
  // ─── USERS ─────────────────────────────────────────────────────────────────
  const hashedPass = 'password123';
const adminPass  = 'admin@2024';
  const admin = await User.create({
    name: 'Dr. Priya Menon', email: 'admin@smartmess.com',
    password: adminPass, role: 'admin', avatar: 'PM', isActive: true
  });
  const owner1 = await User.create({
    name: 'Rajesh Patel', email: 'rajesh@mess.com',
    password: hashedPass, role: 'owner', avatar: 'RP', isActive: true
  });
  const owner2 = await User.create({
    name: 'Meena Gupta', email: 'meena@mess.com',
    password: hashedPass, role: 'owner', avatar: 'MG', isActive: true
  });
  const owner3 = await User.create({
    name: 'Kiran Nair', email: 'kiran@mess.com',
    password: hashedPass, role: 'owner', avatar: 'KN', isActive: true
  });
  const owner4 = await User.create({
    name: 'Salim Khan', email: 'salim@mess.com',
    password: hashedPass, role: 'owner', avatar: 'SK', isActive: true
  });
  const student1 = await User.create({
    name: 'Arjun Sharma', email: 'arjun@college.edu',
    password: hashedPass, role: 'student',
    avatar: 'AS', college: 'VIT Pune', year: '1st Year', isActive: true
  });
  const student2 = await User.create({
    name: 'Sneha Iyer', email: 'sneha@college.edu',
    password: hashedPass, role: 'student',
    avatar: 'SI', college: 'VIT Pune', year: '3rd Year', isActive: true
  });
  const student3 = await User.create({
    name: 'Rohit Desai', email: 'rohit@college.edu',
    password: hashedPass, role: 'student',
    avatar: 'RD', college: 'VIIT Pune', year: '1st Year', isActive: true
  });
  const student4 = await User.create({
    name: 'Pooja Singh', email: 'pooja@college.edu',
    password: hashedPass, role: 'student',
    avatar: 'PS', college: 'COEP Pune', year: '4th Year', isActive: true
  });
  console.log(' Users created');
  // ─── MESSES ────────────────────────────────────────────────────────────────
  const mess1 = await Mess.create({
    name: 'Ruchira Mess',
    owner: owner1._id, ownerName: owner1.name,
    googleMaps: 'https://share.google/yG5PEAXrGUYaAR93d',
    category: 'veg',
    address: 'Near Bharti Vidyapeeth Back gate',
    city: 'Pune', pincode: '411046',
    price: 2800, priceUnit: '/month',
    capacity: 80, enrolled: 64,
    timing: '7AM–10AM · 12PM–3PM · 7PM–10PM',
    weeklySpecial: 'Sunday Special Thali',
    tags: ['Hygienic', 'Home Style', 'Trial Available'],
    amenities: ['AC Dining', 'Purified Water', 'WiFi', 'Laundry'],
    image: ' ',
    isOpen: true, isVerified: true,
    todayMenu: {
      breakfast: ['Poha', 'Chai', 'Bread Butter'],
      lunch:     ['Dal Makhani', 'Roti', 'Rice', 'Sabzi', 'Salad', 'Papad'],
      snacks:    ['Samosa', 'Tea'],
      dinner:    ['Paneer Butter Masala', 'Roti', 'Rice', 'Dal', 'Dessert'],
    }
  });
  const mess2 = await Mess.create({
    name: 'Mumbai Tiffin House',
    owner: owner2._id, ownerName: owner2.name,
    category: 'combo',
    address: 'Near Vit Bibwewadi',
    city: 'Pune', pincode: '411046',
    price: 3200, priceUnit: '/month',
    capacity: 60, enrolled: 48,
    timing: '6:30AM–9:30AM · 12PM–2:30PM · 7PM–9:30PM',
    weeklySpecial: 'Friday Biryani Special',
    tags: ['Delivery Available', 'South Indian', 'North Indian'],
    amenities: ['Home Delivery', 'Tiffin Service', 'Weekly Menu'],
    image: ' ',
    isOpen: true, isVerified: true,
    todayMenu: {
      breakfast: ['Idli', 'Sambar', 'Dosa', 'Chutney'],
      lunch:     ['Rajma', 'Jeera Rice', 'Roti', 'Curd', 'Pickle'],
      snacks:    ['Vada Pav', 'Coffee'],
      dinner:    ['Chicken Curry', 'Egg Bhurji', 'Roti', 'Rice'],
    }
  });
  const mess3 = await Mess.create({
    name: 'Green Bowl Vegan Mess',
    owner: owner3._id, ownerName: owner3.name,
    category: 'vegan',
    address: 'Khau Galli,Bibwewadi',
    city: 'Mumbai', pincode: '400050',
    price: 4500, priceUnit: '/month',
    capacity: 40, enrolled: 38,
    timing: '7AM–9AM · 12PM–2PM · 7PM–9PM',
    weeklySpecial: 'Sunday Detox Thali',
    tags: ['Organic', 'Cold-pressed Juices', 'No Onion Garlic'],
    amenities: ['Organic Produce', 'No Plastic', 'Composting'],
    image: ' ',
    isOpen: true, isVerified: false,
    todayMenu: {
      breakfast: ['Overnight Oats', 'Smoothie Bowl', 'Multigrain Toast'],
      lunch:     ['Chickpea Curry', 'Brown Rice', 'Quinoa Salad', 'Hummus'],
      snacks:    ['Fruit Bowl', 'Herbal Tea'],
      dinner:    ['Tofu Stir-fry', 'Millet Roti', 'Lentil Soup'],
    }
  });
  const mess4 = await Mess.create({
    name: 'Mughal Darbar Non-Veg Mess',
    owner: owner4._id, ownerName: owner4.name,
    category: 'nonveg',
    address: 'Sukhsagar Nagar,Katraj',
    city: 'Mumbai', pincode: '400070',
    price: 3500, priceUnit: '/month',
    capacity: 100, enrolled: 72,
    timing: '8AM–10AM · 1PM–3PM · 8PM–10PM',
    weeklySpecial: 'Friday Biryani + Seekh Kebab',
    tags: ['Halal', 'Mughlai', 'Biryani Daily'],
    amenities: ['Halal Certified', 'Party Orders', 'Catering'],
    image: ' ',
    isOpen: false, isVerified: true,
    todayMenu: {
      breakfast: ['Paya Soup', 'Roti', 'Anda Bhurji'],
      lunch:     ['Mutton Biryani', 'Chicken Curry', 'Raita', 'Salad'],
      snacks:    ['Kebab Roll', 'Lassi'],
      dinner:    ['Fish Fry', 'Dal', 'Rice', 'Roti'],
    }
  });
  const mess5 = await Mess.create({
    name: 'Sonals Jain kitchen',
    owner: owner1._id, ownerName: owner1.name,
    googleMaps: 'https://share.google/iBmsZ7CoRxDuXzHyX',
    category: 'jain',
    address: 'Tilekar nagar,Kondhwa',
    city: 'Mumbai', pincode: '400086',
    price: 3800, priceUnit: '/month',
    capacity: 50, enrolled: 30,
    timing: '7:30AM–9:30AM · 12PM–2:30PM · 7PM–9PM',
    weeklySpecial: 'Paryushan Special Thali',
    tags: ['No Root Vegetables', 'Satvik', 'Pure Jain'],
    amenities: ['Filtered Water', 'Hygienic Kitchen', 'Tiffin Available'],
    image: ' ',
    isOpen: true, isVerified: true,
    todayMenu: {
      breakfast: ['Daliya', 'Fruit', 'Milk'],
      lunch:     ['Jain Dal', 'Chapati', 'Steamed Rice', 'Sabzi', 'Salad'],
      snacks:    ['Dry Fruit Mix', 'Herbal Tea'],
      dinner:    ['Jain Pulao', 'Kadhi', 'Roti', 'Dessert'],
    }
  });
  const mess6 = await Mess.create({
    name: 'Ghar Ka Khana Tiffin',
    owner: owner2._id, ownerName: owner2.name,
    category: 'tiffin',
    address: 'Katraj-Kodhwa Road,Katraj',
    city: 'Mumbai', pincode: '400097',
    price: 1800, priceUnit: '/month',
    capacity: 120, enrolled: 90,
    timing: '7AM–9AM · 12PM–2PM · 7PM–9PM',
    weeklySpecial: 'Monthly Subscription with Free Trial',
    tags: ['Delivery Only', 'Home Style', 'Affordable'],
    amenities: ['2-Hour Delivery', 'Customizable Menu', 'Monthly Plans'],
    image: ' ',
    isOpen: true, isVerified: false,
    todayMenu: {
      breakfast: ['Paratha', 'Dahi', 'Pickle', 'Juice'],
      lunch:     ['Dal Tadka', 'Rice', 'Roti', 'Sabzi', 'Salad'],
      snacks:    ['Namkeen', 'Tea'],
      dinner:    ['Mix Veg', 'Roti', 'Rice', 'Dal', 'Kheer'],
    }
  });
  const mess7 = await Mess.create({
  name: 'Pune Tadka Mess',
  owner: owner1._id,
  ownerName: owner1.name,
  category: 'veg',
  address: 'FC Road, Shivajinagar, Pune',
  city: 'Pune',
  pincode: '411005',
  price: 2500,
  capacity: 60,
  enrolled: 40,
  timing: '7AM–10AM · 12PM–3PM · 7PM–10PM',
  weeklySpecial: 'Sunday Maharashtrian Thali',
  tags: ['Hygienic', 'Home Style', 'Maharashtrian'],
  amenities: ['Purified Water', 'WiFi', 'AC Dining'],
  image: '🍛',
  isOpen: true,
  isVerified: true,
  todayMenu: {
    breakfast: ['Poha', 'Chai', 'Upma', 'Sheera'],
    lunch: ['Varan Bhaat', 'Roti', 'Sabzi', 'Salad', 'Papad', 'Taak'],
    snacks: ['Misal Pav', 'Chai'],
    dinner: ['Pithla', 'Bhakri', 'Rice', 'Dal', 'Dessert'],
  }
});

const mess8 = await Mess.create({
  name: 'Deccan Khanawal',
  owner: owner4._id,
  ownerName: owner4.name,
  category: 'nonveg',
  address: 'Deccan Gymkhana, Pune',
  city: 'Pune',
  pincode: '411004',
  price: 3500,
  capacity: 80,
  enrolled: 55,
  timing: '8AM–11AM · 12PM–3PM · 7PM–11PM',
  weeklySpecial: 'Friday Mutton Biryani Special',
  tags: ['Halal', 'Spicy', 'Biryani Daily'],
  amenities: ['Halal Certified', 'Party Orders', 'Home Delivery'],
  image: '🍖',
  isOpen: true,
  isVerified: true,
  todayMenu: {
    breakfast: ['Anda Bhurji', 'Roti', 'Chai'],
    lunch: ['Chicken Curry', 'Mutton Rassa', 'Rice', 'Roti', 'Salad'],
    snacks: ['Chicken Roll', 'Lassi'],
    dinner: ['Fish Fry', 'Chicken Biryani', 'Dal', 'Rice', 'Roti'],
  }
});

const mess9 = await Mess.create({
  name: 'AAI Tiffin Service',
  owner: owner2._id,
  ownerName: owner2.name,
  category: 'tiffin',
  address: 'Khau Galli,Bibwewadi, Pune',
  city: 'Pune',
  pincode: '411046',
  price: 1800,
  capacity: 150,
  enrolled: 110,
  timing: '7AM–9AM · 12PM–2PM · 7PM–9PM',
  weeklySpecial: 'Monthly Plan with Free Sunday Breakfast',
  tags: ['Delivery Only', 'Affordable', 'Student Friendly'],
  amenities: ['2 Hour Delivery', 'Customizable Menu', 'Monthly Plans', 'No Minimum Order'],
  image: '🛵',
  isOpen: true,
  isVerified: false,
  todayMenu: {
    breakfast: ['Paratha', 'Dahi', 'Pickle', 'Juice'],
    lunch: ['Dal Tadka', 'Rice', 'Roti', 'Sabzi', 'Salad', 'Papad'],
    snacks: ['Biscuits', 'Tea'],
    dinner: ['Pav Bhaji', 'Roti', 'Rice', 'Dal', 'Kheer'],
  }
});
const mess10 = await Mess.create({
  name: 'Maheshwari Mess',
  owner: owner1._id,
  ownerName: owner1.name,
  googleMaps: 'https://share.google/k07aqGEACuSPpI1H4',
  category: 'veg',
  address: 'VIT Kondhwa Back Gate, Pune',
  city: 'Pune',
  pincode: '411046',
  price: 2200,
  capacity: 65,
  enrolled: 42,
  timing: '7AM–10AM · 12PM–3PM · 7PM–10PM',
  weeklySpecial: 'Sunday Special Puran Poli Thali',
  tags: ['Home Style', 'Maharashtrian', 'Hygienic'],
  amenities: ['Purified Water', 'WiFi', 'Tiffin Available'],
  image: '🏠',
  isOpen: true,
  isVerified: true,
  todayMenu: {
    breakfast: ['Poha', 'Chai', 'Upma', 'Banana'],
    lunch: ['Varan Bhaat', 'Roti', 'Sabzi', 'Salad', 'Papad', 'Taak'],
    snacks: ['Kande Pohe', 'Chai'],
    dinner: ['Pithla', 'Bhakri', 'Rice', 'Dal', 'Sheera'],
  }
});

const mess11 = await Mess.create({
  name: 'Sharada Veg NonVeg Mess',
  owner: owner4._id,
  ownerName: owner4.name,
  category: 'nonveg',
  address: 'VIT Kondhwa Back Gate, Pune',
  city: 'Pune',
  pincode: '411046',
  price: 3200,
  capacity: 80,
  enrolled: 60,
  timing: '8AM–10AM · 12PM–3PM · 7PM–10PM',
  weeklySpecial: 'Saturday Mutton Thali Special',
  tags: ['Halal', 'Spicy', 'Student Friendly'],
  amenities: ['Halal Certified', 'Home Delivery', 'Party Orders'],
  image: '🍖',
  isOpen: true,
  isVerified: true,
  todayMenu: {
    breakfast: ['Anda Bhurji', 'Roti', 'Chai', 'Juice'],
    lunch: ['Chicken Curry', 'Mutton Rassa', 'Rice', 'Roti', 'Salad'],
    snacks: ['Chicken Roll', 'Lassi'],
    dinner: ['Fish Fry', 'Chicken Biryani', 'Dal', 'Rice', 'Roti'],
  }
});

const mess12 = await Mess.create({
  name: 'Shreenath Poli Bhaji',
  owner: owner3._id,
  ownerName: owner3.name,
  googleMaps: 'https://share.google/wNgv92Iw8H28PNKqf',
  category: 'veg',
  address: 'Sukhsagar Nagar,Katraj, Pune',
  city: 'Pune',
  pincode: '411046',
  price: 4200,
  capacity: 35,
  enrolled: 28,
  timing: '7AM–9AM · 12PM–2PM · 7PM–9PM',
  weeklySpecial: 'Sunday Aamras Thali',
  tags: ['Organic', 'Healthy'],
  amenities: ['Organic Produce', 'No Plastic', 'Cold Pressed Juices'],
  image: '🥗',
  isOpen: true,
  isVerified: false,
  todayMenu: {
     breakfast: ['Paratha', 'Dahi', 'Pickle', 'Juice'],
    lunch: ['Dal Tadka', 'Rice', 'Roti', 'Sabzi', 'Salad', 'Papad'],
    snacks: ['Namkeen', 'Tea'],
    dinner: ['Pav Bhaji', 'Roti', 'Rice', 'Dal', 'Basundi'],
  }
});

const mess13 = await Mess.create({
  name: 'RadhaKrishna Pavbhaji',
  owner: owner2._id,
  ownerName: owner2.name,
  category: 'veg',
  address: 'Sukhsagar Nagar, Pune',
  city: 'Pune',
  pincode: '411045',
  price: 2000,
  capacity: 120,
  enrolled: 95,
  timing: '7AM–9AM · 12PM–2PM · 7PM–9PM',
  weeklySpecial: 'Amul Butter Pav Bhaji',
  tags: ['Delivery Only', 'Affordable', 'student'],
  amenities: ['2 Hour Delivery', 'App Ordering', 'Monthly Plans', 'Customizable Menu'],
  image: '🛵',
  isOpen: true,
  isVerified: true,
  todayMenu: {
    breakfast: ['Paratha', 'Dahi', 'Pickle', 'Juice'],
    lunch: ['Dal Tadka', 'Rice', 'Roti', 'Sabzi', 'Salad', 'Papad'],
    snacks: ['Namkeen', 'Tea'],
    dinner: ['Pav Bhaji', 'Roti', 'Rice', 'Dal', 'Gulab Jamun'],
  }
});
  // Link messes to owners
  await User.findByIdAndUpdate(owner1._id, { messId: mess1._id });
  await User.findByIdAndUpdate(owner2._id, { messId: mess2._id });
  await User.findByIdAndUpdate(owner3._id, { messId: mess3._id });
  await User.findByIdAndUpdate(owner4._id, { messId: mess4._id });
  console.log(' Messes created');
  // ─── REVIEWS ───────────────────────────────────────────────────────────────
  await Review.create([
    { mess: mess1._id, user: student1._id, rating: 5, text: 'Best mess I have ever had! The dal makhani is absolutely divine. Feels exactly like home cooking.', helpful: 12 },
    { mess: mess1._id, user: student2._id, rating: 4, text: 'Good food and hygienic kitchen. Wish they had more variety on weekdays but overall very satisfied.', helpful: 8 },
    { mess: mess1._id, user: student3._id, rating: 5, text: 'AC dining hall and purified water is a great bonus. Food quality is consistently good every day.', helpful: 6 },
    { mess: mess2._id, user: student1._id, rating: 4, text: 'The combo options are great and delivery is always on time. South Indian breakfast is superb!', helpful: 5 },
    { mess: mess2._id, user: student4._id, rating: 3, text: 'Decent food but the portion sizes could be larger. Delivery is reliable though.', helpful: 3 },
    { mess: mess3._id, user: student2._id, rating: 5, text: 'Finally a vegan mess that does not compromise on taste! The smoothie bowls are absolutely amazing.', helpful: 15 },
    { mess: mess3._id, user: student4._id, rating: 4, text: 'Healthy and fresh food. Slightly expensive but worth every rupee for the quality.', helpful: 9 },
    { mess: mess4._id, user: student3._id, rating: 4, text: 'Biryani is outstanding! Halal certified which is important for me. Highly recommended for non-veg lovers.', helpful: 18 },
    { mess: mess4._id, user: student1._id, rating: 4, text: 'Great variety of non-veg dishes. Fish fry on Fridays is a must-try!', helpful: 11 },
    { mess: mess5._id, user: student2._id, rating: 5, text: 'Authentic Jain food with no compromise on taste. Very clean and hygienic kitchen.', helpful: 7 },
    { mess: mess6._id, user: student3._id, rating: 4, text: 'Very affordable and delivery is always hot and fresh. Perfect for hostel students on a budget.', helpful: 10 },
    { mess: mess6._id, user: student4._id, rating: 3, text: 'Food is home-style and decent. Sometimes delivery gets delayed but overall value for money.', helpful: 4 },
 { mess: mess7._id, user: student1._id, rating: 5, text: 'Amazing Maharashtrian food! The varan bhaat and pithla bhakri is exactly like home. Best mess in Pune!', helpful: 14 },
{ mess: mess7._id, user: student2._id, rating: 4, text: 'Very hygienic and tasty food. Misal pav in snacks is outstanding. Highly recommended for Pune students!', helpful: 9 },
{ mess: mess7._id, user: student3._id, rating: 5, text: 'Sunday Maharashtrian Thali is absolutely worth it. Food is fresh and very affordable. Love this place!', helpful: 7 },
{ mess: mess8._id, user: student3._id, rating: 5, text: 'Best non veg mess in Pune! Mutton rassa is finger licking good. Friday biryani is a must try!', helpful: 18 },
{ mess: mess8._id, user: student4._id, rating: 4, text: 'Halal certified and very tasty. Chicken curry is excellent and portions are very generous!', helpful: 11 },
{ mess: mess8._id, user: student1._id, rating: 4, text: 'Fish fry on weekends is amazing. Great variety of non veg dishes at very reasonable price.', helpful: 8 },
{ mess: mess9._id, user: student2._id, rating: 4, text: 'Very affordable and always on time delivery. Perfect for college students in Viman Nagar area!', helpful: 10 },
{ mess: mess9._id, user: student3._id, rating: 3, text: 'Good food and value for money. Delivery can sometimes be late but overall decent service.', helpful: 5 },
{ mess: mess9._id, user: student4._id, rating: 4, text: 'Best tiffin service near Symbiosis college. Monthly plan is very affordable and food is tasty!', helpful: 7 },
{ mess: mess10._id, user: student1._id, rating: 5, text: 'Best Maharashtrian home food in Kothrud! Puran Poli on Sunday is absolutely divine. Feels like mothers cooking!', helpful: 15 },
{ mess: mess10._id, user: student2._id, rating: 4, text: 'Very affordable and hygienic. Pithla bhakri in dinner is outstanding. Perfect for Pune students!', helpful: 9 },
{ mess: mess10._id, user: student3._id, rating: 4, text: 'Great home style food at very reasonable price. Tiffin service is also available which is very convenient!', helpful: 7 },
{ mess: mess11._id, user: student3._id, rating: 5, text: 'Best non veg mess near Hadapsar IT park! Mutton rassa is finger licking good. Saturday thali is a must try!', helpful: 18 },
{ mess: mess11._id, user: student4._id, rating: 4, text: 'Halal certified and very tasty food. Chicken biryani in dinner is outstanding. Highly recommended!', helpful: 12 },
{ mess: mess11._id, user: student1._id, rating: 4, text: 'Amazing non veg food at affordable price. Home delivery is always on time. Great for working professionals!', helpful: 10 },
{ mess: mess12._id, user: student2._id, rating: 5, text: 'Finally healthy vegan food in Wakad! Smoothie bowls are amazing and quinoa salad is very fresh daily!', helpful: 16 },
{ mess: mess12._id, user: student4._id, rating: 4, text: 'Organic and healthy food. Slightly expensive but totally worth it for the quality. Love the detox thali!', helpful: 11 },
{ mess: mess13._id, user: student1._id, rating: 4, text: 'Best tiffin service in area! Always on time delivery and food is fresh and tasty. Great value!', helpful: 13 },
{ mess: mess13._id, user: student3._id, rating: 5, text: 'Perfect for IT professionals in pune! Affordable monthly plan and customizable menu is a huge plus!', helpful: 17 },
{ mess: mess13._id, user: student2._id, rating: 4, text: 'Very convenient and affordable. Gulab Jamun in dinner is a nice touch. Recommended for working people!', helpful: 8 },
  ]);
  // Recalculate all ratings
  for (const m of [mess1,mess2,mess3,mess4,mess5,mess6,mess7,mess8,mess9,mess10,mess11,mess12,mess13])
  await Review.calcAverageRating(m._id);
  console.log(' Reviews created & ratings calculated');
  console.log('\n─────────────────────────────────────────');
  console.log(' DATABASE SEEDED SUCCESSFULLY!\n');
  console.log('LOGIN CREDENTIALS:');
  console.log('─────────────────────────────────────────');
  console.log('ADMIN    → admin@smartmess.com  / admin@2024');
  console.log('OWNER 1 → rajesh@mess.com      / password123');
  console.log('OWNER 2 → meena@mess.com       / password123');
  console.log('STUDENT → arjun@college.edu    / password123');
  console.log('STUDENT → sneha@college.edu    / password123');
  console.log('─────────────────────────────────────────\n');
  await mongoose.disconnect();
};
run().catch(err => { console.error(err); process.exit(1); });