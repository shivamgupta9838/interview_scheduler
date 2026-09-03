const mongoose = require("mongoose");
const logger = require("../logger");
const bcrypt= require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required:true
    },

    age: Number,

    active: {
        type: Boolean,
        default: true
    },

    role: {
        type: String,
        enum: [
            "admin",
            "recruiter",
            "interviewer",
        ],
        default: "interviewer"
    }

},
    {
        timestamps: true,
    }
);

userSchema.pre("save",async function (next) {
    this.password = await bcrypt.hash(this.password, 5);
});

userSchema.post("save", function (doc) {
    logger.info("User saved");

    logger.info(doc.name);
});

userSchema.pre("find", function () {
});

userSchema.post("find", function (docs) {
});

userSchema.pre("findOne", function () {
    logger.info("Finding one user");
});

userSchema.pre("findOneAndUpdate", function () {
    logger.info("Updating user");
});

userSchema.pre("findOneAndUpdate", function () {
    logger.info("Updating user");
});

userSchema.post("deleteOne", function () {
    logger.info("Deleted");
});

userSchema.pre("validate", function () {
    logger.info("Validating...");
});

module.exports = mongoose.model("User", userSchema);