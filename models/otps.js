const mongoose = require('mongoose');

const otpsSchema = new mongoose.Schema({
  data: {
    userid: {type: String, required: true},
    otp: {type: String, required: true}
  },
  createdAt: {type: Date, default: Date.now}
});

otpsSchema.index({createdAt: 1}, {expireAfterSecons: 600});

module.exports = mongoose.model('otps', otpsSchema);