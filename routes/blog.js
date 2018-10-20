var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs'),
    gm = require('gm');

var Blog = require('../models/blog');
var Decerta = require('../models/dekerta');
var User = require('../models/user-model');
var waterfall = require('async/waterfall');

// Get list
router.get('/my-blog/list', function(req, res, next) {
  waterfall([
    async (cb) => {
      let query = await Blog.count();
      // (err, total) => {
      //   if (err) cb(err);
      //   let dto = {total: total > 60 ? 60 : total};
      //   cb(null, query, dto);
      // });

      console.log(query);
      cb(null, query, {total: 50});
    },
    (query, dto, cb) => {
      query.sort({ date: 'desc'}).skip(
        ((!req.query.page || req.query.page === 1) ? 0 : req.query.page - 1) * 7
      ).limit(7).exec('find', (err, blogs) => {

        dto.blogs = blogs;
        dto.rights = req.user && req.user.rights === 'mieszko' || false;

        cb(null, dto);
      });
    }
  ], (err, response) => {
    if (err) {
      console.log('bla-bla', err);
    } else {
      res.json(response);
    }
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
router.post('/my-blog', forbiddenMieszko, function(req, res, next) {

    if (!req.files) {
        createBlog();
    } else {

        if (req.files.file.truncated) {
            res.status(413).send('File is too big!');
        }

        let magic = gm(req.files.file.data);
        let arr = req.body.crop.split(',');
        let clientWidth = arr[0];
        let clientHeight = arr[1];
        let clientX = arr[2];
        let clientY = arr[3];

        magic.size({bufferStream: true}, (err, {width, height}) => {
            if (err) {
                console.log(err);
                createBlog();
            }
            let widthy = width / 100 * clientWidth;
            let heighty = height / 100 * clientHeight;
            let x = width / 100 * clientX;
            let y = height / 100 * clientY;

            magic.crop(widthy, heighty, x, y)
                .write(path.join(__dirname, '../public' + req.body.url), function (err) {
                        if (err) {
                            createBlog();
                        } else {
                            createBlog(req.body.url);
                        }
                });
        });

    }

    function createBlog(url = '/assets/pictures/blog.jpg') {
        delete req.body.crop;

        Blog.create(req.body, function(err, blog) {

            if (err) console.log(err);

            blog.url = url;

            res.json(blog);
        });
    }
});


// Update entity
router.put('/my-blog', forbiddenMieszko, (req, res) => {
    if (!req.files) {
        updateBlog();
    } else {
        let { file } = req.files;

        // Use the mv() method to place the file somewhere on your server
        file.mv(path.join(__dirname, '../public/assets/pictures/' + req.files.file.name), (err) => {
            if (err) {
                updateBlog(true);
            } else {
                req.body.url = '/assets/pictures/' + req.files.file.name;
                updateBlog();
            }
        });
    }


    function updateBlog(previousUrl) {
        let blogi = req.body;

        if (previousUrl) {delete blogi.url;}

        Blog.update({_id: blogi._id}, blogi, function(err, blog) {
            if (err) console.log(err);

            Blog.findById(blogi._id, function(err, result) {
                if (err) console.log(err);

                res.json(result);
            });
        });
    }
});


// Update entity
router.delete('/my-blog/:id', forbiddenMieszko, function(req, res, next) {
    let blogId = req.params.id;
    Blog.remove({_id: blogId}, function(err, blog) {
        if (err) console.log(err);
        res.json(blog);
    });

});
