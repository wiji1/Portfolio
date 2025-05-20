import { Code, ExternalLink } from 'lucide-react';
import Project from "@shared/types/project";

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-gray-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5">
			<img
				src={`data:image/jpeg;base64,${project.image.toString()}`}
				alt={project.title}
				className="w-full h-48 object-cover"
			/>
			<div className="p-6">
				<h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
				<p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
				<div className="flex flex-wrap gap-2 mb-4">
					{project.tags.split(",").map((tag) => tag.trim()).map((tag, tagIndex) => (
						<span
							key={tagIndex}
							className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium rounded-full"
						>
              {tag}
            </span>
					))}
				</div>
				<div className="flex space-x-3">
					{project.code_url && (
						<a
							href={project.code_url}
							className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300"
						>
							<Code size={18} className="mr-1"/> Code
						</a>
					)}
					{project.demo_url && (
						<a
							href={project.demo_url}
							className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300"
						>
							<ExternalLink size={18} className="mr-1"/> Demo
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
