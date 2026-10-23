const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email address is too long."],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["founder", "admin", "editor"],
        message: "Invalid administrative role.",
      },
      default: "editor",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash passwords before saving a user document.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  if (typeof this.password !== "string" || this.password.length < 12) {
    throw new Error("Password must contain at least 12 characters.");
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare a plaintext password against the stored hash.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password || typeof enteredPassword !== "string") {
    return false;
  }

  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * Exclude password hashes from JSON responses.
 */
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
}); 

module.exports = mongoose.model("User", userSchema);