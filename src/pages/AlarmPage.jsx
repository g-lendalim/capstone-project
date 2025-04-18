import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Row, Col } from 'react-bootstrap';
import api from '../api';
import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";
import AlarmFormModal from '../components/AlarmFormModal';

export default function AlarmPage() {
  const { currentUser } = useContext(AuthContext);

  const [alarms, setAlarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'Morning', time: '', label: '', checklist: [] });
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const defaultAlarmTypes = [
    { displayName: 'Rise & Shine', type: 'Morning' },
    { displayName: 'Time to Wind Down', type: 'Bedtime' },
    { displayName: 'Therapy Time', type: 'Visit' },
    { displayName: 'Pill Time', type: 'Medication' },
  ];

  useEffect(() => {
    const fetchAlarms = async () => {
      if (currentUser.uid)
      try {
        const response = await api.get(`/alarms/user/${currentUser.uid}`);
        setAlarms(response.data);
      } catch (err) {
        console.error('Error fetching alarms:', err);
      }
    };

    fetchAlarms();
  }, [currentUser]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheck = (alarmId, item) => {
    setCheckedItems((prev) => {
      const current = prev[alarmId] || [];
      const updated = current.includes(item)
        ? current.filter((i) => i !== item) // Uncheck
        : [...current, item]; // Check
  
      return {
        ...prev,
        [alarmId]: updated,
      };
    });
  };  

  const handleChecklistChange = (index, value) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist[index] = value;
    setFormData({ ...formData, checklist: updatedChecklist });
  };

  const addChecklistItem = () => {
    setFormData({ ...formData, checklist: [...formData.checklist, ''] });
  };

  const removeChecklistItem = (index) => {
    const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
    setFormData({ ...formData, checklist: updatedChecklist });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/alarms', {
        user_id: currentUser.uid,
        ...formData,
      }); 
      setAlarms((prev) => [...prev, response.data]);
      setShowModal(false);
      setFormData({ type: '', time: '', label: '', checklist: [] });
    } catch (err) {
      console.error('Error creating alarm:', err);
    }
  };

  const groupAlarmsByType = (alarms) => {
    const grouped = {};
  
    alarms.forEach((alarm) => {
      const type = alarm.type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(alarm);
    });
  
    defaultAlarmTypes.forEach(({ type }) => {
      if (!grouped[type]) {
        grouped[type] = [];
      }
    });
  
    return grouped;
  };
  

  const groupedAlarms = groupAlarmsByType(alarms);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alarms/${id}`);
      setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    } catch (err) {
      console.error('Error deleting alarm:', err);
    }
  };

  const handleEdit = (alarm) => {
    setFormData(alarm);
    setShowModal(true);
  };

  const handleReminder = (selectedDateTime, hoursBefore) => {
    const visitDateTime = new Date(selectedDateTime); // Convert selected date and time to a Date object
    const reminderTime = new Date(visitDateTime.getTime() - hoursBefore * 60 * 60 * 1000); // Subtract the specified hours
    const now = new Date();
    const timeUntilReminder = reminderTime - now;
  
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        alert(`Reminder: Your visit is scheduled for ${visitDateTime.toLocaleString()}`);
      }, timeUntilReminder);
    } else {
      console.warn("Reminder time has already passed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">⏰ Manage Alarms</h2>
      <Row className="mb-4">
        {defaultAlarmTypes.map(({ displayName, type }) => (
          <Col key={type} md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  {displayName}
                </Card.Title>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleTypeChange(type);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-plus-lg"></i> Add New Alarm
                </Button>

                  {groupedAlarms[type].length === 0 ? (
                    <p className="text-muted mt-2">No alarms set</p>
                  ) : (
                    groupedAlarms[type].map((alarm) => (
                      <Card key={alarm.id} className="mb-3 border rounded shadow-sm mt-2">
                        <Card.Body>
                          {/* Alarm Header */}
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <h5 className="mb-1">{alarm.label}</h5>
                              <small className="text-muted">{alarm.type}</small>
                            </div>
                            <div className="d-flex">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(alarm)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(alarm.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </div>
                  
                          {/* Time & Date */}
                          <div className="mb-2">
                            {alarm.date && alarm.type === 'Visit' && (
                              <div className="text-muted small mb-1">
                                <i className="bi bi-calendar-event me-2"></i>
                                {new Date(alarm.date).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </div>
                            )}
                            {alarm.time && (
                              <div className="text-muted small mb-1">
                                <i className="bi bi-clock me-2"></i>
                                {alarm.time}
                              </div>
                            )}
                            {alarm.type === 'Visit' && alarm.reminder && (
                              <div className="text-muted small mb-1">
                                <i className="bi bi-bell me-2"></i>
                                Reminder: {alarm.reminder}
                              </div>
                            )}
                          </div>
                  
                          {/* Checklist */}
                          {alarm.checklist.length > 0 && (
                            <div className="small mt-3">
                              <strong className="d-block mb-2">
                                <i className="bi bi-list-check me-2"></i>Checklist
                              </strong>
                              <ul className="list-unstyled ms-1">
                                {alarm.checklist.map((item, index) => (
                                  <li
                                    key={index}
                                    className="d-flex justify-content-between align-items-center py-1 px-2 rounded bg-white border mb-2"
                                  >
                                    <span
                                      className={`me-2 ${
                                        checkedItems[alarm.id]?.includes(item)
                                          ? 'text-decoration-line-through text-muted'
                                          : ''
                                      }`}
                                    >
                                      {item}
                                    </span>
                                    <button
                                      className={`btn btn-sm ${
                                        checkedItems[alarm.id]?.includes(item)
                                          ? 'btn-outline-secondary'
                                          : 'btn-outline-success'
                                      }`}
                                      onClick={() => handleCheck(alarm.id, item)}
                                    >
                                      <i
                                        className={`bi ${
                                          checkedItems[alarm.id]?.includes(item)
                                            ? 'bi-x-lg'
                                            : 'bi-check-lg'
                                        }`}
                                      ></i>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))
                  )}                  
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <AlarmFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        formData={formData}
        handleFormChange={handleFormChange}
        handleTypeChange={handleTypeChange}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        handleChecklistChange={handleChecklistChange}
        addChecklistItem={addChecklistItem}
        removeChecklistItem={removeChecklistItem}
        handleReminder={handleReminder}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
