const express = require('express');
const router = express.Router();
const Blog = require('../models/post'); // Adjust the path to your Blog model

// Route to handle search functionality
router.get('/search', async (req, res) => {
	const query = req.query.query;
	try {
		const blogs = await Blog.find({
			$or: [
				{
					title: { $regex: query, $options: 'i' },
				},
				{
					tags: { $regex: query, $options: 'i' },
				},
			],
		});
		res.render('home', { blogs });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// Route to handle fetching a single blog by ID
router.get('/blog/:id', async (req, res) => {
	try {
		const blog = await Blog.findById(
			req.params.id
		);
		res.render('blog', { blog });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
