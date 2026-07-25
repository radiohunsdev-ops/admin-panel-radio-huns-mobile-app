import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotificationLog extends Document {
  user: mongoose.Types.ObjectId;
  schedule: mongoose.Types.ObjectId;
  show: mongoose.Types.ObjectId;

  expoPushToken: string;

  type: "15min" | "30min" | "start";

  title: string;
  body: string;

  status: "pending" | "sent" | "failed";

  sentAt?: Date;
  error?: string;
}

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
      index: true,
    },

    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },

    expoPushToken: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["15min", "30min", "start"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true,
    },

    sentAt: {
      type: Date,
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Prevent duplicate notifications
 * One user can receive only one notification
 * of the same type for the same schedule.
 */
NotificationLogSchema.index(
  {
    user: 1,
    schedule: 1,
    type: 1,
  },
  {
    unique: true,
  }
);

const NotificationLog: Model<INotificationLog> =
  mongoose.models.NotificationLog ||
  mongoose.model<INotificationLog>(
    "NotificationLog",
    NotificationLogSchema
  );

export default NotificationLog;