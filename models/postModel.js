const mondoose = require('mongoose');

const postSchema = mondoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },

    body: {
        type: String,
        required: [true, 'Body is required']
    },
});

const Post = mondoose.model('Post', postSchema);
module.exports = Post;