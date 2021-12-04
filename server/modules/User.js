const {Schema,model} = require('mongoose');

const UserS = new Schema({
    email: {type: String, require:true, unique: true},
    password: {type: String, require:true},
    isActivation: {type: Boolean,require:true,default:false},
    activationLink: {type: String},
})

module.exports = model('User', UserS);