import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Interface
 */
export interface ISchedule extends Document {
  show:
    | mongoose.Types.ObjectId
    | {
        _id: string;
        showName: string;
        host?: string;
      };

  mood?: string;

  day: string;
  customDays?: string[];

  startTime: string;
  endTime: string;

  timezone: string;
  duration?: number;

  send15MinAlert: boolean;
  send30MinAlert: boolean;
  sendStartNowAlert: boolean;
  enableSubscriptions: boolean;

  linkedStream?: string;

  backupStream?: string;

  status: "draft" | "published" | "scheduled" | "archived";

  trackAnalytics: boolean;
}

/**
 * Schema
 */
const ScheduleSchema = new Schema(
  {
    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    customDays: [
      {
        type: String,
      },
    ],

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    timezone: {
      type: String,
      default: "America/Toronto",
    },

    duration: {
      type: Number,
    },

    send15MinAlert: {
      type: Boolean,
      default: true,
    },

    send30MinAlert: {
      type: Boolean,
      default: false,
    },

    sendStartNowAlert: {
      type: Boolean,
      default: true,
    },

    enableSubscriptions: {
      type: Boolean,
      default: true,
    },

    linkedStream: {
      type: String,
      trim: true,
    },

    backupStream: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "published",
    },

    trackAnalytics: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Model
 */
const Schedule: Model<ISchedule> =
  mongoose.models.Schedule ||
  mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default Schedule;