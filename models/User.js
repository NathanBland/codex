var mongoose = require('mongoose');

var followerSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    }
});
var followedSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    }
});

var User = mongoose.Schema({
    
    name: {
        type: String,
        required: false
    }
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
    }
    followers: [followerSchema],
    followed: [followedSchema],
    
});
User.plugin(require('passport-local-mongoose'));

module.exports = mongoose.model('user', User);