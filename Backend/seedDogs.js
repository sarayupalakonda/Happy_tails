const mongoose = require('mongoose');
require('dotenv').config();
const Dog = require('./models/Dog');

const dogs = [
  // ── BREED DOGS (PETS) ──────────────────────────────────────
  { 
    name: 'Buddy', breed: 'Golden Retriever', age: 2, gender: 'Male', size: 'Large', 
    location: 'Hyderabad, Telangana', adoptionFee: 250, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Friendly', 'Playful'],
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&h=625&q=80',
    imagePosition: 'center 30%',
    description: 'Buddy is a golden bundle of joy who loves playing fetch and is incredibly gentle with children.'
  },
  { 
    name: 'Luna', breed: 'Labrador', age: 1, gender: 'Female', size: 'Large', 
    location: 'Madhapur, Hyderabad', adoptionFee: 300, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Energetic', 'Loyal'],
    image: 'https://images.pexels.com/photos/998251/pexels-photo-998251.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    description: 'Luna is a young, energetic Labrador who loves water and is very quick to learn.'
  },
  { 
    name: 'Mochi', breed: 'Pomeranian', age: 3, gender: 'Female', size: 'Small', 
    location: 'Bengaluru, Karnataka', adoptionFee: 400, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Cuddly', 'Fluffy'],
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&h=625&q=80',
    imagePosition: 'center 30%',
    description: 'Mochi might be small, but she has a big personality. She loves cuddles and attention.'
  },
  { 
    name: 'Storm', breed: 'Husky', age: 4, gender: 'Male', size: 'Large', 
    location: 'Chennai, Tamil Nadu', adoptionFee: 350, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Smart', 'Active'],
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1000&h=625&q=80',
    imagePosition: 'center top',
    description: 'Storm is a beautiful Husky with striking eyes. He needs plenty of exercise and mental stimulation.'
  },
  { 
    name: 'Coco', breed: 'Beagle', age: 2, gender: 'Female', size: 'Medium', 
    location: 'Mumbai, Maharashtra', adoptionFee: 200, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Curious', 'Friendly'],
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=1000&h=625&q=80',
    imagePosition: 'center 30%',
    description: 'Coco is a curious Beagle who loves to follow her nose. She is loyal and great with other dogs.'
  },
  { 
    name: 'Charlie', breed: 'Poodle', age: 5, gender: 'Male', size: 'Medium', 
    location: 'Pune, Maharashtra', adoptionFee: 450, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Intelligent', 'Gentle'],
    image: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=1000&h=625&q=80',
    imagePosition: 'center 30%',
    description: 'Charlie is a highly intelligent Poodle who is always eager to please and has a gentle nature.'
  },
  { 
    name: 'Daisy', breed: 'Bulldog', age: 3, gender: 'Female', size: 'Medium', 
    location: 'Delhi, India', adoptionFee: 300, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Calm', 'Affectionate'],
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1000&h=625&q=80',
    imagePosition: 'center 30%',
    description: 'Daisy is a sweet Bulldog who loves her naps. She is very affectionate and perfect for a low-energy home.'
  },
  { 
    name: 'Rex', breed: 'German Shepherd', age: 2, gender: 'Male', size: 'Large', 
    location: 'Jaipur, Rajasthan', adoptionFee: 350, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'pet', personalityTags: ['Brave', 'Alert'],
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1000&h=625&q=80',
    imagePosition: 'center 30%',
    description: 'Rex is a brave German Shepherd with a strong protective instinct and great training.'
  },

  // ── STREET & RESCUE HEROES (REALISTIC INDIAN INDIE DOGS) ───────
  { 
    name: 'Brownie', breed: 'Indian Pariah Dog', age: 3, gender: 'Male', size: 'Medium', 
    location: 'Hyderabad, Telangana', adoptionFee: 0, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'street', urgencyLabel: 'Hero',
    rescueLocation: 'Near Charminar, Hyderabad', healthStatus: 'Healthy & Strong',
    personalityTags: ['Resilient', 'Intelligent', 'Protective'],
    image: 'https://images.pexels.com/photos/12631184/pexels-photo-12631184.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Brownie survived the busy streets of Charminar. He was known for guarding local shops before being rescued.',
    description: 'Brownie is an incredibly intelligent survivor who is now looking for a permanent pack to protect.'
  },
  { 
    name: 'Lucky', breed: 'Indian Street Puppy', age: 0.5, gender: 'Female', size: 'Small', 
    location: 'Madhapur, Hyderabad', adoptionFee: 0, vaccinationStatus: 'Partially Vaccinated', 
    availabilityStatus: 'Available', type: 'street', urgencyLabel: 'Urgent',
    rescueLocation: 'Madhapur Metro Station', healthStatus: 'Recovering & Playful',
    personalityTags: ['Sweet', 'Energetic', 'Tiny'],
    image: 'https://images.pexels.com/photos/6447058/pexels-photo-6447058.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Found shivering near the metro tracks, Lucky is a miracle puppy who survived against all odds.',
    description: 'Lucky is a small bundle of joy full of energy. She needs a patient home to help her grow.'
  },
  { 
    name: 'Shadow', breed: 'Black Indie Dog', age: 4, gender: 'Male', size: 'Large', 
    location: 'Bengaluru, Karnataka', adoptionFee: 0, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'street', urgencyLabel: 'Special Need',
    rescueLocation: 'Indiranagar Park Side', healthStatus: 'Excellent',
    personalityTags: ['Majestic', 'Calm', 'Loyal'],
    image: 'https://images.pexels.com/photos/10936554/pexels-photo-10936554.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Shadow spent years as a neighborhood guardian in Bangalore until his territory was demolished.',
    description: 'Shadow is a majestic, calm black indie dog who makes the perfect companion for quiet evenings.'
  },
  { 
    name: 'Chinni', breed: 'Rescued Indie Dog', age: 2, gender: 'Female', size: 'Medium', 
    location: 'Chennai, Tamil Nadu', adoptionFee: 0, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'rescue', urgencyLabel: 'Miracle',
    rescueLocation: 'OMR Road, Chennai', healthStatus: 'Fully Recovered',
    personalityTags: ['Affectionate', 'Gentle', 'Survivor'],
    image: 'https://images.pexels.com/photos/20665053/pexels-photo-20665053.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Rescued from a major road accident on OMR, Chinni underwent multiple surgeries to walk again.',
    description: 'Chinni is a true miracle. Despite her past, she has zero fear and only love to give.'
  },
  { 
    name: 'Raju', breed: 'Brown Indian Street Dog', age: 3, gender: 'Male', size: 'Medium', 
    location: 'Delhi, India', adoptionFee: 0, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'street', urgencyLabel: 'Friendly',
    rescueLocation: 'Connaught Place', healthStatus: 'Healthy',
    personalityTags: ['Friendly', 'Loyal'],
    image: 'https://images.pexels.com/photos/12630134/pexels-photo-12630134.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Raju was a local favorite at Connaught Place before being brought to the shelter for a permanent home.',
    description: 'Raju is a classic brown indie dog with a heart of gold.'
  },
  { 
    name: 'Kalu', breed: 'Black Street Dog', age: 5, gender: 'Male', size: 'Large', 
    location: 'Mumbai, Maharashtra', adoptionFee: 0, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'street', urgencyLabel: 'Senior Hero',
    rescueLocation: 'Dharavi Slums', healthStatus: 'Healthy',
    personalityTags: ['Calm', 'Wise'],
    image: 'https://images.pexels.com/photos/20407231/pexels-photo-20407231.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Kalu spent 5 years on the streets of Mumbai. He is now enjoying the comfort of a soft bed.',
    description: 'Kalu is a wise senior dog who just wants a quiet corner to sleep in.'
  },
  { 
    name: 'Moti', breed: 'White Indie Dog', age: 2, gender: 'Female', size: 'Medium', 
    location: 'Pune, Maharashtra', adoptionFee: 0, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'street', urgencyLabel: 'Playful',
    rescueLocation: 'Pune University Campus', healthStatus: 'Healthy',
    personalityTags: ['Playful', 'Active'],
    image: 'https://images.pexels.com/photos/13922902/pexels-photo-13922902.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Moti was found playing with students at the university campus. She is very social and loves people.',
    description: 'Moti is a beautiful white indie dog with high energy.'
  },
  { 
    name: 'Simba', breed: 'Indian Local Dog', age: 4, gender: 'Male', size: 'Large', 
    location: 'Kolkata, West Bengal', adoptionFee: 0, vaccinationStatus: 'Vaccinated', 
    availabilityStatus: 'Available', type: 'rescue', urgencyLabel: 'Majestic',
    rescueLocation: 'Howrah Bridge Area', healthStatus: 'Healthy',
    personalityTags: ['Brave', 'Loyal'],
    image: 'https://images.pexels.com/photos/10727547/pexels-photo-10727547.jpeg?auto=compress&cs=tinysrgb&w=1000&h=625&fit=crop',
    imagePosition: 'center 30%',
    rescueStory: 'Simba was rescued from the busy Howrah Bridge area. He is a majestic dog with a protective nature.',
    description: 'Simba is a large, brave local dog looking for his forever family.'
  }
];

