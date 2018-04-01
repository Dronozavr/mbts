var Blog = require('../models/blog');

var mongoose = require('mongoose');

mongoose.connect('mongodb://dronozavr:01091992@ds123029.mlab.com:23029/mbts');

var blogs = [
    new Blog({
        id: 'JDHJHJH&',
        name: "Firts",
        preview: "First preview",
        description: "his is vey small description"
    }),
    new Blog({
        id: 'JDHJHJH&',
        name: "Firts",
        preview: "First preview",
        description: "his is vey small description"
    }),
    new Blog({
        id: 'JDHJHJH&',
        name: "Firts",
        preview: "First preview",
        description: "his is vey small description"
    })
];

var done = 0;
for (var i = 0; i < blogs.length; i++) {
    blogs[i].save(function(err, result){
        done++;
        if (done === blogs.length) {
            exit();
        }
    })
}

function exit() {
    mongoose.disconnect();
}
