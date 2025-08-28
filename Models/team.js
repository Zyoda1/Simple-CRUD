const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: String,
  position: String,
  jerseyNumber: Number
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },       
  coach: String,                                
  foundedYear: Number,                          
  stadium: String,                             
  league: String,                               
  players: [playerSchema],                      
  isActive: { type: Boolean, default: true }    
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
