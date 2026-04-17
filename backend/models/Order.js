import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingDetails: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },
    address: {
      type: String,
      required: true,
      minlength: 10
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['creditCard', 'debitCard', 'netBanking', 'upi', 'cod'],
    default: 'creditCard'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
