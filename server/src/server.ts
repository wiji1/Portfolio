import express, { Express, Response, Request } from "express";
import { createHealthRouter } from "./routes/health";
import {db, PROFILE_TABLE, PROJECTS_TABLE} from "./controllers/database"
import { Knex } from "knex";
import {createProjectsRouter} from "./routes/projects";
import {createProfileRouter} from "./routes/profile";
import * as path from "node:path";
import {createResumeRouter} from "./routes/resume";

const errorHandler = (error: Error, req: Request, res: Response) => {
  console.log(error);

  res.status(500).json({
    status: false,
    message: error.message || "Internal Server Error",
  });
};

let server: Express | null = null;

export const createServer = (): Express => {
  if (server) return server;

  server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use("/v1", createHealthRouter());
  server.use("/v1", createProjectsRouter());
  server.use("/v1", createProfileRouter());
	server.use("/v1/", createResumeRouter());

	server.use(express.static(path.join(__dirname, "../../../web/dist")));

	server.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../../../web/dist/index.html"));
	});

	server.use((req, res, next) => {
    next(new Error("Not found"));
  });

  server.use(errorHandler);

	initializeTables().catch(console.error);
	return server;
};

async function initializeTables() {
	const hasProjectsTable = await db.schema.hasTable(PROJECTS_TABLE);
	if (!hasProjectsTable) {
		await db.schema.createTable(PROJECTS_TABLE, function builder(table: Knex.TableBuilder) {
			table.increments().primary();
			table.string("title");
			table.string("description");
			table.string("tags");
			table.specificType("image", "LONGTEXT");
			table.string("code_url");
			table.string("demo_url");
		});
		console.log("Successfully created project table");
	}

	const hasProfileTable = await db.schema.hasTable(PROFILE_TABLE);
	if (!hasProfileTable) {
		await db.schema.createTable(PROFILE_TABLE, function builder(table: Knex.TableBuilder) {
			table.increments().primary();
			table.string("first_name");
			table.string("last_name");
			table.text("bio");
			table.text("background");
			table.text("education");
			table.text("interests");
			table.text("skills");
			table.string("github");
			table.string("email");
			table.string("linkedin");
			table.specificType("resume", "LONGBLOB");
			table.specificType("image", "LONGTEXT");
		});
		console.log("Successfully created profile table");
	}
}
