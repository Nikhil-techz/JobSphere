function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-indigo-50/40 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-indigo-600 sm:text-sm">
          Your career starts here
        </p>

        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Find your next opportunity
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-6 sm:text-lg sm:leading-8">
          Discover jobs that match your skills, experience, and career goals.
        </p>
      </div>
    </section>
  );
}

export default Hero;
