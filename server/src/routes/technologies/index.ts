import express from "express";
import { db, TECHNOLOGIES_TABLE } from "../../controllers/database";
import Technology from "@shared/types/technology";

export const createTechnologiesRouter = () => {
	const technologiesRouter = express.Router();

	technologiesRouter.get("/technologies", (req, res) => {
		db(TECHNOLOGIES_TABLE)
			.select("*")
			.then((technologiesFromDb: any[]) => {
				const technologies: Technology[] = technologiesFromDb.map((technologyFromDb) => {
					return technologyFromDb;
				});

				res.status(200).json({
					status: true,
					technologies: technologies,
				});
			})
			.catch((error: Error) => {
				console.error("Error fetching technologies:", error);
				res.status(500).json({
					status: false,
					message: error.message || "Internal Server Error",
				});
			});
	});

	return technologiesRouter;
};
