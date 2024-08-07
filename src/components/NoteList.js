import NoteView from "./NoteView";


function NoteList({ notes }) {

    const rerenderedNotes = notes.map((note) => {
        return <NoteView key={note.id} note={note}/>;
    })

    return <div className="book-list">{rerenderedNotes}</div>;
}

export default NoteList;