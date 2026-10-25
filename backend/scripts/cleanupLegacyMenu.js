require("dotenv").config();

const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

const LEGACY_ID = "6ace696f56e5adfcbdc92f5d";

async function cleanupLegacyMenu() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    // Confirm the exact legacy record still exists.
    const legacyItem = await MenuItem.findById(LEGACY_ID);

    if (!legacyItem) {
      console.log("Legacy record not found. Nothing to clean.");
      return;
    }

    // Refuse deletion if the record has acquired valid menu data.
    if (legacyItem.name || legacyItem.path) {
      console.log(
        "Cleanup cancelled: legacy record now contains a name or path."
      );
      return;
    }

    // Delete only the confirmed incomplete record.
    const result = await MenuItem.deleteOne({
      _id: LEGACY_ID,
      name: { $exists: false },
      path: { $exists: false },
    });

    if (result.deletedCount !== 1) {
      throw new Error(
        "Cleanup did not delete exactly one record. Check the database."
      );
    }

    console.log("Incomplete legacy menu record deleted.");

    const remaining = await MenuItem.find().sort({ orderIndex: 1 });

    console.table(
      remaining.map((item) => ({
        name: item.name,
        path: item.path,
        visible: item.isVisible,
      }))
    );

    console.log(`Remaining menu records: ${remaining.length}`);
  } catch (error) {
    console.error("Cleanup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

cleanupLegacyMenu();