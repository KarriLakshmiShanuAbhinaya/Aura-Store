export default function Footer() {
  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 dark:bg-black dark:border-zinc-900 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Aura Store. All rights reserved.
        </p>
        <div className="mt-4 flex space-x-6 text-sm">
          <a href="#" className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
