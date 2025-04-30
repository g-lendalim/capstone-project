import { Card, Button } from "react-bootstrap";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateLog, deleteLog } from '../features/logs/logsSlice';
import UpdateLogModal from './UpdateLogModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import DailyLogGroup from "./DailyLogGroup";

export default function MoodJournal({
    logs,
    getMoodLabel,
    getMoodColor,
    getMoodDescription,
    getMoodEmoji,
    getPhysicalActivityLabel,
    getSocialInteractionLabel,
    renderMetric
}) {
    const dispatch = useDispatch();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [selectedLogId, setSelectedLogId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const formattedTime = date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        });

        return { formattedDate, formattedTime };
    };

    const handleOpenUpdateModal = (log) => {
        setSelectedLog(log);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedLog(null);
    };

    const handleUpdateLog = async (logId, newLogContent, newFile) => {
        try {
            await dispatch(updateLog({ logId, newLogContent, newFile })).unwrap();
            console.log("Log updated successfully!");
            handleCloseUpdateModal();
        } catch (error) {
            console.error("Failed to update log", error);
        }
    };

    const handleOpenDeleteModal = (logId) => {
        setSelectedLogId(logId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedLogId(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedLogId) return;
        await dispatch(deleteLog(selectedLogId));
        handleCloseDeleteModal();
    };

    // Group logs by date
    const groupLogsByDate = () => {
        const groups = {};

        logs.forEach(log => {
            const date = new Date(log.created_at);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            const { formattedDate } = formatDateTime(log.created_at);

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    displayDate: formattedDate,
                    entries: []
                };
            }

            groups[dateKey].entries.push(log);
        });

        // Convert to array and sort by date (newest first)
        return Object.entries(groups)
            .map(([key, value]) => ({
                dateKey: key,
                ...value
            }))
            .sort((a, b) => new Date(b.dateKey) - new Date(a.dateKey));
    };

    const groupedLogs = groupLogsByDate();

    return (
        <>
            {logs.length === 0 ? (
                <Card className="text-center py-5 shadow-sm border-0" style={{ backgroundColor: "#f8f9fa" }}>
                    <Card.Body>
                        <i className="bi bi-journal-plus" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                        <h4 className="mt-3">Your journey begins here</h4>
                        <p className="text-muted">
                            Recording your thoughts and feelings is the first step toward greater self-awareness.
                        </p>
                        <Button variant="info" className="rounded-pill text-white">
                            <i className="bi bi-plus-lg me-1"></i>
                            Create Your First Mood Journal
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <div className="journal-entries">
                    {groupedLogs.map(group => (
                        <DailyLogGroup
                            key={group.dateKey}
                            date={group.displayDate}
                            entries={group.entries}
                            formatDateTime={formatDateTime}
                            getMoodLabel={getMoodLabel}
                            getMoodColor={getMoodColor}
                            getMoodDescription={getMoodDescription}
                            getMoodEmoji={getMoodEmoji}
                            getPhysicalActivityLabel={getPhysicalActivityLabel}
                            getSocialInteractionLabel={getSocialInteractionLabel}
                            renderMetric={renderMetric}
                            onEdit={handleOpenUpdateModal}
                            onDelete={handleOpenDeleteModal}
                        />
                    ))}
                </div>
            )}

            <UpdateLogModal
                show={showUpdateModal}
                onHide={handleCloseUpdateModal}
                logData={selectedLog}
                onUpdate={handleUpdateLog}
            />

            <ConfirmDeleteModal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                onConfirm={handleDelete}
            />
        </>
    );
}