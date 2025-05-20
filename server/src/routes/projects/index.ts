import express from "express";
import { db, PROJECTS_TABLE } from "../../controllers/database";
import Project from "@shared/types/project";

export const createProjectsRouter = () => {
	const projectsRouter = express.Router();

	projectsRouter.get("/projects", (req, res) => {
		db(PROJECTS_TABLE)
			.select("*")
			.then((projectsFromDb: any[]) => {
				const projects: Project[] = projectsFromDb.map((projectFromDb) => {
					let imageString = "";
					if (projectFromDb.image && Buffer.isBuffer(projectFromDb.image)) {
						imageString = `data:image/jpeg;base64,${projectFromDb.image.toString(
							"base64"
						)}`;
					} else if (typeof projectFromDb.image === "string") {
						imageString = projectFromDb.image;
					}

					return {
						id: projectFromDb.id,
						title: projectFromDb.title,
						description: projectFromDb.description,
						tags: projectFromDb.tags,
						code_url: projectFromDb.code_url,
						demo_url: projectFromDb.demo_url,
						image: imageString,
					};
				});

				res.status(200).json({
					status: true,
					projects: projects,
				});
			})
			.catch((error: Error) => {
				console.error("Error fetching projects:", error);
				res.status(500).json({
					status: false,
					message: error.message || "Internal Server Error",
				});
			});
	});

	return projectsRouter;
};
