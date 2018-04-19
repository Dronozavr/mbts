var express = require('express');
var router = express.Router();

var Blog = require('../models/blog');

// Get list
router.get('/list', function(req, res, next) {
  Blog.find(function(err, blogs) {

      let response = { blogs, rights: req.user && req.user.rights === 'mieszko' || false };

      res.json(response);
  });

});

// Get entity
router.get('/my-blog/:id', function(req, res, next) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) console.log(err);

        let response = { ...blog._doc, rights: req.user && req.user.rights === 'mieszko' || false };

        res.json(response);
    });

});


// Create entity
router.post('/my-blog', forbidden, function(req, res, next) {
    let blog = req.body;

    Blog.create(blog, function(err, blog) {
        if (err) console.log(err);
        res.json(blog);
    });
});


// Update entity
router.put('/my-blog', forbidden, function(req, res, next) {
    console.log(req.user);
    let blogi = req.body;
    Blog.update({_id: blogi._id}, blogi, function(err, blog) {
        if (err) console.log(err);


        Blog.findById(blogi._id, function(err, bloga) {
            if (err) console.log(err);

            res.json(bloga);
        });

    });

});


// Update entity
router.delete('/my-blog/:id', forbidden, function(req, res, next) {
    let blogId = req.params.id;
    Blog.remove({_id: blogId}, function(err, blog) {
        if (err) console.log(err);
        res.json(blog);
    });

});

// Update entity
router.get('/user', function(req, res, next) {
    res.json(req.user);
});


// send Mail block
const transporter = require('../nodemailer/transporter');

/* GET home page. */
router.post('/order', function(req, res) {
    transporter.sendMail(getMailOptions(req.body || {}), (err, result) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            console.log(req.body);
            res.end('good');
        }
    })
});

function getMailOptions(dto = {}) {
    return {
        from: 'AndriyKuf@gmail.com',
        to: 'dronozzavr@gmail.com',
        subject: 'Nodemailer test',
        text: `Name: ${dto.name || 'empty'}; E-mail: ${dto.mail || 'empty'}; Phone: ${dto.phone || 'empty'}; Message: ${dto.msg || 'empty'}`
    }
}


function forbidden(req, res, next) {
    console.log(req.user);
    if (req.user && req.user.rights === 'mieszko') {
        next();
    } else {
        res.status(403).end();
    }
}


module.exports = router;
