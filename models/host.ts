import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface IHost extends Document {
  fullName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  email: string;
  phone: string;
  city: string;

  languages: string[];
  specialties: string[];

  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    website: string;
  };

  isFeatured: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const HostSchema = new Schema<IHost>(
  {
    fullName: {
      type: String,
      required: [true, "Host name is required"],
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    languages: {
      type: [String],
      default: [],
    },

    specialties: {
      type: [String],
      default: [],
    },

    socialLinks: {
      instagram: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },

      website: {
        type: String,
        default: "",
      },
    },

    isFeatured: {
      type: Boolean,
      default: false,
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

const Host: Model<IHost> =
  mongoose.models.Host ||
  mongoose.model<IHost>(
    "Host",
    HostSchema
  );

export default Host;