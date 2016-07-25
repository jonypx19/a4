var multer = require("multer");
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/assets/images');
	},
	filename: function(req, file, callback) {
		callback(null, "bob_" + file.originalname);
	}
});

var upload = multer({storage: storage}).single("image");

exports.uploadImage = upload;