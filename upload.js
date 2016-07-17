var multer = require("multer");
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './tmp');
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname);
	}
});

var upload = multer({storage: storage}).single("image");

exports.uploadImage = upload;