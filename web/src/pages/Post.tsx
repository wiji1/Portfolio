import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'github-markdown-css/github-markdown-light.css';
import 'github-markdown-css/github-markdown-dark.css';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { PageTransitionOverlay } from '../components/PageTransition';
import Post from '@shared/types/post';
import Profile from '@shared/types/profile';
import { useTheme } from '../contexts/ThemeContext';

interface PostResponse {
  status: boolean;
  post: Post;
}

interface ProfileResponse {
	status: boolean;
	profile: Profile;
}

export function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [profile, setProfile] = useState<Profile>();
  const [showOverlay, setShowOverlay] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/v1/blog/${id}`);
        const data = await res.json() as PostResponse;
        setPost(data.post);
      } catch (error) {
        console.error('Failed to fetch post:', error);
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

    Promise.all([fetchPost(), fetchProfile()])
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
  }, [id]);

  return (
    <>
      {showOverlay && <PageTransitionOverlay isFadingOut={isFadingOut} />}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
        <Navigation profile={profile} currentPage="blog" />

        <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {post ? (
            <article className={`markdown-body ${theme === 'dark' ? 'markdown-dark' : 'markdown-light'}`}>
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{new Date(post.created_at).toLocaleDateString()}</p>
              <div
                style={{ maxWidth: '100%' }}
                dangerouslySetInnerHTML={{ __html: post.post }}
              />
            </article>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Loading post...</h2>
            </div>
          )}
        </main>

        <Footer profile={profile} />
      </div>
    </>
  );
}

