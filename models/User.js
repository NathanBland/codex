var mongoose = require('mongoose');
var Code = require('./Code');

var followerSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        index: true
    }
});
var followedSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        index: true
    }
});

var User = mongoose.Schema({

    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    followers: [followerSchema],
    followed: [followedSchema]
});

User.plugin(require('passport-local-mongoose'));

//user methods
User.methods.newCode = function() {
    var code = new Code();
    code.user_id = this.id;
    return code;
}
User.methods.getPosts = function(callback) {
    return Code.find({
        user_id: this._id
    }, callback);
};

module.exports = mongoose.model('user', User);