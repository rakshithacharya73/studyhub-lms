import React, { useEffect, useState } from 'react';
import { ClassData, UploadedVideo, UploadedNote, User } from '../../types';
import { IconArrowLeft } from '../icons';
import { db, collection, query, where, getDocs, getFileFromDB } from '../../config/mockFirebase';

interface VideoViewProps {
  classInfo: ClassData;
  currentUser: User;
  onBack: () => void;
  onProceedToQuiz: () => void;
}

export const VideoView: React.FC<VideoViewProps> = ({ classInfo, currentUser, onBack, onProceedToQuiz }) => {
  const [video, setVideo] = useState<UploadedVideo | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<UploadedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const q = query(
          collection(db, 'uploadedVideos'), 
          where('classId', '==', classInfo.id),
          where('schoolCode', '==', currentUser.schoolCode)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          // Assume one video per class for now
          const videoData = { id: snap.docs[0].id, ...snap.docs[0].data() } as UploadedVideo;
          setVideo(videoData);
          
          if (videoData.id) {
            const blob = await getFileFromDB(videoData.id);
            if (blob) {
              setVideoUrl(URL.createObjectURL(blob));
            }
          }
        } else {
          setVideo(null);
          setVideoUrl(null);
        }

        const nq = query(
          collection(db, 'uploadedNotes'), 
          where('classId', '==', classInfo.id),
          where('schoolCode', '==', currentUser.schoolCode)
        );
        const noteSnap = await getDocs(nq);
        const fetchedNotes: UploadedNote[] = [];
        noteSnap.forEach((d: any) => fetchedNotes.push({ id: d.id, ...d.data() } as UploadedNote));
        setNotes(fetchedNotes);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [classInfo.id]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6 hover:bg-gray-50 transition-colors"
      >
        <IconArrowLeft className="text-gray-700" />
        Back to Classes
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
          {!isPlaying && <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo/40 to-blue-500/20"></div>}
          
          {loading ? (
             <div className="text-white text-center z-10 flex flex-col items-center">
               <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="font-medium text-gray-300">Loading lesson...</p>
             </div>
          ) : video ? (
             isPlaying ? (
               <video 
                 controls 
                 autoPlay 
                 className="absolute inset-0 w-full h-full object-cover z-20 bg-black"
                 src={videoUrl || "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"}
               >
                 Your browser does not support the video tag.
               </video>
             ) : (
               <div className="text-white text-center z-10 w-full px-12">
                 <svg onClick={() => setIsPlaying(true)} className="w-20 h-20 mx-auto mb-4 opacity-90 hover:opacity-100 hover:scale-105 cursor-pointer transition-all duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                 </svg>
                 <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{video.fileName}</h3>
                 <p className="text-gray-300 font-medium bg-black/40 inline-block px-4 py-1.5 rounded-full backdrop-blur-md">Uploaded by Teacher</p>
               </div>
             )
          ) : (
             <div className="text-white text-center z-10">
               <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                 <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
               </div>
               <h3 className="text-xl font-bold text-gray-200 mb-1">No Video Available</h3>
               <p className="text-gray-400 font-medium">Your teacher hasn't uploaded a video for this class yet.</p>
             </div>
          )}
        </div>
        <div className="p-8">
          <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{classInfo.name} Video Lesson</h2>
              <p className="text-gray-500">{classInfo.description}</p>
            </div>
          </div>
          
          {notes.length > 0 && (
            <div className="mb-8 p-6 bg-brand-indigo/5 rounded-2xl border border-brand-indigo/10">
              <h3 className="text-xl font-bold text-brand-indigo mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                Attached Study Materials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.map(note => (
                  <div key={note.id} className="border border-brand-indigo/20 rounded-xl p-4 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-blue-50 text-brand-indigo p-2.5 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-gray-900 truncate">{note.fileName}</p>
                        <p className="text-xs text-gray-500">{note.fileSize}</p>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        if (note.id) {
                           const blob = await getFileFromDB(note.id);
                           if (blob) {
                             const url = URL.createObjectURL(blob);
                             const a = document.createElement('a');
                             a.href = url;
                             a.download = note.fileName;
                             document.body.appendChild(a);
                             a.click();
                             document.body.removeChild(a);
                             URL.revokeObjectURL(url);
                           }
                        }
                      }}
                      className="text-brand-indigo bg-blue-50 p-2 rounded-lg hover:bg-brand-indigo hover:text-white transition-colors flex-shrink-0"
                      title="Download Material"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-6">
            <button 
              onClick={onProceedToQuiz}
              disabled={!video}
              className={`px-8 py-3 rounded-xl font-bold shadow-sm transition-all duration-300 flex items-center gap-2 text-lg group ${video ? 'bg-brand-indigo text-white hover:bg-brand-blue' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {video ? 'Take Quiz' : 'Quiz Locked'}
              {video && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
            </button>
          </div>
          {!video && <p className="text-sm text-red-500 text-right mt-3 font-medium">You must watch the teacher's video before taking the quiz.</p>}
        </div>
      </div>
    </div>
  );
};
