

function ComingSoon({ title }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 mt-40">
  <div className="relative">
    
    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 blur opacity-30"></div>

    <div className="relative flex flex-col items-center text-center backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl px-12 py-14 max-w-md">
      
      <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-4xl mb-6 shadow-lg">
        🚧
      </div>

      <h1 className="text-3xl font-semibold text-gray-800 mb-3 tracking-tight">
        {title}
      </h1>

      <p className="text-gray-500 leading-relaxed mb-8">
        This feature is currently being crafted with care.<br />
        We’ll launch it very soon.
      </p>

      <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-5 py-2 rounded-full">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        Coming Soon
      </div>

    </div>
  </div>
</div>

  );
};

export default ComingSoon;
