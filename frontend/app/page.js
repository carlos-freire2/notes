'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/notes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Add new note
  const addNote = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Make sure the backend is running on port 8080.');
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`http://localhost:8080/notes/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete note');
        }

        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>FSAB Notes</h1>
        <p className={styles.subtitle}>Simple note-taking app</p>
      </header>

      <main className={styles.main}>
        {/* Add Note Form */}
        <form onSubmit={addNote} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="content" className={styles.label}>
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content..."
              className={styles.textarea}
              rows="4"
            />
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Add Note
          </button>
        </form>

        {/* Notes List */}
        <div className={styles.notesSection}>
          <h2 className={styles.sectionTitle}>Your Notes ({notes.length})</h2>
          
          {loading ? (
            <div className={styles.loading}>
              <p>Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className={styles.empty}>
              <p>No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className={styles.notesList}>
              {notes.map(note => (
                <div key={note.id} className={styles.note}>
                  <div className={styles.noteContent}>
                    <h3 className={styles.noteTitle}>{note.title}</h3>
                    {note.content && (
                      <p className={styles.noteText}>{note.content}</p>
                    )}
                    <p className={styles.noteDate}>
                      Created {formatDate(note.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}