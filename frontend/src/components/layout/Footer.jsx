function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            JobSphere
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Find jobs. Hire talent.
          </p>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2026 JobSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
