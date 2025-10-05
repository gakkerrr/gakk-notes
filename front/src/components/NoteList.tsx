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
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '20px',
      width: 'calc(95vw)',
      height: 'calc(45vw)',
      backgroundColor: '#1e1e1e',
      color: 'white',
      boxSizing: 'border-box',
      margin: 0, // Добавляем обнуление margin
    }}>
      {/* Левая панель — форма */}
      <div style={{
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#2d2d2d',
        height: '100%',
        width: '100%',
        overflow: 'auto',
        boxSizing: 'border-box'
      }}>
        <NoteForm
          note={editingNote || undefined}
          onSave={handleSave}
          onCancel={() => setEditingNote(null)}
        />
      </div>

      {/* Правая панель — список заметок */}
      <div style={{
        height: '100%',
        width: '100%',
        borderRadius: '8px',
        padding: '0px 20px 0px 0px',
        overflow: 'auto',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ margin: '16px 0 16px 0', borderRadius: '8px' }}>Список заметок</h2>
        {notes.length === 0 ? (
          <p>Нет заметок</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            padding: '0',
            borderRadius: '8px',
            height: 'calc(100% - 40px)', 
            overflow: 'auto',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {notes.map(note => (
              <div
                key={note.id}
                style={{
                  border: '1px solid #444',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#2d2d2d',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onClick={() => handleEdit(note)}
              >
                <h4 style={{ margin: '0 0 8px 0' }}>{note.title}</h4>
                <p style={{
                  fontSize: '0.9em',
                  color: '#ccc',
                  maxHeight: '60px',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {note.content}
                </p>
                <small style={{
                  display: 'block',
                  marginTop: '10px',
                  fontSize: '0.75em',
                  color: '#999'
                }}>
                  {note.created_at
                    ? new Date(note.created_at).toLocaleString('ru-RU')
                    : 'Дата не указана'}
                </small>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '10px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#4caf50',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      fontSize: '0.85em'
                    }}
                  >
                    ✏️ Редактировать
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      fontSize: '0.85em'
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}