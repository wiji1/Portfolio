import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { ProjectCard } from '../components/ProjectCard.tsx';
import { Footer } from '../components/Footer.tsx';
import { PageTransitionOverlay } from '../components/PageTransition.tsx';
import { Code, FileText, Mail } from 'lucide-react';
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

export function Home() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [profile, setProfile] = useState<Profile>();
	const [showOverlay, setShowOverlay] = useState(true);
	const [isFadingOut, setIsFadingOut] = useState(false);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const res = await fetch('/v1/projects');
				const data = await res.json() as ProjectResponse;

				const formatted: Project[] = data.projects;
				if (formatted.length > 3) formatted.splice(3, formatted.length - 3);

				setProjects(formatted);
			} catch (error) {
				console.error('Failed to fetch projects:', error);
			}
		};

		const fetchProfile = async () => {
			try {
				const res = await fetch('/v1/profile');
				const data = await res.json() as ProfileResponse;
				const formatted: Profile = data.profile;
				setProfile(formatted);
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

	return (
		<>
			{showOverlay && <PageTransitionOverlay isFadingOut={isFadingOut} />}

			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
				<Navigation profile={profile} currentPage="home" />

				{/* Hero Section */}
				<section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="md:flex md:items-center md:justify-between">
							<div className="md:w-1/2 mb-10 md:mb-0">
								<h1 className="text-4xl md:text-5xl font-bold mb-4">Hi, I'm {profile?.first_name}</h1>
								<h2 className="text-2xl md:text-3xl font-medium mb-6">Full Stack Developer</h2>
								<p className="text-lg mb-8">{profile?.bio}</p>
								<div className="flex space-x-4">
									<a href="#projects" className="px-6 py-3 bg-white text-indigo-600 rounded-md font-medium hover:bg-gray-200 hover:border-gray-200 transition-colors duration-300">View Projects</a>
									<a href="#contact" className="px-6 py-3 bg-white border-2 text-indigo-600 border-white rounded-md font-medium hover:bg-gray-200 hover:border-gray-200 hover:bg-opacity-10 transition-colors duration-300">Contact Me</a>
								</div>
							</div>
							<div className="md:w-1/2 flex justify-center">
								<div className="w-64 h-64 bg-white rounded-full overflow-hidden shadow-xl">
									<img src={`data:image/jpeg;base64,${profile?.image.toString()}`} alt="Your Portrait" className="w-full h-full object-cover"/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="py-20 bg-white dark:bg-gray-800">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">About Me</h2>
						<div className="md:flex md:items-start md:space-x-12">
							<div className="md:w-1/3 mb-8 md:mb-0">
								<div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
									<h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Background</h3>
									<p className="text-gray-700 dark:text-gray-300">{profile?.background}</p>
								</div>
							</div>
							<div className="md:w-1/3 mb-8 md:mb-0">
								<div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
									<h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Education</h3>
									<p className="text-gray-700 dark:text-gray-300">{profile?.education}</p>
								</div>
							</div>
							<div className="md:w-1/3">
								<div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
									<h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Interests</h3>
									<p className="text-gray-700 dark:text-gray-300">{profile?.interests}</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section */}
				<section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Featured Projects</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{projects.map((project: Project, index) => (
								<ProjectCard key={project.title + index} project={project} />
							))}
						</div>
						<div className="text-center mt-12">
							<a href="/projects" className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-300">
								View All Projects
							</a>
						</div>
					</div>
				</section>

				{/* Skills Section */}
				<section id="skills" className="py-20 bg-white dark:bg-gray-800">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Skills & Technologies</h2>
						<div className="flex flex-wrap justify-center gap-4">
							{profile?.skills.split(',').map((skill, index) => (
								<div key={index} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out">
									{skill}
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Contact Section */}
				<section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Get In Touch</h2>
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
							<div className="flex flex-col md:flex-row md:space-x-8">
								<div className="md:w-1/2 mb-8 md:mb-0">
									<h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
									<div className="space-y-4">
										<div className="flex items-center">
											<Mail size={20} className="text-indigo-600 dark:text-indigo-400 mr-3"/>
											<span className="text-gray-800 dark:text-gray-200">{profile?.email}</span>
										</div>
										<div className="flex items-center">
											<Code size={20} className="text-indigo-600 dark:text-indigo-400 mr-3"/>
											<a href={profile?.github} className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">GitHub</a>
										</div>
										<div className="flex items-center">
											<FileText size={20} className="text-indigo-600 dark:text-indigo-400 mr-3"/>
											<a href={profile?.linkedin} className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">LinkedIn</a>
										</div>
										<div className="flex items-center">
											<FileText size={20} className="text-indigo-600 dark:text-indigo-400 mr-3"/>
											<a href="#" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Download Resume</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<Footer profile={profile} />
			</div>
		</>
	);
}
