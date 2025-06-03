import express from "express";
import { db, PROFILE_TABLE } from "../../controllers/database";

export const createResumeRouter = () => {
	const profileRouter = express.Router();

	profileRouter.get("/resume", async (req, res) => {
		try {
			const [profileFromDb] = await db(PROFILE_TABLE).select("*").limit(1);

			if (!profileFromDb || !profileFromDb.resume) {
				return res.status(404).json({ status: false, message: "Resume not found" });
			}

			const resumeBuffer = profileFromDb.resume;

			res.setHeader("Content-Type", "application/pdf");
			res.setHeader("Content-Disposition", "attachment; filename=\"resume.pdf\"");
			res.send(resumeBuffer);

		} catch (error: any) {
			console.error("Error fetching resume:", error);
			res.status(500).json({
				status: false,
				message: error.message || "Internal Server Error",
			});
		}

		return false;
	});

	return profileRouter;
};