const locationCleanupMap = {
  'New York, NY': 'Hyderabad, Telangana',
  'Chicago, IL': 'Madhapur, Hyderabad',
  'Austin, TX': 'Bengaluru, Karnataka',
  'Denver, CO': 'Chennai, Tamil Nadu',
  'Miami, FL': 'Mumbai, Maharashtra',
  'Seattle, WA': 'Pune, Maharashtra',
  'Boston, MA': 'Delhi, India',
  'Phoenix, AZ': 'Jaipur, Rajasthan',
  'Los Angeles, CA': 'Kochi, Kerala',
  'Bangalore, IN': 'Bengaluru, Karnataka',
  'Hyderabad, IN': 'Hyderabad, Telangana',
  'Chennai, IN': 'Chennai, Tamil Nadu',
  'Delhi, IN': 'Delhi, India',
  'Mumbai, IN': 'Mumbai, Maharashtra',
  'Pune, IN': 'Pune, Maharashtra',
  'Kolkata, IN': 'Kolkata, West Bengal'
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 CONNECTED TO MONGODB FOR SEEDING...');

    for (const [from, to] of Object.entries(locationCleanupMap)) {
      const result = await Dog.updateMany({ location: from }, { $set: { location: to } });
      if (result.modifiedCount) {
        console.log(`Updated ${result.modifiedCount} dog location(s): ${from} -> ${to}`);
      }
    }

    const existingCount = await Dog.countDocuments();
    if (existingCount > 0 && process.env.RESET_DOGS !== 'true') {
      console.log(`Dogs collection already has ${existingCount} records. Skipping seed.`);
      console.log('Set RESET_DOGS=true only when you intentionally want to replace dog data.');
      process.exit();
    }

    if (process.env.RESET_DOGS === 'true') {
      await Dog.deleteMany({});
      console.log('🧹 CLEARED EXISTING DOG DATA.');
    }
    
    const inserted = await Dog.insertMany(dogs);
    console.log(`✅ SUCCESSFULLY SEEDED ${inserted.length} UNIQUE DOGS! 🐾`);
    console.log("Dogs loaded:", inserted.map(d => d.name).join(', '));
    
    process.exit();
  } catch (err) {
    console.error('❌ SEEDING ERROR:', err);
    process.exit(1);
  }
};

seedDB();
