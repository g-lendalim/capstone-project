import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { alarmFormThemes } from '../hooks/alarmThemes';

export default function AlarmFormModal({
  show,
  onHide,
  formData,
  handleFormChange,
  handleTypeChange,
  handleChecklistChange,
  addChecklistItem,
  removeChecklistItem,
  handleSubmit,
}) {
  const [currentTheme, setCurrentTheme] = useState({});

  const safeFormData = {
    id: formData.id || '',
    type: formData.type || '',
    time: formData.time || '',
    date: formData.date ? formData.date.split('T')[0] : '',
    label: formData.label || '',
    reminder: formData.reminder || '',
    checklist: Array.isArray(formData.checklist) ? formData.checklist : [],
    isEnabled: formData.isEnabled !== undefined ? formData.isEnabled : true,
    sound_url: formData.sound_url || '',
  };

  useEffect(() => {
    // Update theme when alarm type changes
    if (safeFormData.type && alarmFormThemes[safeFormData.type]) {
      setCurrentTheme(alarmFormThemes[safeFormData.type]);
    } else {
      setCurrentTheme(alarmFormThemes.default);
    }
  }, [safeFormData.type]);

  const showCalendar = safeFormData.type === 'Therapy';

  const reminderOptions = [
    { label: '1 Hour Before', value: 1 },
    { label: '2 Hours Before', value: 2 },
    { label: '3 Hours Before', value: 3 },
    { label: '4 Hours Before', value: 4 },
    { label: '6 Hours Before', value: 6 },
    { label: '12 Hours Before', value: 12 },
    { label: '24 Hours Before', value: 24 },
  ]; 

  const handleReminderChange = (e) => {
    const offsetHours = parseInt(e.target.value, 10);

    if (!safeFormData.date || !safeFormData.time || isNaN(offsetHours)) {
      handleFormChange({
        target: {
          name: 'reminderOffset',
          value: '',
        },
      });
      handleFormChange({
        target: {
          name: 'reminder',
          value: '',
        },
      });
      return;
    }

    const alarmDateTimeString = `${safeFormData.date}T${safeFormData.time}`;
    const alarmDateTime = new Date(alarmDateTimeString);
    const reminderDateTime = new Date(alarmDateTime.getTime() - offsetHours * 60 * 60 * 1000);
    handleFormChange({
      target: {
        name: 'reminderOffset',
        value: offsetHours,
      },
    });
    handleFormChange({
      target: {
        name: 'reminder',
        value: reminderDateTime,
      },
    });
  };
  
  const handleTimeChange = (e) => {
    const timeValue = e.target.value || '';
    handleFormChange({
      target: {
        name: 'time',
        value: timeValue
      }
    });
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value || '';
    handleFormChange({
      target: {
        name: 'date',
        value: dateValue
      }
    });
  }; 

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      size="lg"
      backdrop="static"
      className="alarm-modal"
    >
      <Modal.Header 
        closeButton 
        style={{ 
          background: currentTheme.gradient || alarmFormThemes.default.gradient,
          borderBottom: 'none',
          padding: '1.2rem 1.5rem',
          borderRadius: '0.5rem 0.5rem 0 0',
        }}
      >
        <Modal.Title className="w-100 text-center fw-bold" style={{ color: currentTheme.buttonText || '#333' }}>
          {safeFormData.id ? (
            <>
              <span className="me-2">Edit Your Alarm</span>
              {currentTheme.icon || '⏰'}
            </>
          ) : (
            <>
              <span className="me-2">Create a New Alarm</span>
              {currentTheme.icon || '⏰'}
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: currentTheme.cardBg || '#f9f9f9', padding: '1.5rem' }}>
        <p className="text-center mb-4" style={{ color: currentTheme.accentColor || '#555', fontSize: '0.95rem' }}>
          {safeFormData.id
            ? 'Update your alarm to stay on track with your mental health goals.'
            : 'Create a personalized alarm to support your mental health routine.'}
        </p>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label style={{ color: currentTheme.accentColor || '#555', fontWeight: '600' }}>
              <i className="bi bi-list-check me-2"></i>Choose Alarm Type
            </Form.Label>
            <Form.Select
              name="type"
              value={safeFormData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{ 
                border: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
                borderRadius: '0.5rem',
                padding: '0.6rem'
              }}
              className="shadow-sm"
            >
              <option value="">Select type</option>
              <option value="Morning">☀️ Rise & Shine</option>
              <option value="Bedtime">🌙 Time to Wind Down</option>
              <option value="Therapy">🩺 Therapy Time</option>
              <option value="Medication">💊 Pill Time</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ color: currentTheme.accentColor || '#555', fontWeight: '600' }}>
              <i className="bi bi-tag me-2"></i>Customize Label
            </Form.Label>
            <Form.Control
              type="text"
              name="label"
              value={safeFormData.label}
              onChange={handleFormChange}
              placeholder={
                safeFormData.type === 'Morning'
                  ? 'Begin with Purpose'
                  : safeFormData.type === 'Bedtime'
                    ? 'Rest and Recharge'
                    : safeFormData.type === 'Therapy'
                      ? 'Upcoming Appointment'
                      : safeFormData.type === 'Medication'
                        ? 'Take Your Medication'
                        : 'Give your alarm a name'
              }
              style={{ 
                border: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
                borderRadius: '0.5rem',
                padding: '0.6rem'
              }}
              className="shadow-sm"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ color: currentTheme.accentColor || '#555', fontWeight: '600' }}>
              <i className="bi bi-clock me-2"></i>
              {safeFormData.type === 'Therapy' ? 'Set Date and Time' : 'Set Time'}
            </Form.Label>

            {safeFormData.type === 'Therapy' && showCalendar ? (
              <Row className="g-3">
                <Col md={6}>
                  <Form.Control
                    type="date"
                    name="date"
                    value={safeFormData.date}
                    onChange={handleDateChange}
                    style={{ 
                      border: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
                      borderRadius: '0.5rem',
                      padding: '0.6rem'
                    }}
                    className="shadow-sm"
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="time"
                    name="time"
                    value={safeFormData.time}
                    onChange={handleTimeChange}
                    style={{ 
                      border: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
                      borderRadius: '0.5rem',
                      padding: '0.6rem'
                    }}
                    className="shadow-sm"
                  />
                </Col>
              </Row>
            ) : (
              <Form.Control
                type="time"
                name="time"
                value={safeFormData.time}
                onChange={handleTimeChange}
                style={{ 
                  border: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
                  borderRadius: '0.5rem',
                  padding: '0.6rem'
                }}
                className="shadow-sm"
              />
            )}
          </Form.Group>

          {safeFormData.type === 'Therapy' && (
            <Form.Group className="mb-4">
              <Form.Label style={{ color: currentTheme.accentColor || '#555', fontWeight: '600' }}>
                <i className="bi bi-bell me-2"></i>Set Reminder
              </Form.Label>
              <Form.Select
                name="reminderOffset"
                value={safeFormData.reminderOffset}
                onChange={handleReminderChange}
                style={{ 
                  border: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
                  borderRadius: '0.5rem',
                  padding: '0.6rem'
                }}
                className="shadow-sm"
              >
                <option value="">No Reminder</option>
                {reminderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-2">
            <Form.Label style={{ color: currentTheme.accentColor || '#555', fontWeight: '600' }}>
              <i className="bi bi-check2-square me-2"></i>Checklist
            </Form.Label>
            <Button
              variant="outline-light"
              onClick={addChecklistItem}
              style={{
                backgroundColor: currentTheme.cardBg || '#f9f9f9',
                color: currentTheme.accentColor || '#555',
                border: `1px dashed ${currentTheme.borderColor || '#ced4da'}`,
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
                marginBottom: '1rem',
                width: '100%'
              }}
              className="d-flex align-items-center justify-content-center"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = currentTheme.buttonBg || '#e9e9e9';
                e.target.style.color = currentTheme.buttonText || '#333';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentTheme.cardBg || '#f9f9f9';
                e.target.style.color = currentTheme.accentColor || '#555';
              }}
            >
              <i className="bi bi-plus-circle me-2"></i> Add Checklist Item
            </Button>
            
            {safeFormData.checklist.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleChecklistChange(index, e.target.value)}
                  style={{ 
                    border: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
                    borderRadius: '0.5rem 0 0 0.5rem',
                    padding: '0.6rem',
                    flexGrow: 1
                  }}
                  placeholder={`Checklist item ${index + 1}`}
                />
                <Button
                  variant="outline-danger"
                  onClick={() => removeChecklistItem(index)}
                  style={{ 
                    borderRadius: '0 0.5rem 0.5rem 0',
                    padding: '0.6rem',
                    borderColor: currentTheme.borderColor || '#ced4da',
                    backgroundColor: '#fff1f0'
                  }}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ 
        backgroundColor: currentTheme.cardBg || '#f9f9f9', 
        borderTop: `1px solid ${currentTheme.borderColor || '#ced4da'}`,
        padding: '1rem 1.5rem',
        borderRadius: '0 0 0.5rem 0.5rem'
      }}>
        <Button
          variant="light"
          onClick={onHide}
          style={{ 
            backgroundColor: '#f0f0f0',
            color: '#555',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.6rem 1.2rem'
          }}
          className="me-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          style={{ 
            backgroundColor: currentTheme.buttonBg || '#adadad',
            color: currentTheme.buttonText || '#333',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.6rem 1.2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {safeFormData.id ? (
            <>
              <i className="bi bi-check2-circle me-2"></i>
              Update Alarm
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>
              Save Alarm
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}