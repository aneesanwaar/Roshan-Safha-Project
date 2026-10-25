require("dotenv").config();

const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

const DEFAULT_MENU_ITEMS = [
  { name: "Home", path: "/", orderIndex: 0 },
  { name: "About Us", path: "/about", orderIndex: 1 },
  { name: "Programs", path: "/programs", orderIndex: 2 },
  { name: "Gallery", path: "/gallery", orderIndex: 3 },
  { name: "Announcements", path: "/announcements", orderIndex: 4 },
  { name: "Get Involved", path: "/get-involved", orderIndex: 5 },
  { name: "Contact Us", path: "/contact", orderIndex: 6 },
];

const initializeMenu = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    let created = 0;
    let existing = 0;

    for (const item of DEFAULT_MENU_ITEMS) {
      const result = await MenuItem.updateOne(
        { path: item.path },
        {
          $setOnInsert: {
            ...item,
            isNavHeader: true,
            isVisible: true,
          },
        },
        {
          upsert: true,
          runValidators: true,
        }
      );

      if (result.upsertedCount > 0) {
        created++;
        console.log(`Created: ${item.name}`);
      } else {
        existing++;
        console.log(`Already exists: ${item.name}`);
      }
    }

    console.log(
      `Menu initialization completed. Created: ${created}, Existing: ${existing}`
    );

    const menuItems = await MenuItem.find().sort({ orderIndex: 1 });

    console.table(
      menuItems.map((item) => ({
        name: item.name || "(missing)",
        path: item.path || "(missing)",
        visible: item.isVisible,
      }))
    );
  } catch (error) {
    console.error("Menu initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

initializeMenu();