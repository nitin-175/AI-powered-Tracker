import React, { useState } from 'react';

const ResumeBuilder = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [masterResume, setMasterResume] = useState('');
    const [tailoredResume, setTailoredResume] = useState('');
    const [loading, setLoading] = useState(false);

    const generateResume = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/resume/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle, masterResume })
            });
            const data = await response.json();
            setTailoredResume(data.resume);
        } catch {
            alert('Error generating resume');
        }
        setLoading(false);
    };

    const downloadResume = (content) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tailored-resume.txt';
        a.click();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">AI Resume Builder</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                    placeholder="Job Title (e.g., Backend Developer)"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="p-3 border rounded-lg"
                />
                <textarea
                    placeholder="Paste your master resume..."
                    value={masterResume}
                    onChange={(e) => setMasterResume(e.target.value)}
                    rows="8"
                    className="p-3 border rounded-lg"
                />
            </div>

            <button
                onClick={generateResume}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 mb-6"
            >
                {loading ? 'Generating...' : 'Generate Tailored Resume'}
            </button>

            {tailoredResume && (
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-4">Tailored Resume:</h3>
                    <pre className="whitespace-pre-wrap text-sm">{tailoredResume}</pre>
                    <button
                        onClick={() => downloadResume(tailoredResume)}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
                    >
                        Download PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeBuilder;
