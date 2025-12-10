
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, Note } from '../types';
import { NoteIcon, TrashIcon } from './icons/SidebarIcons';

interface NotesProps {
  user: User;
}

const Notes: React.FC<NotesProps> = ({ user }) => {
  const noteKey = `focusup-notes_${user.id}`;
  const [notes, setNotes] = useLocalStorage<Note[]>(noteKey, []);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSaveNote = () => {
    if (newNoteContent.trim() === '') return;

    const newNote: Note = {
      id: new Date().toISOString(),
      content: newNoteContent,
      createdAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    
    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <div className="animate-fade-in relative">
      {showToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-dark dark:bg-white text-white dark:text-dark-bg px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
              ✅ Catatan berhasil disimpan!
          </div>
      )}

      <div className="flex items-center mb-8">
        <NoteIcon className="w-8 h-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-dark dark:text-dark-text">Catatan Tugas</h1>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
        <p className="text-muted dark:text-dark-muted mb-4">Gunakan area ini untuk mencatat tugas, ide, atau pengingat penting.</p>
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Tulis catatan barumu di sini..."
          className="w-full h-40 p-4 border rounded-md bg-light dark:bg-dark-bg border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary resize-y text-dark dark:text-dark-text"
          aria-label="New Task Note"
        />
        <div className="flex justify-end mt-4">
            <button 
              onClick={handleSaveNote}
              className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              disabled={!newNoteContent.trim()}
            >
              Simpan Catatan
            </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-dark dark:text-dark-text mb-4">Catatan Tersimpan</h2>
        {notes.length > 0 ? (
            <div className="space-y-4">
                {notes.map(note => (
                    <div key={note.id} className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md relative group">
                        {/* Fix for T5: break-words to handle long strings without spaces */}
                        <p className="text-dark dark:text-dark-text whitespace-pre-wrap break-words">{note.content}</p>
                        <p className="text-xs text-muted dark:text-dark-muted mt-4 pt-2 border-t dark:border-gray-700">
                           {new Date(note.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button 
                          onClick={() => handleDeleteNote(note.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-light dark:bg-dark-bg text-muted hover:bg-danger hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Hapus catatan"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-white dark:bg-dark-card rounded-lg shadow-md">
                 <p className="text-muted dark:text-dark-muted">Anda belum memiliki catatan. Tambahkan catatan pertama Anda di atas!</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default Notes;
