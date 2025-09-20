// src/components/NoteList.tsx

import { useEffect, useState } from 'react';
import type { Note } from '../types';
import { api } from '../api/client';
import NoteForm from './NoteForm';

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить заметки');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedNote: Note) => {
    if (editingNote) {
      setNotes(notes.map(n => (n.id === savedNote.id ? savedNote : n)));
    } else {
      setNotes([savedNote, ...notes]);
    }
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить заметку?')) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить заметку');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      {editingNote ? (
        <NoteForm note={editingNote} onSave={handleSave} onCancel={() => setEditingNote(null)} />
      ) : (
        <NoteForm onSave={handleSave} onCancel={() => {}} />
      )}

      <h2>Список заметок</h2>
      {notes.length === 0 ? (
        <p>Нет заметок</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map(note => (
            <li key={note.id} style={{ border: '1px solid #eee', margin: '10px 0', padding: '15px', borderRadius: '5px' }}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <small>{note.created_at}</small>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(note)} style={{ marginRight: '10px', padding: '5px 10px' }}>
                  ✏️ Редактировать
                </button>
                <button onClick={() => handleDelete(note.id)} style={{ padding: '5px 10px', background: '#f44336', color: 'white' }}>
                  🗑️ Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}