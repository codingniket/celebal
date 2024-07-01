// const { Router } = require('express');
// const router = Router();
// const multer = require('multer');
// const path = require('path');
// const Post = require('../models/post');
// const fs = require('fs');
// const {
// 	ensureAuthenticated,
// } = require('../middlewares/authentication');

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, __dirname + '/../public/uploads/');
// 	},
// 	filename: function (req, file, cb) {
// 		const fileName = `${Date.now()}-${
// 			file.originalname
// 		}`;
// 		cb(null, fileName);
// 	},
// });

// const upload = multer({ storage: storage });

// router.get('/add-new', (req, res) => {
// 	return res.render('addBlog', {
// 		user: req.user,
// 	});
// });

// router.get('/:id', async (req, res) => {
// 	const blog = await Post.findById(req.params.id);
// 	console.log(blog);
// 	return res.render('blog', {
// 		user: req.user,
// 		blog,
// 		tags: req.tags,
// 	});
// });

// router.post(
// 	'/',
// 	upload.single('coverImageUrl'),
// 	async (req, res) => {
// 		try {
// 			const { title, body, tags } = req.body;

// 			const blog = await Post.create({
// 				title,
// 				body,
// 				tags,
// 				createdBy: req.user._id,
// 				coverImageUrl: `/uploads/${req.file.filename}`,
// 			});

// 			return res.redirect(`/blog/${blog._id}`);
// 		} catch (error) {
// 			console.error(error);
// 			return res.status(500).send('Server Error');
// 		}
// 	}
// );

// router.delete(
// 	'/:id',
// 	ensureAuthenticated,
// 	async (req, res) => {
// 		try {
// 			const blog = await Post.findById(
// 				req.params.id
// 			);

// 			// Check if blog exists
// 			if (!blog) {
// 				return res
// 					.status(404)
// 					.send('Blog not found');
// 			}

// 			// Check if the user is the creator of the blog
// 			if (
// 				blog.createdBy.toString() !==
// 				req.user._id.toString()
// 			) {
// 				return res
// 					.status(403)
// 					.send('Unauthorized');
// 			}

// 			// Delete the blog
// 			await blog.deleteOne();

// 			return res
// 				.status(200)
// 				.send('Blog deleted successfully');
// 		} catch (error) {
// 			console.error(error);
// 			return res.status(500).send('Server Error');
// 		}
// 	}
// );

// module.exports = router;

const { Router } = require('express');
const router = Router();
const multer = require('multer');
const {
	GridFsStorage,
} = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('../models/post');
const fs = require('fs');
const {
	ensureAuthenticated,
} = require('../middlewares/authentication');

// MongoDB connection setup
const conn = mongoose.connection;

// Create storage engine using GridFS
const storage = new GridFsStorage({
	url: 'your_mongodb_connection_string',
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	file: (req, file) => {
		return {
			bucketName: 'uploads', // Collection name in MongoDB
			filename: `${Date.now()}-${
				file.originalname
			}`,
		};
	},
});

const upload = multer({ storage });

// Your routes with GridFS handling
router.get('/add-new', (req, res) => {
	return res.render('addBlog', {
		user: req.user,
	});
});

router.get('/:id', async (req, res) => {
	const blog = await Post.findById(req.params.id);
	console.log(blog);
	return res.render('blog', {
		user: req.user,
		blog,
		tags: req.tags,
	});
});

router.post(
	'/',
	upload.single('coverImageUrl'),
	async (req, res) => {
		try {
			const { title, body, tags } = req.body;

			// Create post object
			const blog = new Post({
				title,
				body,
				tags,
				createdBy: req.user._id,
			});

			// Set coverImageUrl to the GridFS file id
			blog.coverImageUrl = req.file.id;

			// Save post to MongoDB
			await blog.save();

			return res.redirect(`/blog/${blog._id}`);
		} catch (error) {
			console.error(error);
			return res.status(500).send('Server Error');
		}
	}
);

router.delete(
	'/:id',
	ensureAuthenticated,
	async (req, res) => {
		try {
			const blog = await Post.findById(
				req.params.id
			);

			// Check if blog exists
			if (!blog) {
				return res
					.status(404)
					.send('Blog not found');
			}

			// Check if the user is the creator of the blog
			if (
				blog.createdBy.toString() !==
				req.user._id.toString()
			) {
				return res
					.status(403)
					.send('Unauthorized');
			}

			// Delete the blog
			await blog.deleteOne();

			return res
				.status(200)
				.send('Blog deleted successfully');
		} catch (error) {
			console.error(error);
			return res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
