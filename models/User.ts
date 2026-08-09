import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  profileImage?: string;
  phone?: string;
  password?: string;

  role: "admin" | "manager" | "user";

  preferredLanguage?: "Hindi" | "Punjabi" | "Urdu" | "English";

  city?: string;
  region?: string;

  provider?: "email" | "google" | "apple" | "phone";

  emailVerified: boolean;

  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;

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
      trim: true,
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
      required: false,
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

    city: {
      type: String,
    },

    region: {
      type: String,
    },

    provider: {
      type: String,
      enum: ["email", "google", "apple", "phone"],
      default: "email",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // Forgot Password OTP
    resetPasswordOtp: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    subscribedShows: [
      {
        type: Schema.Types.ObjectId,
        ref: "Show",
      },
    ],

    listeningHistory: [
      {
        show: {
          type: Schema.Types.ObjectId,
          ref: "Show",
        },

        startedAt: {
          type: Date,
        },

        endedAt: {
          type: Date,
        },
      },
    ],

    notificationPreferences: {
      showReminder15Min: {
        type: Boolean,
        default: true,
      },

      showReminder30Min: {
        type: Boolean,
        default: true,
      },

      giveawayAlerts: {
        type: Boolean,
        default: true,
      },

      newsAlerts: {
        type: Boolean,
        default: true,
      },
    },

    fcmTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
