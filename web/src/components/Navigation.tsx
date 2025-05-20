import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Profile from "@shared/types/profile";
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
	profile?: Profile;
	currentPage?: 'home' | 'projects';
}

export function Navigation({ profile, currentPage = 'home' }: NavigationProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navLinks = currentPage === 'home'
		? [
			{ href: "#about", text: "About" },
			{ href: "#projects", text: "Projects" },
			{ href: "#skills", text: "Skills" },
			{ href: "#contact", text: "Contact" }
		]
		: [
			{ href: "/", text: "Home" },
			{ href: "/projects", text: "Projects" },
		];

	return (
		<nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {profile?.first_name + " " + profile?.last_name}
            </span>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-6">
						{navLinks.map((link, index) => (
							<a
								key={index}
								href={link.href}
								className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
							>
								{link.text}
							</a>
						))}
						<a
							href="#"
							className="px-4 py-2 rounded-md bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-300"
						>
							Resume
						</a>
						<ThemeToggle />
					</div>

					{/* Mobile menu button and theme toggle */}
					<div className="md:hidden flex items-center space-x-2">
						<ThemeToggle />
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
						>
							{isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden bg-white dark:bg-gray-900 pb-4 px-4 border-t border-gray-200 dark:border-gray-700">
					<div className="flex flex-col space-y-2">
						{navLinks.map((link, index) => (
							<a
								key={index}
								href={link.href}
								onClick={() => setIsMenuOpen(false)}
								className="px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
							>
								{link.text}
							</a>
						))}
						<a
							href="#"
							onClick={() => setIsMenuOpen(false)}
							className="px-3 py-2 rounded bg-indigo-600 dark:bg-indigo-500 text-white text-center hover:bg-indigo-700 dark:hover:bg-indigo-600"
						>
							Resume
						</a>
					</div>
				</div>
			)}
		</nav>
	);
}
