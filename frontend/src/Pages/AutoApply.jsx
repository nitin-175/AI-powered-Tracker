import { useState } from 'react';

const AutoApply = ({ selectedJob = {} }) => {
    const [email, setEmail] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState('');

    // 🔥 AUTO-FILL job data display
    const jobTitle = selectedJob?.role || selectedJob?.title || 'Not selected';
    const company = selectedJob?.company || 'Not selected';

    const sendApplication = async () => {
        if (!email || (!coverLetter.trim() && !resumeFile)) {
            alert('Please fill email and either cover letter OR resume file');
            return;
        }

        setSending(true);
        setStatus('');

        // 🔥 Create FormData for file upload
        const formData = new FormData();
        formData.append('email', email.trim());
        formData.append('jobTitle', jobTitle);
        formData.append('company', company);
        formData.append('coverLetter', coverLetter.trim());
        if (resumeFile) {
            formData.append('resumeFile', resumeFile);
        }

        try {
            const response = await fetch('http://localhost:8080/api/email/cover-letter', {
                method: 'POST',
                body: formData, // 🔥 No Content-Type header for FormData
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.text();
            setStatus('✅ Application sent successfully!');
            alert(result || 'Application sent!');
            
        } catch (error) {
            console.error('Send error:', error);
            setStatus(`❌ Error: ${error.message}`);
            alert(`Error: ${error.message}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mx-auto max-w-md mt-18 ml-70">
            <h3 className="text-xl font-bold mb-4">Auto-Apply</h3>
            
            {/* 🔥 JOB INFO DISPLAY */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-700">
                    <strong>Job:</strong> {jobTitle} <br/>
                    <strong>Company:</strong> {company}
                </div>
            </div>

            <input
                placeholder="Recruiter Email (required)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-green-500"
                disabled={sending}
            />

            {/* 🔥 RESUME FILE UPLOAD */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume File (PDF/DOCX - optional)
                </label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
                    disabled={sending}
                />
                {resumeFile && (
                    <div className="text-xs text-green-600 mt-1">
                        ✅ {resumeFile.name} selected
                    </div>
                )}
            </div>

            <textarea
                placeholder="Cover letter text (optional if resume uploaded)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="4"
                className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-green-500"
                disabled={sending}
            />

            <button
                onClick={sendApplication}
                disabled={sending || !email}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
                {sending ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Sending...
                    </span>
                ) : (
                    `Send Application (${resumeFile ? 'w/ Resume' : 'Text Only'})`
                )}
            </button>

            {status && (
                <div className={`mt-3 p-3 rounded text-sm ${status.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {status}
                </div>
            )}
        </div>
    );
};

export default AutoApply;
