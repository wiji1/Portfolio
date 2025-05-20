interface PageTransitionOverlayProps {
	isFadingOut: boolean;
}

export function PageTransitionOverlay({ isFadingOut }: PageTransitionOverlayProps) {
	return (
		<div
			className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-opacity duration-700 ease-out ${
				isFadingOut ? 'opacity-0' : 'opacity-100'
			}`}
		>
			{/* You could add a logo or simple message here if desired */}
		</div>
	);
}
