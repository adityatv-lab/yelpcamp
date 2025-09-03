require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

(async () => {
  try {
    const res = await cloudinary.search
      .expression('folder:YelpCampSeed')   // 👈 search inside this folder only
      .max_results(50)
      .execute();

    console.log("✅ Found resources:", res.resources.length);

    const images = res.resources.map(img => ({
      url: img.secure_url,
      filename: img.public_id
    }));

    console.log(images);
  } catch (err) {
    console.error("❌ Error fetching images:", err);
  }
})();
