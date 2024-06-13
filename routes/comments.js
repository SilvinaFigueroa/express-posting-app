const express = require('express')
const router = express.Router()

const users = require('../data/users.js');
const posts = require('../data/posts.js');
const comments = require('../data/comments.js');

//GET route to get all comments
router.get('/', (req, res) => {
    res.json(comments);
});

// GET route to get a comment by ID
router.get('/:id', (req, res, next) => {
    // Using the Array.find method to find the user with the same id as the one sent with the request
    const comment = comments.find((comment) => comment.id == req.params.id);
    if (comment) {
        res.json(comment);
    } else {
        // If the comment doesn't exist
        next();
    }
});


module.exports = router;