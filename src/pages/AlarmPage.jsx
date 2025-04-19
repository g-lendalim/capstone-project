import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import api from '../api';
import { AuthContext } from "../components/AuthProvider";
import AlarmFormModal from '../components/AlarmFormModal';
import LogPromptModal from '../components/LogPromptModal';
import AlarmCard from '../components/AlarmCard';

export default function AlarmPage() {
  const { currentUser } = useContext(AuthContext);

  const [alarms, setAlarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: '', time: '', label: '', checklist: [] });
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [showLogModal, setShowLogModal] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);

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
        ? current.filter((i) => i !== item)
        : [...current, item];

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
      if (formData.id) {
        const response = await api.put(`/alarms/${formData.id}`, {
          user_id: currentUser.uid,
          ...formData,
        });
        setAlarms((prev) =>
          prev.map((alarm) => (alarm.id === formData.id ? response.data : alarm))
        );
      } else {
        const response = await api.post('/alarms', {
          user_id: currentUser.uid,
          ...formData,
        });

        setAlarms((prev) => [...prev, response.data]);
      }
      setShowModal(false);
      setFormData({ type: '', time: '', label: '', checklist: [] });
    } catch (err) {
      console.error('Error saving alarm:', err);
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

  const handleAlarmRing = (alarm) => {
    console.log(`Alarm "${alarm.label}" is ringing!`);
    setCurrentAlarm(alarm);
    setShowLogModal(true); 
  };

  const handleReminder = (selectedDateTime, hoursBefore) => {
    const reminderTime = new Date(selectedDateTime);
    reminderTime.setHours(reminderTime.getHours() - hoursBefore);
  
    setFormData((prev) => ({
      ...prev,
      reminderTime: reminderTime.toISOString(), // Store the reminder time in ISO format
    }));
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
                    <AlarmCard
                      key={alarm.id}
                      alarm={alarm}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      handleAlarmRing={handleAlarmRing}
                      checkedItems={checkedItems}
                      handleCheck={handleCheck}
                    />
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

      <LogPromptModal
        show={showLogModal}
        onHide={() => setShowLogModal(false)}
        alarm={currentAlarm} 
      />
    </div>
  );
}
