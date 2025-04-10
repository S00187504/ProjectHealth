import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['appointment', 'reminder', 'message', 'result', 'system', 'other'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
      required: false,
    },
    onModel: {
      type: String,
      enum: ['Appointment', 'Patient', 'MedicalRecord', 'User'],
      required: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    expiresAt: {
      type: Date,
      default: null, // null means never expires
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup of unread notifications
notificationSchema.index({ recipient: 1, isRead: 1 });

// Index for expiry - useful for TTL operations if implemented
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 