export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 px-6">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="text-[12.5px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            sillysillyman.kim
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-600">
            Next.js · Notion API · Vercel
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:contact@sillysillyman.kim"
            className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            Email
          </a>
          <a
            href="/feed.xml"
            className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
