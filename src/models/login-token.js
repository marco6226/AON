const mongoose = require("mongoose")
const loginTokenSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, lowercase: true, trim: true },
    token: { type: mongoose.Schema.Types.Number, default: () => Math.random() * 8999999 + 1000000 },
    expirationTime: { type: mongoose.Schema.Types.Number, default: () => Date.now() + 5*60*1000 },
});


module.exports = mongoose.model("LoginToken", loginTokenSchema);