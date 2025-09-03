if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user');

// Utility function
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

// Your 15 Cloudinary images
const seedImages = [
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835579/felix-TLfeHP2SYdo-unsplash_juognm.jpg',
    filename: 'felix-TLfeHP2SYdo-unsplash_juognm'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835578/will-smith-TVAMfpAzeqM-unsplash_ucgyhq.jpg',
    filename: 'will-smith-TVAMfpAzeqM-unsplash_ucgyhq'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835577/angelik-ifurung-__rKfrSZmlQ-unsplash_q1nsgn.jpg',
    filename: 'angelik-ifurung-__rKfrSZmlQ-unsplash_q1nsgn'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835575/christopher-politano-tQxbJ_hW-9Y-unsplash_bqnvso.jpg',
    filename: 'christopher-politano-tQxbJ_hW-9Y-unsplash_bqnvso'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835504/laszlo-kiss-nPwAfkIFxqk-unsplash_b0nlvb.jpg',
    filename: 'laszlo-kiss-nPwAfkIFxqk-unsplash_b0nlvb'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835503/shaq-hossain-ZTx6zug8XJ4-unsplash_j14yfd.jpg',
    filename: 'shaq-hossain-ZTx6zug8XJ4-unsplash_j14yfd'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835503/laszlo-kiss-eCDo25iq4z4-unsplash_eclnzq.jpg',
    filename: 'laszlo-kiss-eCDo25iq4z4-unsplash_eclnzq'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835503/julian-zwengel-SzT2Ho6rDx4-unsplash_vllkbr.jpg',
    filename: 'julian-zwengel-SzT2Ho6rDx4-unsplash_vllkbr'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835500/gustavo-cordeiro-5ejARtUUXpY-unsplash_jxwz4v.jpg',
    filename: 'gustavo-cordeiro-5ejARtUUXpY-unsplash_jxwz4v'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835500/alina-kotenko--N2qgZPW9jg-unsplash_v5viah.jpg',
    filename: 'alina-kotenko--N2qgZPW9jg-unsplash_v5viah'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835500/felix-TLfeHP2SYdo-unsplash_ou2c9d.jpg',
    filename: 'felix-TLfeHP2SYdo-unsplash_ou2c9d'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835499/alex-moliski-zdazxYA6qTE-unsplash_zrspvp.jpg',
    filename: 'alex-moliski-zdazxYA6qTE-unsplash_zrspvp'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835494/alex-moliski-X2f7yGsnIEI-unsplash_lg7tug.jpg',
    filename: 'alex-moliski-X2f7yGsnIEI-unsplash_lg7tug'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835491/irish83-R1B3C08aVn8-unsplash_fn48y0.jpg',
    filename: 'irish83-R1B3C08aVn8-unsplash_fn48y0'
  },
  {
    url: 'https://res.cloudinary.com/dkeqqaoly/image/upload/v1756835485/akhil-dev-0WC3j39nXfs-unsplash_von1zj.jpg',
    filename: 'akhil-dev-0WC3j39nXfs-unsplash_von1zj'
  }
];

// ✅ connect to Atlas DB from .env
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpcamp';

(async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Mongo Connection Open!!");

    // Clean old campgrounds
    await Campground.deleteMany({});

    // Find or create a user
    let user = await User.findOne();
    if (!user) {
      user = new User({
        email: "seed@example.com",
        username: "seedUser"
      });
      await User.register(user, "password123");
      console.log("✅ Created seed user:", user.username);
    } else {
      console.log("✅ Using existing user:", user.username);
    }

    // Insert 50 campgrounds
    for (let i = 0; i < 50; i++) {
      const r = Math.floor(Math.random() * cities.length);

      const camp = new Campground({
        author: user._id,
        location: `${cities[r].city}, ${cities[r].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description: 'This is a seeded description. Great place to visit!',
        price: Math.floor(Math.random() * 30) + 10,
        geometry: {
          type: "Point",
          coordinates: [cities[r].longitude, cities[r].latitude]
        },
        images: [
          seedImages[Math.floor(Math.random() * seedImages.length)]
        ]
      });

      await camp.save();
    }

    console.log("✅ Seeded 50 campgrounds with Cloudinary images!");
    mongoose.connection.close();
    console.log("🔌 DB closed");
  } catch (err) {
    console.error("❌ Seed error:", err);
    mongoose.connection.close();
    console.log("🔌 DB closed");
  }
})();
