

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-500">
        This page is under development 🚧
      </p>
    </div>
  );
};

export default ComingSoon;
