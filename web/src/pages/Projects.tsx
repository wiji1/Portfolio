import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { ProjectCard } from '../components/ProjectCard.tsx';
import { Footer } from '../components/Footer.tsx';
import { PageTransitionOverlay } from '../components/PageTransition.tsx';
import Project from "@shared/types/project";
import Profile from "@shared/types/profile";

interface ProjectResponse {
	success: boolean;
	projects: Project[];
}

interface ProfileResponse {
	success: boolean;
	profile: Profile;
}

export function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [profile, setProfile] = useState<Profile>();
	const [showOverlay, setShowOverlay] = useState(true);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTag, setSelectedTag] = useState('');
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

	const projectsPerPage = 6;

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const res = await fetch('/v1/projects');
				const data = await res.json() as ProjectResponse;
				setProjects(data.projects);
				setFilteredProjects(data.projects);
			} catch (error) {
				console.error('Failed to fetch projects:', error);
			}
		};

		const fetchProfile = async () => {
			try {
				const res = await fetch('/v1/profile');
				const data = await res.json() as ProfileResponse;
				setProfile(data.profile);
			} catch (error) {
				console.error('Failed to fetch profile:', error);
			}
		};

		Promise.all([fetchProjects(), fetchProfile()])
			.finally(() => {
				const minimumLoadTime = 50;
				const fadeOutDuration = 700;
				const startTime = Date.now();
				const timeToWait = Math.max(0, minimumLoadTime - (Date.now() - startTime));

				setTimeout(() => {
					setIsFadingOut(true);
					setTimeout(() => {
						setShowOverlay(false);
					}, fadeOutDuration);
				}, timeToWait);
			});
	}, []);

	// Filter projects based on search term and selected tag
	useEffect(() => {
		let filtered = projects;

		if (searchTerm) {
			filtered = filtered.filter(project =>
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (selectedTag) {
			filtered = filtered.filter(project =>
				project.tags.toLowerCase().includes(selectedTag.toLowerCase())
			);
		}

		setFilteredProjects(filtered);
		setCurrentPage(1); // Reset to first page when filtering
	}, [projects, searchTerm, selectedTag]);

	// Get unique tags from all projects
	const getAllTags = () => {
		const allTags = projects.flatMap(project =>
			project.tags.split(',').map(tag => tag.trim())
		);
		return [...new Set(allTags)].sort();
	};

	// Pagination logic
	const indexOfLastProject = currentPage * projectsPerPage;
	const indexOfFirstProject = indexOfLastProject - projectsPerPage;
	const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
	const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<>
			{showOverlay && <PageTransitionOverlay isFadingOut={isFadingOut} />}

			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
				<Navigation profile={profile} currentPage="projects" />

				{/* Hero Section */}
				<section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
							<p className="text-xl mb-8">
								A collection of my work showcasing various technologies and skills
							</p>
						</div>
					</div>
				</section>

				{/* Search and Filter Section */}
				<section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
							<div className="flex-1 max-w-lg">
								<input
									type="text"
									placeholder="Search projects..."
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<select
									className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
									value={selectedTag}
									onChange={(e) => setSelectedTag(e.target.value)}
								>
									<option value="">All Technologies</option>
									{getAllTags().map((tag, index) => (
										<option key={index} value={tag}>{tag}</option>
									))}
								</select>
								<button
									onClick={() => {
										setSearchTerm('');
										setSelectedTag('');
									}}
									className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
								>
									Clear
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Grid */}
				<section className="py-16 flex-grow bg-gray-50 dark:bg-gray-900">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-96">
						{filteredProjects.length === 0 ? (
							<div className="flex items-center justify-center min-h-96">
								<div className="text-center">
									<div className="mb-8">
										<svg
											className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
									<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No projects found</h3>
									<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
										No projects match your current search criteria.
									</p>
									<button
										onClick={() => {
											setSearchTerm('');
											setSelectedTag('');
										}}
										className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-300"
									>
										Clear filters and view all projects
									</button>
								</div>
							</div>
						) : (
							<>
								<div className="mb-8">
									<p className="text-gray-600 dark:text-gray-400">
										Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, filteredProjects.length)} of {filteredProjects.length} projects
									</p>
								</div>

								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
									{currentProjects.map((project, index) => (
										<ProjectCard key={project.title + index} project={project} />
									))}
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="flex justify-center mt-12">
										<nav className="flex space-x-2">
											<button
												onClick={() => paginate(currentPage - 1)}
												disabled={currentPage === 1}
												className={`px-3 py-2 rounded-md transition-colors duration-300 ${
													currentPage === 1
														? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
														: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
												}`}
											>
												Previous
											</button>

											{[...Array(totalPages)].map((_, index) => (
												<button
													key={index + 1}
													onClick={() => paginate(index + 1)}
													className={`px-3 py-2 rounded-md transition-colors duration-300 ${
														currentPage === index + 1
															? 'bg-indigo-600 dark:bg-indigo-500 text-white'
															: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
													}`}
												>
													{index + 1}
												</button>
											))}

											<button
												onClick={() => paginate(currentPage + 1)}
												disabled={currentPage === totalPages}
												className={`px-3 py-2 rounded-md transition-colors duration-300 ${
													currentPage === totalPages
														? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
														: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
												}`}
											>
												Next
											</button>
										</nav>
									</div>
								)}
							</>
						)}
					</div>
				</section>

				<Footer profile={profile} />
			</div>
		</>
	);
}
