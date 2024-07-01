const express = require('express');
const methodOverride = require('method-override');

const mongoose = require('./database'); // Ensure this path is correct
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const {
	checkAuthCookie,
} = require('./middlewares/authentication'); // Correct import

const Blog = require('./models/post');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const searchRoutes = require('./routes/search');

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthCookie('token'));
app.use(express.static(path.resolve('./public')));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
	const allBlog = await Blog.find({});

	res.render('home', {
		user: req.user,
		blogs: allBlog,
	});
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.use(searchRoutes); // Ensure this comes before any route that might conflict

app.listen(port, () => {
	console.log(`Server running at port : ${port}`);
});
