const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    documentType: mongoose.Schema.Types.Number,
    documentNumber: mongoose.Schema.Types.String,
    firstName: mongoose.Schema.Types.String,
    secondName: mongoose.Schema.Types.String,
    firstSurname: mongoose.Schema.Types.String,
    secondSurname: mongoose.Schema.Types.String,
    gender: mongoose.Schema.Types.String,
    role: { type: mongoose.Schema.Types.Number, default: 0 },
    address: mongoose.Schema.Types.String,
    phoneNumbers: mongoose.Schema.Types.String, // Formato: numero1 - numero2 - numero3 - ...
    email: mongoose.Schema.Types.String,
    creationDate: { type: mongoose.Schema.Types.Date, default: Date.now },
    lastTimeModified: mongoose.Schema.Types.Date,
    lastTimeModifiedBy: mongoose.Schema.Types.ObjectId,
    username: { type: mongoose.Schema.Types.String, lowercase: true, trim: true },
    password: mongoose.Schema.Types.String,
    secretQuestion: mongoose.Schema.Types.String,
    secretAnswer: mongoose.Schema.Types.String,
    status: { type: mongoose.Schema.Types.Number, default: 1} // Borrado, desactivado, activado, 
});

userSchema.index({ documentType: 1, documentNumber: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', function preSave(next) {
    this.lastTimeModified = Date.now();
    next();
});

module.exports = mongoose.model("User", userSchema);