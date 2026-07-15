import React, { useEffect, useState, useRef } from 'react';
import { User, QuizAttempt, UploadedVideo, UploadedNote } from '../../types';
import { db, collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, saveFileToDB } from '../../config/mockFirebase';
import { mockCategories } from '../../data/mockData';

interface TeacherDashboardProps {
  currentUser: User;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser }) => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'note'>('video');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Flatten all classes for the dropdown and include parent names for clarity
  const allClasses = mockCategories.flatMap(c => 
    c.topics.flatMap(t => 
      t.classes.map(cls => ({
        ...cls,
        displayName: `${c.name} - ${t.name} - ${cls.name}`
      }))
    )
  );

  const fetchData = async () => {
    try {
      // Fetch quiz attempts
      const q = query(collection(db, 'quizAttempts'), where('schoolCode', '==', currentUser.schoolCode));
      const attemptSnap = await getDocs(q);
      const fetchedAttempts: QuizAttempt[] = [];
      attemptSnap.forEach((d) => fetchedAttempts.push({ id: d.id, ...d.data() } as QuizAttempt));
      fetchedAttempts.sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
      setAttempts(fetchedAttempts);

      // Fetch uploaded videos
      const vq = query(collection(db, 'uploadedVideos'), where('schoolCode', '==', currentUser.schoolCode));
      const videoSnap = await getDocs(vq);
      const fetchedVideos: UploadedVideo[] = [];
      videoSnap.forEach((d) => fetchedVideos.push({ id: d.id, ...d.data() } as UploadedVideo));
      fetchedVideos.sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
      setUploadedVideos(fetchedVideos);

      // Fetch uploaded notes
      const nq = query(collection(db, 'uploadedNotes'), where('schoolCode', '==', currentUser.schoolCode));
      const noteSnap = await getDocs(nq);
      const fetchedNotes: UploadedNote[] = [];
      noteSnap.forEach((d) => fetchedNotes.push({ id: d.id, ...d.data() } as UploadedNote));
      fetchedNotes.sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
      setUploadedNotes(fetchedNotes);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser.schoolCode]);

  const handleDeleteVideo = async (videoId: string) => {
    if(confirm("Are you sure you want to delete this video?")) {
      await deleteDoc(doc(db, 'uploadedVideos', videoId));
      fetchData();
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if(confirm("Are you sure you want to delete this study material?")) {
      await deleteDoc(doc(db, 'uploadedNotes', noteId));
      fetchData();
    }
  };

  const handleUploadSubmit = async () => {
    if (!pendingFile || !selectedClassId) return;
    setUploadStatus('uploading');
    
    // Simulate upload delay
    setTimeout(async () => {
      const selectedClass = allClasses.find(c => c.id === selectedClassId);
      
      const collectionName = uploadType === 'video' ? 'uploadedVideos' : 'uploadedNotes';
      const docRef = await addDoc(collection(db, collectionName), {
        fileName: pendingFile.name,
        fileSize: (pendingFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        classId: selectedClass?.id,
        className: selectedClass?.name,
        schoolCode: currentUser.schoolCode,
        timestamp: serverTimestamp()
      });
      
      await saveFileToDB(docRef.id, pendingFile);
      
      setUploadStatus('success');
      fetchData(); // refresh the video library
    }, 2000);
  };



  const avgScore = attempts.length > 0 
    ? (attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions), 0) / attempts.length) * 100
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Teacher Analytics</h2>
          <p className="text-gray-500">View student quiz performance for School Code: <span className="font-bold text-brand-indigo">{currentUser.schoolCode}</span></p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setUploadType('note'); setShowUploadModal(true); }}
            className="bg-white text-brand-indigo border border-brand-indigo px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Upload Material
          </button>
          <button 
            onClick={() => { setUploadType('video'); setShowUploadModal(true); }}
            className="bg-brand-indigo text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-brand-blue transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            Upload Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="text-3xl font-bold text-brand-indigo mb-1">{attempts.length}</div>
          <div className="text-sm text-gray-500 font-medium">Total Quizzes Attempted</div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="text-3xl font-bold text-green-500 mb-1">{avgScore.toFixed(1)}%</div>
          <div className="text-sm text-gray-500 font-medium">Average Score</div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {new Set(attempts.map(a => a.studentId)).size}
          </div>
          <div className="text-sm text-gray-500 font-medium">Active Students</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Quiz Submissions</h3>
        
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading student data...</div>
        ) : attempts.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No students have taken quizzes yet for this school code.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Student Name</th>
                  <th className="px-6 py-3 font-medium">Class / Topic</th>
                  <th className="px-6 py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{attempt.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{attempt.className}</td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-indigo">
                      {attempt.score} / {attempt.totalQuestions}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(() => {
                        if (!attempt.timestamp) return 'Just now';
                        if (attempt.timestamp?.toDate) return attempt.timestamp.toDate().toLocaleDateString();
                        const d = new Date(attempt.timestamp);
                        if (!isNaN(d.getTime())) return d.toLocaleDateString();
                        return 'Just now';
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Video Library</h3>
          <span className="text-sm font-semibold text-brand-indigo bg-blue-50 px-3 py-1 rounded-full">{uploadedVideos.length} Videos</span>
        </div>
        {uploadedVideos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <p className="text-gray-500 font-medium">No videos uploaded for this school code yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Video File</th>
                  <th className="px-6 py-3 font-medium">Assigned Class</th>
                  <th className="px-6 py-3 font-medium">Size</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedVideos.map((video) => (
                  <tr key={video.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="bg-brand-indigo/10 text-brand-indigo p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      </div>
                      {video.fileName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{video.className}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{video.fileSize}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => video.id && handleDeleteVideo(video.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Video"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Study Materials Library</h3>
          <span className="text-sm font-semibold text-brand-indigo bg-blue-50 px-3 py-1 rounded-full">{uploadedNotes.length} Files</span>
        </div>
        {uploadedNotes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p className="text-gray-500 font-medium">No study materials uploaded for this school code yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Material File</th>
                  <th className="px-6 py-3 font-medium">Assigned Class</th>
                  <th className="px-6 py-3 font-medium">Size</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedNotes.map((note) => (
                  <tr key={note.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="bg-brand-indigo/10 text-brand-indigo p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      </div>
                      {note.fileName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{note.className}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{note.fileSize}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => note.id && handleDeleteNote(note.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Material"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Class {uploadType === 'video' ? 'Video' : 'Material'}</h3>
              <button onClick={() => {setShowUploadModal(false); setUploadStatus('idle'); setPendingFile(null);}} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {uploadStatus === 'idle' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assign to Class</label>
                  <select 
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white"
                  >
                    <option value="" disabled>Select a Class</option>
                    {allClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.displayName}</option>
                    ))}
                  </select>
                </div>

                {!pendingFile ? (
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-brand-indigo bg-brand-indigo/5' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        setPendingFile(e.dataTransfer.files[0]);
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept={uploadType === 'video' ? "video/*" : "application/pdf,.doc,.docx,.ppt,.pptx"}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setPendingFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="bg-blue-50 text-brand-indigo w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 pointer-events-none">
                      {uploadType === 'video' ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      )}
                    </div>
                    <p className="font-bold text-gray-700 mb-1 pointer-events-none">Click to browse or drag {uploadType === 'video' ? 'video' : 'file'} here</p>
                    <p className="text-sm text-gray-500 pointer-events-none">{uploadType === 'video' ? 'MP4, WebM or MKV (Max 500MB)' : 'PDF, DOCX, PPTX (Max 50MB)'}</p>
                  </div>
                ) : (
                  <div className="border-2 border-brand-indigo/20 bg-brand-indigo/5 rounded-2xl p-6 text-center">
                    <div className="text-brand-indigo w-12 h-12 mx-auto mb-3">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </div>
                    <p className="font-bold text-gray-900 truncate mb-1">{pendingFile.name}</p>
                    <p className="text-sm text-gray-500 mb-6">{(pendingFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setPendingFile(null)}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUploadSubmit}
                        disabled={!selectedClassId}
                        className="flex-1 bg-brand-indigo text-white py-2.5 rounded-xl font-bold hover:bg-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Upload {uploadType === 'video' ? 'Video' : 'File'}
                      </button>
                    </div>
                    {!selectedClassId && <p className="text-xs text-red-500 mt-3 text-left">Please select a class above.</p>}
                  </div>
                )}
              </>
            )}

            {uploadStatus === 'uploading' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-bold text-gray-700 mb-1">Uploading {uploadType === 'video' ? 'Video' : 'File'}...</p>
                <p className="text-sm text-gray-500">Please do not close this window</p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="py-8 text-center">
                <div className="bg-green-100 text-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <p className="font-bold text-gray-700 mb-1">Upload Complete!</p>
                <p className="text-sm text-gray-500">The video has been successfully added to the class.</p>
                <button 
                  onClick={() => {setShowUploadModal(false); setUploadStatus('idle'); setPendingFile(null); setSelectedClassId('');}}
                  className="mt-6 w-full bg-brand-indigo text-white py-3 rounded-xl font-bold hover:bg-brand-blue transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
