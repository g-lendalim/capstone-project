<<<<<<< HEAD
import { useEffect, useState, useContext } from "react";
import { Button, Card, Form, ListGroup, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../components/AuthProvider";
import { PersonPlusFill, PencilSquare, TrashFill, TelephoneFill, PersonHeart, PeopleFill, EmojiFrown, EmojiSmile } from "react-bootstrap-icons";
import api from "../api";

export default function SupportCircle() {
    const { currentUser } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: "", phone: "" });
    const [editingContact, setEditingContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            if (currentUser?.uid) {
                try {
                    const response = await api.get(`/contacts/user/${currentUser.uid}`);
                    setContacts(response.data);
                } catch (err) {
                    console.error("Error fetching contacts:", err);
                    setError("Failed to fetch contacts.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchContacts();
    }, [currentUser]);

    const handleCall = (contactPhone) => {
        window.location.href = `tel:${contactPhone}`;
    }

    const handleAddContact = async () => {
        if (!newContact.name || !newContact.phone) {
            setFeedback({ type: "warning", message: "Please enter both name and phone number." });
            return;
        }

        try {
            setFeedback(null);
            const res = await api.post("/contacts", {
                user_id: currentUser.uid,
                name: newContact.name,
                phone: newContact.phone,
            });
            setContacts([...contacts, res.data]);
            setNewContact({ name: "", phone: "" });
            setFeedback({ type: "success", message: `${res.data.name} added to your support circle!` });
            setTimeout(() => setFeedback(null), 3000);
        } catch (err) {
            console.error("Error adding contacts:", err);
            setFeedback({ type: "danger", message: "Failed to add contact." });
        }
    };

    const handleEditContact = (contact) => {
        setEditingContact(contact);
        setFeedback(null);
    };

    const handleUpdateContact = async () => {
        if (!editingContact.name || !editingContact.phone) {
            setFeedback({ type: "warning", message: "Name and phone cannot be empty." });
            return;
        }

        try {
            const res = await api.put(`/contacts/${editingContact.id}`, {
                name: editingContact.name,
                phone: editingContact.phone,
            });
            setContacts(
                contacts.map((c) => (c.id === editingContact.id ? res.data : c))
            );
            setEditingContact(null);
            setFeedback({ type: "success", message: "Contact updated successfully!" });
            setTimeout(() => setFeedback(null), 3000);
        } catch (err) {
            console.error("Error updating contacts:", err);
            setFeedback({ type: "danger", message: "Failed to update contact." });
        }
    };

    const handleDeleteContact = (id, name) => {
        setContactToDelete({ id, name });
        setShowModal(true);
    };

    const confirmDelete = async () => {
        const { id, name } = contactToDelete;
        try {
            await api.delete(`/contacts/${id}`);
            setContacts(contacts.filter((contact) => contact.id !== id));
            setFeedback({ type: "success", message: `${name} removed successfully.` });
        } catch (err) {
            console.error("Error deleting contacts:", err);
            setFeedback({ type: "danger", message: "Failed to remove contact." });
        } finally {
            setShowModal(false);
            setContactToDelete(null);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading your support circle...</p>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger">Error loading your support circle: {error}</Alert>;
    }

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="d-flex align-items-center mb-3">
                        <PeopleFill className="me-2 text-primary" />
                        Your Support Circle
                    </h2>
                    <p className="text-muted">
                        Add people you trust and can reach out to when you need support.
                        Having a support network is an important part of mental well-being.
                    </p>
                    {feedback && (
                        <Alert variant={feedback.type} className="mt-3" dismissible onClose={() => setFeedback(null)}>
                            {feedback.message}
                        </Alert>
                    )}
                </Col>
            </Row>

            <Row>
                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm h-100" style={{ borderRadius: "12px", borderLeft: "4px solid #4e95ed" }}>
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center mb-3">
                                <PersonPlusFill className="me-2 text-primary" size={20} />
                                Add To Your Circle
                            </Card.Title>
                            <Form>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Someone who supports you"
                                                value={newContact.name}
                                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Their phone number"
                                                value={newContact.phone}
                                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button
                                    variant="primary"
                                    onClick={handleAddContact}
                                    className="w-100"
                                >
                                    <PersonPlusFill className="me-2" />
                                    Add to Support Circle
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm h-100" style={{ borderRadius: "12px", borderLeft: "4px solid #42b883" }}>
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center mb-3">
                                <PersonHeart className="me-2 text-success" size={20} />
                                People Who Care About You
                            </Card.Title>

                            {contacts.length === 0 ? (
                                <div className="text-center py-4">
                                    <EmojiFrown size={32} className="text-muted mb-3" />
                                    <p className="text-muted mb-0">Your support circle is empty.</p>
                                    <p className="text-muted">Add trusted contacts to reach out to when you need help.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-success mb-3">
                                        <EmojiSmile className="me-2" />
                                        You have {contacts.length} {contacts.length === 1 ? 'person' : 'people'} in your support network
                                    </p>
                                    <ListGroup variant="flush">
                                        {contacts.map((contact) => (
                                            <ListGroup.Item
                                                key={contact.id}
                                                className="border-bottom py-3"
                                            >
                                                {editingContact?.id === contact.id ? (
                                                    <Form>
                                                        <Row className="mb-2">
                                                            <Col sm={6}>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Name"
                                                                    value={editingContact.name}
                                                                    onChange={(e) =>
                                                                        setEditingContact({
                                                                            ...editingContact,
                                                                            name: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col sm={6}>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Phone"
                                                                    value={editingContact.phone}
                                                                    onChange={(e) =>
                                                                        setEditingContact({
                                                                            ...editingContact,
                                                                            phone: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => setEditingContact(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={handleUpdateContact}
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                ) : (
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className="fw-bold">{contact.name}</div>
                                                            <div className="text-success d-flex align-items-center">
                                                                <TelephoneFill
                                                                    size={18}
                                                                    className="me-1"
                                                                    onClick={() => handleCall(contact.phone)}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                                <a href={`tel:${contact.phone}`} className="text-decoration-none text-success" >
                                                                    <div style={{ fontSize: "16px" }}>{contact.phone}</div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Button
                                                                variant="link"
                                                                className="text-primary p-1"
                                                                onClick={() => handleEditContact(contact)}
                                                                title="Edit contact"
                                                            >
                                                                <PencilSquare size={18} />
                                                            </Button>
                                                            <Button
                                                                variant="link"
                                                                className="text-danger p-1"
                                                                onClick={() => handleDeleteContact(contact.id, contact.name)}
                                                                title="Remove from circle"
                                                            >
                                                                <TrashFill size={18} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-3 pb-5">
                <Col>
                    <div className="bg-light p-3 rounded text-center">
                        <p className="mb-0">
                            <em>Remember: Building a strong support network is a powerful step toward better mental health.</em>
                        </p>
                    </div>
                </Col>
            </Row>

            {showModal && contactToDelete && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to remove <strong>{contactToDelete?.name}</strong> from your support circle?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
}

=======
import { useEffect, useState, useContext } from "react";
import { Button, Card, Form, ListGroup, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../components/AuthProvider";
import { PersonPlusFill, PencilSquare, TrashFill, TelephoneFill, PersonHeart, PeopleFill, EmojiFrown, EmojiSmile } from "react-bootstrap-icons";
import api from "../api";

export default function SupportCircle() {
    const { currentUser } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: "", phone: "" });
    const [editingContact, setEditingContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            if (currentUser?.uid) {
                try {
                    const response = await api.get(`/contacts/user/${currentUser.uid}`);
                    setContacts(response.data);
                } catch (err) {
                    console.error("Error fetching contacts:", err);
                    setError("Failed to fetch contacts.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchContacts();
    }, [currentUser]);

    const handleAddContact = async () => {
        if (!newContact.name || !newContact.phone) {
            setFeedback({ type: "warning", message: "Please enter both name and phone number." });
            return;
        }

        try {
            setFeedback(null);
            const res = await api.post("/contacts", {
                user_id: currentUser.uid,
                name: newContact.name,
                phone: newContact.phone,
            });
            setContacts([...contacts, res.data]);
            setNewContact({ name: "", phone: "" });
            setFeedback({ type: "success", message: `${res.data.name} added to your support circle!` });
            setTimeout(() => setFeedback(null), 3000);
        } catch (err) {
            console.error("Error adding contacts:", err);
            setFeedback({ type: "danger", message: "Failed to add contact." });
        }
    };

    const handleEditContact = (contact) => {
        setEditingContact(contact);
        setFeedback(null);
    };

    const handleUpdateContact = async () => {
        if (!editingContact.name || !editingContact.phone) {
            setFeedback({ type: "warning", message: "Name and phone cannot be empty." });
            return;
        }
        
        try {
            const res = await api.put(`/contacts/${editingContact.id}`, {
                name: editingContact.name,
                phone: editingContact.phone,
            });
            setContacts(
                contacts.map((c) => (c.id === editingContact.id ? res.data : c))
            );
            setEditingContact(null);
            setFeedback({ type: "success", message: "Contact updated successfully!" });
            setTimeout(() => setFeedback(null), 3000);
        } catch (err) {
            console.error("Error updating contacts:", err);
            setFeedback({ type: "danger", message: "Failed to update contact." });
        }
    };

    const handleDeleteContact = (id, name) => {
        setContactToDelete({ id, name });
        setShowModal(true);
    };

    const confirmDelete = async () => {
        const { id, name } = contactToDelete;
        try {
            await api.delete(`/contacts/${id}`);
            setContacts(contacts.filter((contact) => contact.id !== id));
            setFeedback({ type: "success", message: `${name} removed successfully.` });
        } catch (err) {
            console.error("Error deleting contacts:", err);
            setFeedback({ type: "danger", message: "Failed to remove contact." });
        } finally {
            setShowModal(false);
            setContactToDelete(null);
            setTimeout(() => setFeedback(null), 3000);
        }
    };    

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading your support circle...</p>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger">Error loading your support circle: {error}</Alert>;
    }

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="d-flex align-items-center mb-3">
                        <PeopleFill className="me-2 text-primary" />
                        Your Support Circle
                    </h2>
                    <p className="text-muted">
                        Add people you trust and can reach out to when you need support.
                        Having a support network is an important part of mental well-being.
                    </p>
                    {feedback && (
                        <Alert variant={feedback.type} className="mt-3" dismissible onClose={() => setFeedback(null)}>
                            {feedback.message}
                        </Alert>
                    )}
                </Col>
            </Row>

            <Row>
                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm h-100" style={{ borderRadius: "12px", borderLeft: "4px solid #4e95ed" }}>
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center mb-3">
                                <PersonPlusFill className="me-2 text-primary" size={20} />
                                Add To Your Circle
                            </Card.Title>
                            <Form>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Someone who supports you"
                                                value={newContact.name}
                                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Their phone number"
                                                value={newContact.phone}
                                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button 
                                    variant="primary" 
                                    onClick={handleAddContact}
                                    className="w-100"
                                >
                                    <PersonPlusFill className="me-2" />
                                    Add to Support Circle
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm h-100" style={{ borderRadius: "12px", borderLeft: "4px solid #42b883" }}>
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center mb-3">
                                <PersonHeart className="me-2 text-success" size={20} />
                                People Who Care About You
                            </Card.Title>
                            
                            {contacts.length === 0 ? (
                                <div className="text-center py-4">
                                    <EmojiFrown size={32} className="text-muted mb-3" />
                                    <p className="text-muted mb-0">Your support circle is empty.</p>
                                    <p className="text-muted">Add trusted contacts to reach out to when you need help.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-success mb-3">
                                        <EmojiSmile className="me-2" />
                                        You have {contacts.length} {contacts.length === 1 ? 'person' : 'people'} in your support network
                                    </p>
                                    <ListGroup variant="flush">
                                        {contacts.map((contact) => (
                                            <ListGroup.Item
                                                key={contact.id}
                                                className="border-bottom py-3"
                                            >
                                                {editingContact?.id === contact.id ? (
                                                    <Form>
                                                        <Row className="mb-2">
                                                            <Col sm={6}>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Name"
                                                                    value={editingContact.name}
                                                                    onChange={(e) =>
                                                                        setEditingContact({
                                                                            ...editingContact,
                                                                            name: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col sm={6}>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Phone"
                                                                    value={editingContact.phone}
                                                                    onChange={(e) =>
                                                                        setEditingContact({
                                                                            ...editingContact,
                                                                            phone: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => setEditingContact(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={handleUpdateContact}
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                ) : (
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className="fw-bold">{contact.name}</div>
                                                            <div className="text-muted d-flex align-items-center">
                                                                <TelephoneFill size={12} className="me-1" /> 
                                                                {contact.phone}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Button
                                                                variant="link"
                                                                className="text-primary p-1"
                                                                onClick={() => handleEditContact(contact)}
                                                                title="Edit contact"
                                                            >
                                                                <PencilSquare size={18} />
                                                            </Button>
                                                            <Button
                                                                variant="link"
                                                                className="text-danger p-1"
                                                                onClick={() => handleDeleteContact(contact.id, contact.name)}
                                                                title="Remove from circle"
                                                            >
                                                                <TrashFill size={18} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col>
                    <div className="bg-light p-3 rounded text-center">
                        <p className="mb-0">
                            <em>Remember: Building a strong support network is a powerful step toward better mental health.</em>
                        </p>
                    </div>
                </Col>
            </Row>

            {showModal && contactToDelete && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to remove <strong>{contactToDelete?.name}</strong> from your support circle?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
}

>>>>>>> 6d4b2cb5b9ab02691911d8fc18a562e70812be9b
