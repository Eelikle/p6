const mongoose = require('mongoose');
// modify the data from PDF 
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  usersLiked: { type: Array, required: true },
  manufacturer: { type: String, required: true },
  id: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersDisliked: { type: Array, required: true }
});



module.exports = mongoose.model('Sauce',sauceSchema);