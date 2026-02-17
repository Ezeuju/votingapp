const mongoose = require("mongoose");

const advertModel = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ["Active", "Disabled"],
            default: "Disabled",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        target_app: [
            {
                type: String
            },
        ],
        target_url: {
            type: String
        },
        image_url: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        clicks: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true
    }
);


advertModel.index({
    title: "text"
});

module.exports = mongoose.model("Advert", advertModel);
