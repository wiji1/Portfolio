import express from "express";
import fetch from "node-fetch";
import {BLOG_TABLE, db} from "../../controllers/database";
import BlogPost from "@shared/types/post";

export const createBlogRouter = () => {
	const profileRouter = express.Router();

	profileRouter.get("/blog", async (req, res) => {
		db(BLOG_TABLE)
			.select("*")
			.then((blogPostsFromDb: any[]) => {
				const posts: BlogPost[] = blogPostsFromDb.map((blogPost: BlogPost) => {
					blogPost.created_at = new Date(blogPost.created_at).toISOString();

					return blogPost;
				})

				res.status(200).json({
					status: true,
					posts: posts,
				});

			});
		return false;
	});

	profileRouter.get("/blog/:id", async (req, res) => {
		const { id } = req.params;
		db(BLOG_TABLE)
			.select("*")
			.where({ id })
			.first()
			.then(async (blogPostFromDb: any) => {
				if (!blogPostFromDb) {
					return res.status(404).json({
						status: false,
						message: "Post not found",
					});
				}

				const response = await fetch("https://api.github.com/markdown", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `token ${process.env.GITHUB_TOKEN}`
					},
					body: JSON.stringify({
						text: blogPostFromDb.post,
					}),
				});

				const post: BlogPost = {
					...blogPostFromDb,
					post: await response.text(),
					created_at: new Date(blogPostFromDb.created_at).toISOString(),
				};

				res.status(200).json({
					status: true,
					post: post,
				});
			});
	});

	return profileRouter;
};
