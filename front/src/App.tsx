// src/App.tsx

import NoteList from './components/NoteList';
import './App.css';

function App() {
  return (
    <div className="App" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>📝 Мои заметки</h1>
      <NoteList />
    </div>
  );
}

export default App;