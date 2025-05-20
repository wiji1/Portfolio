import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
	const { isDark, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			{isDark ? (
				<Sun
					size={20}
					className="text-yellow-500 animate-pulse hover:animate-spin transition-transform duration-300"
				/>
			) : (
				<Moon
					size={20}
					className="text-gray-700 hover:text-purple-600 transition-colors duration-300"
				/>
			)}
		</button>
	);
}
