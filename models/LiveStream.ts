import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface ILiveStream
  extends Document {
  stationName: string;
  stationCode: string;
  frequency: string;
  language: string;
  streamUrl: string;
  backupStreamUrl?: string;
  coverImage?: string;
  logo?: string;
  genre: string;
  isActive: boolean;
}

const LiveStreamSchema =
  new Schema(
    {
      stationName: {
        type: String,
        required: true,
        trim: true,
      },

      stationCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },

      frequency: {
        type: String,
        required: true,
      },

      language: {
        type: String,
        required: true,
      },

      streamUrl: {
        type: String,
        required: true,
      },

      backupStreamUrl: {
        type: String,
        default: "",
      },

      coverImage: {
        type: String,
        default: "",
      },

      logo: {
        type: String,
        default: "",
      },

      genre: {
        type: String,
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

const LiveStream: Model<ILiveStream> =
  mongoose.models.LiveStream ||
  mongoose.model(
    "LiveStream",
    LiveStreamSchema
  );

export default LiveStream;