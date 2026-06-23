import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Structure from './models/Structure.js';
import Application from './models/Application.js';

dotenv.config();

const defaultStructures = [
  {
    name: 'Home',
    description: 'Residential home construction, including individual villas, duplexes, and bungalows.',
    basePricePerSqFt: 1600,
    packages: [
      {
        name: 'Standard',
        priceMultiplier: 1.0,
        materials: [
          { category: 'Foundation & RCC', details: 'OPC 43 Grade Cement (Ultratech/ACC), Fe 500 TMT Steel (Local/Vizag Steel)' },
          { category: 'Walls & Bricks', details: 'High-quality local red clay bricks with 1:6 cement sand mortar' },
          { category: 'Flooring', details: 'Ceramic tiles (2x2 ft) in living/bedroom, anti-skid tiles in bathrooms' },
          { category: 'Woodwork & Doors', details: 'Main door: solid flush door with veneer. Internal doors: painted flush doors' },
          { category: 'Plumbing & Bath Fittings', details: 'PVC pipeline (Supreme/Ashirvad), basic CP fittings (Parryware/Cera)' },
          { category: 'Electricals', details: 'Concealed wiring (Finolex/Poly Cab), basic switches (Anchor/GM)' },
          { category: 'Paint & Finishes', details: 'Interior: 2 coats OBD over putty. Exterior: 1 coat primer & weather-proof paint' }
        ]
      },
      {
        name: 'Premium',
        priceMultiplier: 1.3,
        materials: [
          { category: 'Foundation & RCC', details: 'PPC/OPC 53 Grade Cement (Ultratech/Ambuja), Fe 550 TMT Steel (Tata Tiscon/JSW)' },
          { category: 'Walls & Bricks', details: '8-inch solid concrete blocks or premium wirecut red bricks' },
          { category: 'Flooring', details: 'Double charged vitrified tiles (Kajaria/Somany), granite staircases' },
          { category: 'Woodwork & Doors', details: 'Main door: Teakwood frame and shutter. Internal doors: flush doors with laminate' },
          { category: 'Plumbing & Bath Fittings', details: 'CPVC & UPVC piping (Astral/Supreme), Jaguar CP & sanitary fittings' },
          { category: 'Electricals', details: 'FR concealed wiring (Havells/Finolex), Modular switches (Legrand/Havells)' },
          { category: 'Paint & Finishes', details: 'Interior: premium acrylic emulsion paint (Asian Paints). Exterior: Apex weather-proof paint' }
        ]
      },
      {
        name: 'Luxury',
        priceMultiplier: 1.7,
        materials: [
          { category: 'Foundation & RCC', details: 'Corrosion resistant premium cement, Fe 550D Super Premium Steel (Tata Tiscon)' },
          { category: 'Walls & Bricks', details: 'Fly-ash lightweight blocks / premium AAC blocks for superior thermal insulation' },
          { category: 'Flooring', details: 'Italian marble in living area, engineered wooden flooring in master bedroom' },
          { category: 'Woodwork & Doors', details: 'Full Teakwood frame & shutters for all doors, premium UPVC sound-proof windows' },
          { category: 'Plumbing & Bath Fittings', details: 'Noise-less piping (Astral Silencio), premium Jaguar/Kohler wall-hung sanitary ware' },
          { category: 'Electricals', details: 'FRLS Copper wiring (Finolex), touch/smart modular switches (Legrand/Schneider)' },
          { category: 'Paint & Finishes', details: 'Interior: Royal shine/velvet touch paint. Exterior: Apex Ultima protection paint' }
        ]
      }
    ]
  },
  {
    name: 'Shop',
    description: 'Commercial retail shops, grocery stores, showrooms, and open-front commercial outlets.',
    basePricePerSqFt: 1300,
    packages: [
      {
        name: 'Standard',
        priceMultiplier: 1.0,
        materials: [
          { category: 'Foundation & RCC', details: 'Standard concrete mixes, local structural steel' },
          { category: 'Frontage', details: 'Manual rolling shutter (galvanized iron)' },
          { category: 'Flooring', details: 'Polished Kota stone or basic ceramic tiles' },
          { category: 'Electricals', details: 'Basic commercial wiring, non-modular boards for high-load appliances' },
          { category: 'Ceiling & Paint', details: 'Exposed roof with whitewash or basic paint' }
        ]
      },
      {
        name: 'Premium',
        priceMultiplier: 1.3,
        materials: [
          { category: 'Foundation & RCC', details: 'Ultratech/Ambuja cement, JSW steel' },
          { category: 'Frontage', details: 'Motorized rolling shutter & clear glass storefront window' },
          { category: 'Flooring', details: 'Premium vitrified tiles or polished concrete floors' },
          { category: 'Electricals', details: 'Modular switchboards, separate circuit breakers, LED track light preparation' },
          { category: 'Ceiling & Paint', details: 'Grid false ceiling with LED panel layout, premium emulsion paint' }
        ]
      },
      {
        name: 'Luxury',
        priceMultiplier: 1.7,
        materials: [
          { category: 'Foundation & RCC', details: 'Tata Tiscon steel, premium grade RCC' },
          { category: 'Frontage', details: 'Automatic sliding glass doors, double-glazed toughened glass facade' },
          { category: 'Flooring', details: 'Polished granite slabs or epoxy floor finish' },
          { category: 'Electricals', details: 'Fully integrated smart lighting prep, architectural lighting, fire alarm wiring' },
          { category: 'Ceiling & Paint', details: 'Designer gypsum false ceiling, texture paint finishes' }
        ]
      }
    ]
  },
  {
    name: 'Commercial Building',
    description: 'Multi-story office spaces, commercial complex, shopping centers, or co-working buildings.',
    basePricePerSqFt: 1900,
    packages: [
      {
        name: 'Standard',
        priceMultiplier: 1.0,
        materials: [
          { category: 'Structure & Facade', details: 'Standard RCC frame structure, brick masonry outer walls, basic aluminum windows' },
          { category: 'Flooring & Lobby', details: 'Ceramic tiles in common corridors, IPS concrete flooring inside office spaces' },
          { category: 'Utilities & Lift', details: 'Standard 6-passenger gear lift, basic overhead water tanks' },
          { category: 'Safety & Electrical', details: 'Standard conduit wiring, manual fire extinguishers on each floor' }
        ]
      },
      {
        name: 'Premium',
        priceMultiplier: 1.3,
        materials: [
          { category: 'Structure & Facade', details: 'Strong RCC structure, structural glass glazing facade, UPVC windows' },
          { category: 'Flooring & Lobby', details: 'Polished granite in main lobby and stairs, vitrified tiles in office areas' },
          { category: 'Utilities & Lift', details: '10-passenger automatic lift (OTIS/Kone), continuous backup generator wiring' },
          { category: 'Safety & Electrical', details: 'Modular switchgear, automatic fire hydrant pipes, sprinkler system prep' }
        ]
      },
      {
        name: 'Luxury',
        priceMultiplier: 1.7,
        materials: [
          { category: 'Structure & Facade', details: 'Premium RCC structure, Double Glazed Unit (DGU) glass curtain wall facade' },
          { category: 'Flooring & Lobby', details: 'Imported marble in lobby, premium tile/carpet tiles, designer corridors' },
          { category: 'Utilities & Lift', details: 'High-speed smart lifts, fully integrated central HVAC system ducting, 100% generator backup' },
          { category: 'Safety & Electrical', details: 'Fully automated fire detection and suppression, building management system (BMS) wiring' }
        ]
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    
    // Connect to database
    await mongoose.connect(connStr || 'mongodb://localhost:27017/building_constructor');
    console.log('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Structure.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing collections.');

    // Create Admin User
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user seeded: admin / admin123');

    // Create Structure Types
    await Structure.insertMany(defaultStructures);
    console.log('Structure types and materials seeded successfully!');

    // Close Connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
