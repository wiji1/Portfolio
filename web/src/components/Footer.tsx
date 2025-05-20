import { Code, FileText, Mail } from 'lucide-react';
import Profile from "@shared/types/profile";

interface FooterProps {
	profile?: Profile;
}

export function Footer({ profile }: FooterProps) {
	return (
		<footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 border-t border-gray-700 dark:border-gray-800">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="md:flex md:justify-between md:items-center">
					<div className="text-center md:text-left mb-4 md:mb-0">
						<div className="text-xl font-bold text-indigo-400 dark:text-indigo-300">
							{profile?.first_name + " " + profile?.last_name}
						</div>
						<p className="mt-2 text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
					</div>
					<div className="flex justify-center md:justify-end space-x-6">
						<a href={profile?.github} className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">
							<Code size={24}/>
						</a>
						<a href={profile?.linkedin} className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">
							<FileText size={24}/>
						</a>
						<a href={`mailto:${profile?.email}`} className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-300">
							<Mail size={24}/>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
