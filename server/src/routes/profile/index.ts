import express from "express";
import { db, PROFILE_TABLE } from "../../controllers/database";

export const createProfileRouter = () => {
	const profileRouter = express.Router();

	profileRouter.get("/profile", async (req, res) => {
		try {
			const [profileFromDb] = await db(PROFILE_TABLE).select("*").limit(1);

			if (!profileFromDb) {
				return res.status(404).json({ status: false, message: "Profile not found" });
			}

			let imageString = "";
			if (profileFromDb.image && Buffer.isBuffer(profileFromDb.image)) {
				imageString = `data:image/jpeg;base64,${profileFromDb.image.toString("base64")}`;
			} else if (typeof profileFromDb.image === "string") {
				imageString = profileFromDb.image;
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { image, ...rest } = profileFromDb;
			const profile = {
				...rest,
				image: imageString,
			};

			res.status(200).json({ status: true, profile });
		} catch (error: any) {
			console.error("Error fetching profile:", error);
			res.status(500).json({
				status: false,
				message: error.message || "Internal Server Error",
			});
		}

		return false;
	});

	return profileRouter;
};
