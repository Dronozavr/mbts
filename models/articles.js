var mongoose = require('mongoose');

var BlogSchema = mongoose.Schema({
    name: { type: String},
    date: {type: Number, required: true},
    preview: { type: String},
    description: { type: String},
    url: { type: String},
    color: { type: String}
});


module.exports = mongoose.model('Article', BlogSchema);
