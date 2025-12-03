// server/models/Booking.ts
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dates: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
