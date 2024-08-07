import axios from 'axios';

const fetchNotes = async () => {
    const resp = await axios.get("http://localhost:8000/notes");
        
    return resp;
}

export default fetchNotes;