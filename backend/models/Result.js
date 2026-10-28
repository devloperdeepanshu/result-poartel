import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
      index: true,
    },

    // Required for published/expired results; not required while waiting.
    number: {
      type: String,
      trim: true,
      required: function () {
        return this.status !== "waiting";
      },
      validate: {
        validator: function (value) {
          if (this.status === "waiting" && !value) {
            return true;
          }

          return /^\d{1,2}$/.test(String(value ?? "").trim());
        },
        message: "Result number must be between 0 and 99.",
      },
    },

    status: {
      type: String,
      enum: ["waiting", "published", "expired"],
      required: true,
      index: true,
    },

    publishAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index({ location: 1, status: 1, publishAt: 1 });
resultSchema.index({ location: 1, status: 1, publishedAt: -1 });

const Result = mongoose.model("Result", resultSchema);

export default Result;