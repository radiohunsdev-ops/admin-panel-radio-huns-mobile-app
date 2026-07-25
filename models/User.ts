import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  profileImage?: string;
  phone?: string;
  password: string;
  role: "admin" | "manager" | "user";
  preferredLanguage?: "Hindi" | "Punjabi" | "Urdu" | "English";
  city?: string;
  region?: string;
  provider?: "email" | "google" | "apple" | "phone";
  emailVerified: boolean;
  subscribedShows: mongoose.Types.ObjectId[];
  listeningHistory: {
    show: mongoose.Types.ObjectId;
    startedAt: Date;
    endedAt: Date;
  }[];
  notificationPreferences: {
    showReminder15Min: boolean;
    showReminder30Min: boolean;
    giveawayAlerts: boolean;
    newsAlerts: boolean;
  };
  fcmTokens: string[];
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: String,

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },

    preferredLanguage: {
      type: String,
      enum: ["Hindi", "Punjabi", "Urdu", "English"],
    },

    city: String,

    region: String,

    provider: {
      type: String,
      enum: ["email", "google", "apple", "phone"],
      default: "email",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    subscribedShows: [
      {
        type: Schema.Types.ObjectId,
        ref: "Show",
      },
    ],

    fcmTokens: [String],
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
