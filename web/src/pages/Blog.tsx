import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { PageTransitionOverlay } from '../components/PageTransition';
import Post from '@shared/types/post';
import Profile from '@shared/types/profile';

interface BlogResponse {
  success: boolean;
  posts: Post[];
}

interface ProfileResponse {
	success: boolean;
	profile: Profile;
}

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [showOverlay, setShowOverlay] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/v1/blog');
        const data = await res.json() as BlogResponse;
        setPosts(data.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
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

    Promise.all([fetchPosts(), fetchProfile()])
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
        <Navigation profile={profile} currentPage="blog" />

        <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
							<p className="text-xl mb-8">
								My thoughts and writings on technology, software development, and more.
							</p>
						</div>
					</div>
				</section>

        <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date(post.created_at).toLocaleDateString()}</p>
                    <p className="text-gray-700 dark:text-gray-300">{post.content.substring(0, 150)}...</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <Footer profile={profile} />
      </div>
    </>
  );
}
