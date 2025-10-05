// src/App.tsx

import NoteList from './components/NoteList';
import './App.css';

function App() {
  return (
    <div className="App" style={{ margin: '0px 10px', padding: '0px'}}>
      <h1 style={{textAlign:'left'}}>Мои заметки</h1>
      <NoteList />
    </div>
  );
}

export default App;