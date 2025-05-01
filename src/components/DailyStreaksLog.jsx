import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card } from 'react-bootstrap';

export default function DailyStreaksLog({ userId }) {
    const [weekData, setWeekData] = useState([]);
    const [streakCount, setStreakCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeekStreak = async () => {
            setLoading(true);
            try {
                // Using the existing timeline endpoint
                const response = await api.get(`/timeline/${userId}`);

                // Check if response has the expected structure
                if (response.data && Array.isArray(response.data.weeklyData)) {
                    setWeekData(response.data.weeklyData);
                    setStreakCount(response.data.currentStreak || 0);
                } else {
                    console.warn("Response format doesn't match expected structure", response.data);

                    const emptyWeekData = [];
                    const today = new Date();
                    const currentDay = today.getDay(); // 0 is Sunday, 6 is Saturday
                    const sunday = new Date(today);
                    sunday.setDate(today.getDate() - currentDay);

                    // Create weeklyData array with default values
                    for (let i = 0; i < 7; i++) {
                        const date = new Date(sunday);
                        date.setDate(sunday.getDate() + i);

                        emptyWeekData.push({
                            dayIndex: i,
                            date: date.toISOString().split('T')[0],
                            dayName: date.toLocaleString('en-US', { weekday: 'short' }),
                            hasLog: false
                        });
                    }

                    setWeekData(emptyWeekData);
                }
            } catch (error) {
                console.error("Error fetching weekly streak data:", error);
                setWeekData([]);
                setStreakCount(0);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchWeekStreak();
        }
    }, [userId]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div>
            <div className="section-header d-flex align-items-center mb-3" style={{ color: "#5a6e8c" }}>
                <i className="bi bi-calendar-check me-2"></i>
                <h5 className="mb-0">Weekly Streaks</h5>
                {streakCount > 0 && (
                    <span className="badge bg-success ms-2">{streakCount} day streak</span>
                )}
            </div>

            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body className="py-3">
                    {loading ? (
                        <div className="text-center py-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between">
                                {dayNames.map((day, index) => {
                                    const dayData = weekData.find(d => d.dayIndex === index);
                                    const hasStreak = dayData && dayData.hasLog;

                                    return (
                                        <div key={index} className="text-center" style={{ width: '14%' }}>
                                            <div className="mb-2">{day}</div>
                                            <div
                                                className="streak-indicator mx-auto"
                                                style={{
                                                    height: '4px',
                                                    backgroundColor: hasStreak ? '#4CAF50' : '#e0e0e0',
                                                    width: '80%',
                                                    borderRadius: '2px'
                                                }}
                                            ></div>
                                            {hasStreak && (
                                                <div className="mt-2">
                                                    <i className="bi bi-check-circle-fill text-success"></i>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}