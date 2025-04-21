import React, { useState } from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import useAlarm from '../hooks/useAlarm';

export default function AlarmCard ({ alarm, handleEdit, handleDelete, handleAlarmRing, checkedItems, handleCheck, disabled, handleToggle }) {
    const [isEnabled, setIsEnabled] = useState(!disabled);
    
    const getFullDateTime = (alarm) => {
        if (alarm.type === 'Visit' && alarm.reminderTime) {
            return new Date(alarm.reminderTime); // Ensure reminderTime is a Date object
        }
      
       // For Morning/Bedtime/Medication — assume today’s date + time
        const today = new Date().toISOString().split('T')[0]; // "2025-04-19"
        return `${today}T${alarm.time}`; // → "2025-04-19T08:00"
        };
     
    const triggerTime = getFullDateTime(alarm);
    useAlarm(
        triggerTime,                      // alarmTime
        () => handleAlarmRing(alarm),     // callback
        null,                             // optional reminderTime
        !isEnabled                          // disabled
    );

    const toggleAlarm = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        handleToggle(alarm.id, !newState); 
    };
      
    return (
        <Card className="mb-3 border rounded shadow-sm mt-2">
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

            {/* Toggle Switch */}
            <Form.Check
                type="switch"
                id={`alarm-toggle-${alarm.id}`}
                label={isEnabled ? 'Alarm On' : 'Alarm Off'}
                checked={isEnabled}
                onChange={toggleAlarm}
                className="mb-3"
            />

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
    );
};

