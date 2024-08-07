import {useState} from "react";
import NoteView from "./components/NoteView";
import NoteList from "./components/NoteList";
import fetchNotes from "./api";


function App() {
  const [notes, setNotes] = useState([]);

  const handleClick = async () => {
    const result = await fetchNotes();
    console.log(result);
    
    setNotes(result["data"]);
    
  }


  return (
    <div className="App">
        <h3>List of notes</h3>
        <button className="button" onClick={handleClick}>Get notes</button>
        <NoteList />
    </div>
  );
}

export default App;
