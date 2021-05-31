const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Please provide a username"]
    },
    email: {
        type: String,
        require: [true, "Please provide a email address"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        require: [true, "Please provide a password"],
        minLength: 6,
        // when ever we query for a user we don't want a password as return explicitly.
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// below functions run before saving data into database
//  hashing password before saving it
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

    next();
});

//this password is inputed by the user or get by the body of json
UserSchema.methods.matchPasswords = async function (password) {
    //this.password is selected from the data base when user is find
    return await bcrypt.compare(password, this.password);
};

// generating token for users
UserSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
