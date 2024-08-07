import NoteView from "./NoteView";


function NoteList({ notes }) {

    const rerenderedNotes = notes.map((note) => {
        return <NoteView key={note.id} note={note.content} />;
    })

    return <div>{rerenderedNotes}</div>;
}

export default NoteList;