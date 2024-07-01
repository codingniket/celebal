const { Schema, model } = require('mongoose')
const {createHmac, randomBytes} = require("crypto");
const { throws } = require('assert');
const { createToken } = require('../utils/auth');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    salt: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImgUrl: {
        type: String,
        default: '/images/user.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default:"USER",
    }

}, { timestamps: true })

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    // const salt ="xxx";
    const hash = createHmac('sha256',salt).update(user.password).digest("hex")

    this.salt = salt;
    this.password = hash 

    next();

})

// userSchema.static("matchPassword",async function (email, password)
// {
//     const user = await this.findOne({ email })
    
//     if (!user)  throw new Error('Not found');

//     const salt = user.salt;
//     const hash = user.password;

//     const userProvidedHash = createHmac('sha256', salt).update(user.password).digest("hex");

//     if (hash !== userProvidedHash)
//     {
//         throw new Error('Not found user with credentials');
//         }

//     return user
// })
 
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error('Not found');

    const salt = user.salt;
    const hash = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest("hex");

    if (hash !== userProvidedHash) {
        throw new Error('Not found user with credentials');
    }

    // Return the user without the password and salt fields
    // const userObject = user.toObject();
    // delete userObject.password;
    // delete userObject.salt;

    // return userObject;

    const token = createToken(user)

    return token
});

const User = model('user', userSchema)

module.exports = User

