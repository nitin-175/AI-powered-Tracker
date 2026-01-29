// src/pages/ResumeManager.jsx
export default function ResumeManager() {
  const [resumes, setResumes] = useState([
    { id: 1, name: 'Nitin_Java_Fullstack.pdf', created: '2026-01-28', jobsApplied: 12 },
    { id: 2, name: 'Nitin_SpringBoot_Resume.pdf', created: '2026-01-25', jobsApplied: 8 }
  ]);
  const [selectedResume, setSelectedResume] = useState(null);

  const deleteResume = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Manager</h1>
          <p className="text-gray-600">Manage multiple resume versions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload New Resume</h3>
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc"
                className="w-full px-4 py-10 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-3">
                <label className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-200">
                  <input type="radio" className="hidden" name="role" value="backend" />
                  Backend Focused
                </label>
                <label className="flex items-center px-4 py-2 bg-amber-100 text-amber-800 text-sm font-medium rounded-lg cursor-pointer hover:bg-amber-200">
                  <input type="radio" className="hidden" name="role" value="fullstack" />
                  Fullstack
                </label>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800">
                Upload Resume
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">My Resumes</h3>
            <div className="space-y-4">
              {resumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">PDF</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">{resume.name}</p>
                      <p className="text-sm text-gray-500">
                        Created {resume.created} • {resume.jobsApplied} jobs applied
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setSelectedResume(resume.id)}
                      className="px-3 py-1 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-md"
                    >
                      Use
                    </button>
                    <button 
                      onClick={() => deleteResume(resume.id)}
                      className="px-3 py-1 text-gray-500 text-sm font-medium hover:bg-gray-100 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
