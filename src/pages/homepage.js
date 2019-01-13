import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            newNote: false,
            newText: '',
            newTitle: ''
        }
    }

    componentWillMount = () => {
        this.getNotesFromDB();
    }

    getNotesFromDB = async () => {
        let req = {
            username: this.props.username,
            // username: 'arjun'
        }
        let response = await axios.post('http://127.0.0.1:5000/getNotes', req);
        this.setState({ notes: response.data })
        // console.log(response.data)
    }

    saveNoteToDB = async (text, title) => {
        let req = {
            username: this.props.username,
            // username: 'arjun',
            text: text,
            title: title
        }
        let response = await axios.post('http://127.0.0.1:5000/saveNote', req);
        // console.log(response.data)
        if (response.data.code === 0) {
            this.getNotesFromDB();
        }

    }

    updateNoteInDB = async (oldNote, text, title) => {
        let req = {
            username: this.props.username,
            // username: 'arjun',
            text: text,
            title: title,
            oldNote: oldNote
        }
        let response = await axios.post('http://127.0.0.1:5000/updateNote', req);
        // console.log(response.data)
        if (response.data.code === 0) {
            this.getNotesFromDB();
        }

    }

    removeNote = async (note) => {
        let req = {
            username: this.props.username,
            // username: 'arjun',
            note: note
        }
        let response = await axios.post('http://127.0.0.1:5000/removeNote', req);
        // console.log(response.data)
        if (response.data.code === 0) {
            this.getNotesFromDB();
        }
    }

    addNote = (newTitle, newText) => {
        this.saveNoteToDB(newText, newTitle);
        this.setState({ newNote: false });
    }

    updateNote = (oldNote, newTitle, newText) => {
        this.updateNoteInDB(oldNote, newText, newTitle);
        this.setState({ newNote: false });
    }

    render() {

        return (
            <div style={{ padding: "25px" }}>
                <div>Welcome {this.props.username}</div>
                <Link to="/">logout</Link>
                {this.state.notes.map((n, index) => {
                    return <NoteView key={index} note={n} removeNote={this.removeNote} updateNote={this.updateNote} />;
                })}
                {this.state.notes.length === 0 ? <div>No notes added.</div> : ""}
                <button onClick={() => this.setState({ newNote: true })}>Add Note</button>
                {
                    this.state.newNote ? (

                        <NewNote note={{ title: '', content: '' }} addNote={this.addNote} update={false} />

                    ) : ("")
                }
            </div>
        );

    }

}


class NoteView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showNote: false,
            edit: false
        }
    }

    updateNote = (newTitle, newText) => {
        this.props.updateNote(this.props.note, newTitle, newText)
        this.setState({ showNote: true, edit: false })
    }

    render() {
        return (
            <div>
                {this.state.edit ? (
                    <NewNote note={this.props.note} addNote={this.updateNote} update={true} />
                ) : (
                        <div>
                            <h3 onClick={
                                () => {
                                    let { showNote } = this.state;
                                    this.setState({ showNote: !showNote })
                                }
                            }>{this.props.note.title}</h3>
                            {
                                this.state.showNote ? (
                                    <div>
                                        <p>{this.props.note.content}</p>
                                        <span style={{ color: 'green' }} onClick={() => { this.setState({ edit: true }) }} >edit</span>
                                        {"   "}
                                        <span style={{ color: 'red' }} onClick={
                                            () => {
                                                this.setState({ showNote: false })
                                                this.props.removeNote(this.props.note)
                                            }
                                        }>remove</span>
                                    </div>
                                ) : ("")
                            }
                        </div>
                    )}
            </div>
        );
    }

}

class NewNote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTitle: this.props.note.title,
            newText: this.props.note.content
        }
    }

    handleTextChange = (event) => {
        this.setState({ newText: event.target.value })
    }

    handleTitleChange = (event) => {
        this.setState({ newTitle: event.target.value })
    }

    render() {
        return (
            <div>
                <input value={this.state.newTitle} onChange={this.handleTitleChange}></input>
                <textarea value={this.state.newText} onChange={this.handleTextChange}></textarea>
                <button onClick={
                    () => { this.props.addNote(this.state.newTitle, this.state.newText) }
                }>{this.props.update ? "save" : "add note"}</button>
            </div>
        );
    }

}

export default HomePage;