// src/pages/AutoApply.jsx
export default function AutoApply() {
  const [formData, setFormData] = useState({
    keywords: '',
    locations: '',
    resume: '',
    coverLetter: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Auto apply started:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auto Apply</h1>
          <p className="text-gray-600 mb-8">Automatically apply to matching jobs</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Keywords
              </label>
              <input
                type="text"
                placeholder="Java, Spring Boot, React, Full Stack"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locations
              </label>
              <input
                type="text"
                placeholder="Bangalore, Hyderabad, Remote"
                value={formData.locations}
                onChange={(e) => setFormData({...formData, locations: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume File
              </label>
              <input
                type="file"
                accept=".pdf,.doc"
                onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="coverLetter"
                checked={formData.coverLetter}
                onChange={(e) => setFormData({...formData, coverLetter: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="coverLetter" className="ml-2 block text-sm text-gray-700">
                Generate personalized cover letters
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
            >
              Start Auto Apply
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span>TCS - Software Engineer</span>
              <span className="text-sm text-green-600 font-medium">Applied</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span>Google - SDE</span>
              <span className="text-sm text-blue-600 font-medium">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
