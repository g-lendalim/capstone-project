import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import api from '../api';
import { AuthContext } from "../components/AuthProvider";
import AlarmFormModal from '../components/AlarmFormModal';
import LogPromptModal from '../components/LogPromptModal';
import AlarmCard from '../components/AlarmCard';
import { alarmThemes } from '../hooks/alarmThemes';

export default function AlarmPage() {
  const { currentUser } = useContext(AuthContext);
  const [alarms, setAlarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: '', time: '', date: '', label: '', reminder: '', checklist: [], isEnabled: true });
  const [checkedItems, setCheckedItems] = useState({});
  const [showLogModal, setShowLogModal] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const defaultAlarmTypes = [
    { displayName: 'Rise & Shine', type: 'Morning' },
    { displayName: 'Time to Wind Down', type: 'Bedtime' },
    { displayName: 'Therapy Time', type: 'Therapy' },
    { displayName: 'Pill Time', type: 'Medication' },
  ];

  useEffect(() => {
    const fetchAlarms = async () => {
      if (currentUser?.uid) {
        try {
          const response = await api.get(`/alarms/user/${currentUser.uid}`);
          setAlarms(response.data);
        } catch (err) {
          console.error('Error fetching alarms:', err);
        }
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
      const dataToSubmit = {
        ...formData,
        isEnabled: true,
        user_id: currentUser.uid,
        reminder: formData.reminder || null,
        sound_url: formData.sound_url || null,
        date: formData.date || null
      };

      if (formData.id) {
        console.log('Updating alarm with data:', dataToSubmit);
        const response = await api.put(`/alarms/${formData.id}`, dataToSubmit);

        if (response && response.data) {
          setAlarms((prev) =>
            prev.map((alarm) => (alarm.id === formData.id ? response.data : alarm))
          );
        } else {
          console.error('Invalid response from server when updating alarm');
        }
      } else {
        console.log('Creating new alarm with data:', dataToSubmit);
        const response = await api.post('/alarms', dataToSubmit);

        if (response && response.data) {
          setAlarms((prev) => [...prev, response.data]);
        } else {
          console.error('Invalid response from server when creating alarm');
        }
      }
      setShowModal(false);
      setFormData({ type: '', time: '', date: '', label: '', checklist: [], isEnabled: true });
    } catch (err) {
      console.error('Error saving alarm:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this alarm?");
    if (!confirmed) return;

    try {
      await api.delete(`/alarms/${id}`);
      setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    } catch (err) {
      console.error('Error deleting alarm:', err);
    }
  };

  const handleEdit = (alarm) => {
    setFormData({ ...alarm, isEnabled: alarm.isEnabled === true });
    setShowModal(true);
  };

  const dismissAlarm = (alarmId) => {
    handleToggle(alarmId, false);
    setShowLogModal(false);
  };

  const handleToggle = async (alarmId, isEnabled) => {
    try {
      const currentAlarm = alarms.find(alarm => alarm.id === alarmId);
      if (!currentAlarm) {
        console.error('Alarm not found:', alarmId);
        return;
      }

      const dataToSubmit = {
        ...currentAlarm,
        isEnabled: isEnabled,
        checklist: Array.isArray(currentAlarm.checklist) ? currentAlarm.checklist : [],
        sound_url: currentAlarm.sound_url || null,
        date: currentAlarm.date || null,
        reminder: currentAlarm.reminder || null,
        time: currentAlarm.time
      };
      console.log('Updating alarm toggle state:', dataToSubmit);

      const response = await api.put(`/alarms/${alarmId}`, dataToSubmit);

      if (!response || !response.data) {
        console.error('No response data from server');
        return;
      }

      setAlarms(prev =>
        prev.map(alarm =>
          alarm.id === alarmId ? { ...alarm, isEnabled } : alarm
        )
      );
    } catch (err) {
      console.error('Error toggling alarm:', err);
    }
  };

  const filteredAlarms = activeTab === 'all'
    ? alarms
    : alarms.filter(alarm => alarm.type === activeTab);

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="fw-bold">
          <span className="me-2">⏰</span>
          My Reminders
        </h1>
        <Button
          variant="primary"
          className="rounded-pill px-3 py-2"
          onClick={() => {
            setFormData({ type: '', time: '', date: '', label: '', reminder: '', checklist: [], isEnabled: true });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          New Reminder
        </Button>
      </div>

      {/* Type Filter Tabs */}
      <div className="mb-4">
        <ul className="nav nav-pills nav-fill">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Reminders
            </button>
          </li>
          {defaultAlarmTypes.map(({ type }) => (
            <li className="nav-item" key={type}>
              <button
                className={`nav-link ${activeTab === type ? 'active' : ''}`}
                style={{
                  backgroundColor: activeTab === type ? alarmThemes[type].buttonBg : 'transparent',
                  color: activeTab === type ? alarmThemes[type].buttonText : ''
                }}
                onClick={() => setActiveTab(type)}
              >
                {alarmThemes[type].icon} {type}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {filteredAlarms.length === 0 ? (
        <Card className="text-center p-5 shadow-sm">
          <div className="py-5">
            <div style={{ fontSize: '3rem', opacity: 0.5 }}>⏰</div>
            <h4>No reminders to show</h4>
            <p className="text-muted">Create your first reminder to get started</p>
            <Button
              variant="primary"
              onClick={() => {
                setFormData({ type: '', time: '', date: '', label: '', reminder: '', checklist: [], isEnabled: true });
                setShowModal(true);
              }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Create Reminder
            </Button>
          </div>
        </Card>
      ) :
        activeTab === 'all' ? (
          <>
            {defaultAlarmTypes.map(({ type }) => {
              const typeAlarms = alarms.filter(alarm => alarm.type === type);
              if (typeAlarms.length === 0) return null;

              return (
                <div key={type} className="pb-5">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: alarmThemes[type].gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px'
                      }}
                    >
                      {alarmThemes[type].icon}
                    </div>
                    <h4 className="m-0">{type}</h4>
                  </div>

                  {typeAlarms.map((alarm) => (
                    <AlarmCard
                      key={alarm.id}
                      alarm={alarm}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      checkedItems={checkedItems}
                      handleCheck={handleCheck}
                      handleToggle={handleToggle}
                      setCurrentAlarm={setCurrentAlarm}
                      setShowLogModal={setShowLogModal}
                    />
                  ))}
                </div>
              );
            })}
          </>
        ) : (
          <div className='pb-5'>
            {filteredAlarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                alarm={{ ...alarm }}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                checkedItems={checkedItems}
                handleCheck={handleCheck}
                handleToggle={handleToggle}
                setCurrentAlarm={setCurrentAlarm}
                setShowLogModal={setShowLogModal}
              />
            ))}
          </div>
        )}

      <AlarmFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        formData={formData}
        handleFormChange={handleFormChange}
        handleTypeChange={handleTypeChange}
        handleChecklistChange={handleChecklistChange}
        addChecklistItem={addChecklistItem}
        removeChecklistItem={removeChecklistItem}
        handleSubmit={handleSubmit}
      />

      <LogPromptModal
        show={showLogModal}
        onHide={() => setShowLogModal(false)}
        alarm={currentAlarm}
        userId={currentUser?.uid}
        dismissAlarm={dismissAlarm}
      />
    </Container>
  );
}