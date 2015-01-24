var mongoose = require("mongoose");
var tagSchema = new mongoose.Schema({
    tag: String //I feel like we need something else here, but I don't know what.
})
var codeSchema = new mongoose.Schema({
    title: String,
    lang: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        index: true
    },
    code: String,
    tags: [tagSchema]
});
module.exports = mongoose.model('post', codeSchema);