var fs = require('fs')
    , gm = require('gm');

// resize and remove EXIF profile data
let yo = gm('./blog.jpg');
    yo.size((err, {width, height}) => {
        let widthy = width / 100 * 40.83969465648854;
        let heighty = height / 100 * 90.67796610169489;
        let x = width / 100 * 47.51482082687261;
        let y = height / 100 * 9.322033898305108;

        yo.crop(widthy, heighty, x, y)
        .write('./resize.jpg', function (err) {

            if (!err) console.log('done');
        });
    });

