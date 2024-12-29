import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <span>TODO App with Drag & Drop functionality</span>
        <div>
          <span>Features :</span>
          <ol className="list-inside list-decimal text-sm text-left space-y-2">
            <li>Responsive Ui (dekstop-mobile)</li>
            <li>Todo types : todo, progress, completed.</li>
            <li>Create new TODO</li>
            <li>Delete TODO with drag & drop</li>
            <li>Rearrange (Drag & Drop) TODO in same or different type</li>
          </ol>
        </div>

        <span>Tech-Stack: typescript, ReactJs, NextJs, tailwind, motion</span>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/dnd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl">🎉</span> Check Now
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://indrax.my.id"
          target="_blank"
        >
          🌈 made by indra
        </Link>
      </footer>
    </div>
  );
}
