import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { ProjectsPage } from "./pages/Projects.tsx";
import "./styles/index.css";
import {ThemeProvider} from "./contexts/ThemeContext.tsx";
import {BlogPage} from "./pages/Blog.tsx";
import {PostPage} from "./pages/Post.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<ThemeProvider>
		<React.StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/projects" element={<ProjectsPage />} />
					<Route path="/blog" element={<BlogPage />} />
					<Route path="/blog/:id" element={<PostPage />} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	</ThemeProvider>
);