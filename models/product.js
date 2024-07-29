const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let productSchema = new Schema(
    {
        name: { type: String},
        description: { type: String},
        price: {type: Number},
        inStock: {type: Boolean}
    },
    // add timestampt automatically (with updateAt n createAt)
    {
        timestamps: true
    }
    // custom collection name, (default is the plural word of your model name e.g. product -> products)
    // ,{
    //     collection: "colProducts"
    // }

    // name: string
    // description: string
    // price: number
    // inStock: boolean
);

module.exports = mongoose.model("product", productSchema);

