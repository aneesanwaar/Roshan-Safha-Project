const mongoose = require("mongoose");

// ==========================================
// SUPPORTED CMS PAGES
// ==========================================

const ALLOWED_PAGES = [
  "home",
  "about",
  "programs",
  "getInvolved",
  "contact",
  "contest",
];

// ==========================================
// CONTENT VALIDATION
// ==========================================

const isPlainObject = (value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

const validateContent = (value) => {
  if (!isPlainObject(value)) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);

    if (!serialized) {
      return false;
    }

    // Maximum serialized CMS content size: 200 KB.
    return Buffer.byteLength(serialized, "utf8") <= 200 * 1024;
  } catch {
    return false;
  }
};

// ==========================================
// SITE CONTENT SCHEMA
// ==========================================

const siteContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: [true, "CMS page is required."],
      unique: true,
      enum: {
        values: ALLOWED_PAGES,
        message: "Invalid CMS page.",
      },
      immutable: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "CMS content is required."],
      validate: {
        validator: validateContent,
        message:
          "CMS content must be a valid object not exceeding 200 KB.",
      },
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// ==========================================
// EXPORT
// ==========================================

module.exports = mongoose.model("SiteContent", siteContentSchema);