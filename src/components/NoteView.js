function NoteView({note}){


    return (
    <div className="book-show">
        <div>Note ID: {note.id}</div>
        <div>Text: {note.content}</div>
        
    </div>);
}

export default NoteView;