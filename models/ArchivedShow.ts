import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArchivedShow extends Document {
  show: mongoose.Types.ObjectId;
  schedule: mongoose.Types.ObjectId;

  title: string;
  description?: string;
  host?: string;

  broadcastDate: Date;
  durationSeconds: number;

  audioUrl: string;
  storageKey?: string;
  artworkUrl?: string;

  status: "draft" | "published" | "archived";

  createdAt: Date;
  updatedAt: Date;
}

const ArchivedShowSchema = new Schema<IArchivedShow>(
  {
    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },

    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    host: {
      type: String,
      default: "",
      trim: true,
    },

    broadcastDate: {
      type: Date,
      required: true,
      index: true,
    },

    durationSeconds: {
      type: Number,
      required: true,
      min: 1,
    },

    // Public or signed URL used by the app to play the recording
    audioUrl: {
      type: String,
      required: true,
      trim: true,
    },

    storageKey: {
      type: String,
      default: "",
      trim: true,
    },

    artworkUrl: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ArchivedShowSchema.index(
  { schedule: 1, broadcastDate: 1 },
  { unique: true },
);

ArchivedShowSchema.index({
  status: 1,
  broadcastDate: -1,
});

ArchivedShowSchema.index({
  show: 1,
  status: 1,
  broadcastDate: -1,
});

const ArchivedShow: Model<IArchivedShow> =
  mongoose.models.ArchivedShow ||
  mongoose.model<IArchivedShow>("ArchivedShow", ArchivedShowSchema);

export default ArchivedShow;