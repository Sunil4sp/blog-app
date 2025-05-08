const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema  = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 25,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    imageUrl: {
            type: String,
            default: "https://media.licdn.com/dms/image/v2/D4D03AQH5fX-1hC1fiA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1676646556620?e=1751500800&v=beta&t=re_1AzkJ-dibj9OVzDBJFQxU-OQfI37oMDiBRzMK0HU",
        },
    later: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        },
    ],
    resetPasswordToken: String,
    resetPasswordExpiry: String,
},
    { timestamps: true }
);

userSchema.pre('save', async function (next){
    const user = this;
    const salt = await  bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
});

module.exports = mongoose.model('User', userSchema);