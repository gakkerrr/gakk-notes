// src/components/NoteForm.tsx

import { useState } from 'react';
import type { Note } from '../types';
import { api } from '../api/client';

interface NoteFormProps {
  note?: Note;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export default function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      let savedNote: Note;
      if (note) {
        // Update
        const res = await api.put(`/notes/${note.id}`, { title, content });
        savedNote = res.data;
      } else {
        // Create
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
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>{note ? 'Редактировать заметку' : 'Новая заметка'}</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <textarea
          placeholder="Содержание"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div>
        <button type="submit" style={{ marginRight: '10px', padding: '8px 16px' }}>
          Сохранить
            </button>
            <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>
          Отмена
        </button>
      </div>
    </form>
  );
}