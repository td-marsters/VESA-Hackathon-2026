// models/Cart.js
const cartSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref:  'Item', required: true,}
  }],

}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);