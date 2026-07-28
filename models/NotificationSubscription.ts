import mongoose, { Schema, Document } from "mongoose";
import "@/models/schedules";
export interface INotificationSubscription extends Document {
  user: mongoose.Types.ObjectId;
  schedule: mongoose.Types.ObjectId;
  expoPushToken: string;

  notify15Min: boolean;
  notify30Min: boolean;
  notifyStartNow: boolean;

  active: boolean;
}

const NotificationSubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },

    expoPushToken: {
      type: String,
      required: true,
    },

    notify15Min: {
      type: Boolean,
      default: true,
    },

    notify30Min: {
      type: Boolean,
      default: false,
    },

    notifyStartNow: {
      type: Boolean,
      default: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
NotificationSubscriptionSchema.index(
  {
    user: 1,
    schedule: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.models.NotificationSubscription ||
  mongoose.model("NotificationSubscription", NotificationSubscriptionSchema);
