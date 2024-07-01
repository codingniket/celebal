const { Schema, model } = require('mongoose');

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		coverImageUrl: {
			type: String,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		tags: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Post = model('post', postSchema);

module.exports = Post;
