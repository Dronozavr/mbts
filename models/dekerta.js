var mongoose = require('mongoose');

var BlogSchema = mongoose.Schema({
    id: { type: String, required: true},
    name: { type: String, required: true},
    date: {type: Number, required: true},
    preview: { type: String, required: true},
    description: { type: String, required: true}
});


module.exports = mongoose.model('Dekerta', BlogSchema);
