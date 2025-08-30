import { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, signOut } from '../lib/auth';
import { createNote, deleteNote, getNotes, Note, updateNote } from '../lib/notes';
import { DeleteIcon, EditIcon } from '../components/Icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchNotes = async () => {
      try {
        const notesData = await getNotes();
        setNotes(notesData || []);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const addNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const created = await createNote(newNote.title.trim(), newNote.content.trim());
      setNotes([created, ...notes]);
      setNewNote({ title: '', content: '' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
    setIsLoading(false);
  };

  const removeNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
  };

  const saveEdit = async () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const updated = await updateNote(editingNote._id, editingNote.title, editingNote.content);
      setNotes(notes.map(note => note._id === updated._id ? updated : note));
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
    setIsLoading(false);
  };

  const cancelEdit = () => {
    setEditingNote(null);
  };

  return (
    <div className="dashboard-bg">
      <Container className="py-4">
        {/* Header with Logo and Logout */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            {/* Logo Circle */}
            <div className="logo-circle me-3">
              <div className="logo-inner"></div>
            </div>
            <h2 className="mb-0 dashboard-title">Dashboard</h2>
          </div>
          <Button
            variant="outline-primary"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>

        {/* Welcome Box */}
        <Card className="welcome-card mb-4">
          <Card.Body>
            <h3 className="mb-1 welcome-title">Welcome, {user?.name || 'User'}!</h3>
            <p className="text-muted mb-0">{user?.email || 'user@example.com'}</p>
          </Card.Body>
        </Card>

        {/* Create Note Button */}
        <div className="mb-4">
          <Button
            className="simple-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create note'}
          </Button>
        </div>

        {/* Create Note Form (conditionally shown) */}
        {showCreateForm && (
          <Card className="simple-card mb-4">
            <Card.Body>
              <h5 className="mb-3">Create new note</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="simple-input"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="simple-input"
                  />
                </Form.Group>
                <Button
                  onClick={addNote}
                  disabled={isLoading || !newNote.title.trim() || !newNote.content.trim()}
                  className="simple-btn"
                >
                  {isLoading ? 'Creating...' : 'Create Note'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* Notes List */}
        {notes.length > 0 && (
          <Card className="simple-card">
            <Card.Body>
              <h5 className="mb-3">Your Notes</h5>
              <div>
                {notes.map((note) => (
                  <div key={note._id} className="note-item">
                    {editingNote && editingNote._id === note._id ? (
                      <div className="w-100">
                        <Form.Group className="mb-2">
                          <Form.Control
                            type="text"
                            value={editingNote.title}
                            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                            className="simple-input"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={editingNote.content}
                            onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                            className="simple-input"
                          />
                        </Form.Group>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            className="simple-btn"
                            onClick={saveEdit}
                            disabled={isLoading}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{note.title}</h6>
                          <p className="mb-1 text-muted">{note.content}</p>
                          <small className="text-muted">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="note-actions">
                          <button
                            className="icon-btn edit-btn"
                            onClick={() => startEdit(note)}
                            title="Edit note"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            className="icon-btn delete-btn"
                            onClick={() => removeNote(note._id)}
                            title="Delete note"
                          >
                            <DeleteIcon size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;