import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import useAlarm from '../hooks/useAlarm';
import { alarmThemes } from '../hooks/alarmThemes';

export default function AlarmCard({ alarm, handleEdit, handleDelete, handleCheck, handleToggle, checkedItems, setCurrentAlarm, setShowLogModal }) {
    const [isEnabled, setIsEnabled] = useState(alarm.isEnabled === true);
    const theme = alarmThemes[alarm.type];

    useEffect(() => {
        setIsEnabled(alarm.isEnabled === true);
    }, [alarm.isEnabled]);

    const getFullDateTime = (alarm) => {
        if (alarm.type === 'Therapy' && alarm.date) {
            const [year, month, day] = alarm.date.split('-');
            const [hours, minutes] = alarm.time.split(':');
            return new Date(year, month - 1, day, hours, minutes);
        }

        const [hours, minutes] = alarm.time.split(':');
        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            parseInt(hours, 10),
            parseInt(minutes, 10)
        );

        if (today < now) {
            today.setDate(today.getDate() + 1);
        }

        return today;
    };

    const triggerTime = getFullDateTime(alarm);

    useAlarm(
        triggerTime,
        () => {
            console.log(`Alarm "${alarm.label}" is triggered!`);
            setCurrentAlarm(alarm);
            setShowLogModal(true);
        },
        alarm.reminderTime || null,
        !isEnabled
    );

    const toggleAlarm = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        handleToggle(alarm.id, newState);
    };

    return (
        <div className="fade-in-card">
            <Card
                className="mb-3 shadow-sm"
                style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: theme.cardBg,
                    borderLeft: `4px solid ${theme.buttonBg}`
                }}
            >
                <div style={{
                    height: '8px',
                    width: '100%',
                    background: theme.gradient
                }} />
                <Card.Body>
                    {/* Alarm Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="me-2" style={{ fontSize: '1.5rem' }}>{theme.icon}</span>
                            <div>
                                <h5 className="mb-0 fw-bold">{alarm.label}</h5>
                                <small className="text-muted">{alarm.type}</small>
                            </div>
                        </div>
                        <div className="d-flex">
                            <Button
                                variant="light"
                                size="sm"
                                className="me-2 rounded-circle"
                                style={{ width: '36px', height: '36px' }}
                                onClick={() => handleEdit(alarm)}
                            >
                                <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="rounded-circle"
                                style={{ width: '36px', height: '36px' }}
                                onClick={() => handleDelete(alarm.id)}
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        </div>
                    </div>

                    {/* Toggle and Time Row */}
                    <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-2 rounded">
                        <div className="d-flex flex-column">
                            {alarm.time && (
                                <div className="fw-bold">
                                    <i className="bi bi-clock me-2"></i>
                                    {alarm.time}
                                </div>
                            )}
                            {alarm.date && alarm.type === 'Therapy' && (
                                <div className="text-muted small">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {new Date(alarm.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            )}
                            {isEnabled && (
                                <div className="text-success small mt-1">
                                    <i className="bi bi-bell-fill me-1"></i>
                                    Next: {triggerTime.toLocaleString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`alarm-toggle-${alarm.id}`}
                                checked={isEnabled}
                                onChange={toggleAlarm}
                                style={{ width: '3rem', height: '1.5rem' }}
                            />
                            <label className="form-check-label visually-hidden" htmlFor={`alarm-toggle-${alarm.id}`}>
                                {isEnabled ? 'Alarm On' : 'Alarm Off'}
                            </label>
                        </div>
                    </div>

                    {/* Checklist */}
                    {alarm.checklist && alarm.checklist.length > 0 && (
                        <div className="mt-3 bg-white p-3 rounded">
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-list-check me-2"></i>
                                <strong>Checklist</strong>
                            </div>
                            <ul className="list-group list-group-flush">
                                {alarm.checklist.map((item, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom"
                                        style={{ backgroundColor: 'transparent' }}
                                    >
                                        <span
                                            className={`me-2 ${checkedItems[alarm.id]?.includes(item)
                                                ? 'text-decoration-line-through text-muted'
                                                : ''
                                                }`}
                                        >
                                            {item}
                                        </span>
                                        <Button
                                            variant={checkedItems[alarm.id]?.includes(item) ? "outline-secondary" : "outline-success"}
                                            size="sm"
                                            className="rounded-circle"
                                            style={{ width: '30px', height: '30px', padding: '0' }}
                                            onClick={() => handleCheck(alarm.id, item)}
                                        >
                                            <i
                                                className={`bi ${checkedItems[alarm.id]?.includes(item)
                                                    ? 'bi-x-lg'
                                                    : 'bi-check-lg'
                                                    }`}
                                            ></i>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};