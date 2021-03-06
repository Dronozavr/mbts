var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs')
    , gm = require('gm');

var Blog = require('../models/blog');
var Decerta = require('../models/dekerta');
var User = require('../models/user-model');

// Get list
router.get('/my-blog/list', function(req, res, next) {
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
        to: 'mieszkobulik@gmail.com',
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


// ******************************************* DEKERTA ***************************************** //
// Get list
router.get('/dekerta-blog/list', forbiddenDecerta, function(req, res, next) {
    Decerta.find(function(err, blogs) {

        let response = { blogs, rights: req.user && req.user.rights === 'mieszko' || false };

        res.json(response);
    });

});

// Get entity
router.get('/dekerta-blog/:id', forbiddenDecerta, function(req, res, next) {
    Decerta.findById(req.params.id, function(err, blog) {
        if (err) console.log(err);

        let response = { ...blog._doc, rights: req.user && req.user.rights === 'mieszko' || false };

        res.json(response);
    });

});


// Create entity
router.post('/dekerta-blog', forbiddenMieszko, function(req, res, next) {
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

        Decerta.create(req.body, function(err, blog) {

            if (err) console.log(err);

            blog.url = url;

            res.json(blog);
        });
    }
});


// Update entity
router.put('/dekerta-blog', forbiddenMieszko, function(req, res, next) {

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

        Decerta.update({_id: blogi._id}, blogi, function(err, blog) {
            if (err) console.log(err);

            Decerta.findById(blogi._id, function(err, result) {
                if (err) console.log(err);

                res.json(result);
            });
        });
    }
});


// Update entity
router.delete('/dekerta-blog/:id', forbiddenMieszko, function(req, res, next) {
    let blogId = req.params.id;
    Decerta.remove({_id: blogId}, function(err, blog) {
        if (err) console.log(err);
        res.json(blog);
    });

});

function forbiddenDecerta(req, res, next) {
    console.log(req.user);
    if (req.user && req.user.rights === 'mieszko' || req.user && req.user.rights === 'vip') {
        next();
    } else {
        res.status(500).send({ error: 'Sorry you have no rights to see this page, please contact administrator or log-in!'});
    }
}


// ****************************************** USERS*********************************************** //
// Get list
router.get('/users/list', forbiddenMieszko, function(req, res, next) {
    User.find(function(err, users) {

        let response = { users, rights: req.user && req.user.rights === 'mieszko' || false };

        res.json(response);
    });

});

// Update entity
router.put('/users/save', forbiddenMieszko, function(req, res, next) {
    console.log(req.user);
    let user = req.body;
    User.update({_id: user._id}, user, function(err, blog) {
        if (err) console.log(err);


        User.findById(user._id, function(err, user) {
            if (err) console.log(err);

            res.json(user);
        });

    });

});


// Update entity
router.delete('/my-blog/:id', forbiddenMieszko, function(req, res, next) {
    let blogId = req.params.id;
    User.remove({_id: blogId}, function(err, blog) {
        if (err) console.log(err);
        res.json(blog);
    });

});

function forbiddenMieszko(req, res, next) {
    console.log(req.user);
    if (req.user && req.user.rights === 'mieszko') {
        next();
    } else {
        res.status(500).send({ error: 'Sorry you have no rights to see this page!'});
    }
}


router.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    console.log(req.files.file);
    console.log(req.files);

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.file;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path.join(__dirname, '../public/assets/pictures/' + req.files.file.name), function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});


module.exports = router;
