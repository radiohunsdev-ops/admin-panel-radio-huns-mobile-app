import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShow extends Document {
  showName: string;
  shortTitle?: string;
  description: string;

  host:
    | mongoose.Types.ObjectId
    | {
        _id: string;
        hostName: string;
      };

  station: string;
  language: string;
  genre: string;
  tags: string[];
  coverImage?: string;
  isLive: boolean;
  isFeatured: boolean;
  showOnHome: boolean;
  allowSubscriptions: boolean;
  enableComments: boolean;

  status: "active" | "inactive" | "archived";
}

const ShowSchema = new Schema(
  {
    showName: {
      type: String,
      required: true,
      trim: true,
    },

    shortTitle: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    station: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      default: "English",
    },

    genre: {
      type: String,
      required: true,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    coverImage: {
      type: String,
      default: "",
    },

    isLive: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    showOnHome: {
      type: Boolean,
      default: true,
    },

    allowSubscriptions: {
      type: Boolean,
      default: true,
    },

    enableComments: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Show: Model<IShow> =
  mongoose.models.Show || mongoose.model<IShow>("Show", ShowSchema);

export default Show;
