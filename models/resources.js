const mongoose = require('mongoose');
 
const resourceSchema = mongoose.Schema({
  name: {type: String, required: true},
  tags: {type: [String]},
  branch: {type: String, required: true},
  type: {type: String, required: true},
  semester : {type: Number, required: true},
  subject: {type: String, required: true},
  file: {type: String, required: true}
})

module.exports = mongoose.model('resource', resourceSchema);