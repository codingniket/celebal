const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/post');
const fs = require('fs');
const {
	ensureAuthenticated,
} = require('../middlewares/authentication');

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

	async (req, res) => {
		try {
			const { title, body, tags, coverImageUrl } =
				req.body;

			const blog = await Post.create({
				title,
				body,
				tags,
				createdBy: req.user._id,
				coverImageUrl,
			});

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
