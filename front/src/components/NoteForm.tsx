// src/components/NoteForm.tsx

import { useState, useEffect } from 'react'; // ← добавили useEffect
import type { Note } from '../types';
import { api } from '../api/client';

interface NoteFormProps {
  note?: Note | null;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export default function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);                   // title — обязательный, OK
      setContent(note.content ?? '');         // ← защита от undefined
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      let savedNote: Note;
      if (note) {
        const res = await api.put(`/notes/${note.id}`, { title, content });
        savedNote = res.data;
      } else {
        const res = await api.post('/notes', { title, content });
        savedNote = res.data;
      }
      onSave(savedNote);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить заметку');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#2d2d2d',
      border: '1px solid #444',
      color: 'white'
    }}>
      <h3 style={{ margin: 0 }}>{note ? 'Редактировать заметку' : 'Новая заметка'}</h3>
      
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ 
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #555',
          backgroundColor: '#3a3a3a',
          color: 'white'
        }}
      />
      
      <textarea
        placeholder="Содержание"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        style={{ 
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #555',
          backgroundColor: '#3a3a3a',
          color: 'white',
          resize: 'vertical'
        }}
      />
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #666',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Отмена
        </button>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            background: '#4caf50',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}