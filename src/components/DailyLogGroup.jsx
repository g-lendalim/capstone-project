import { Card, Accordion } from 'react-bootstrap';
import LogEntryCard from './LogEntryCard';

export default function DailyLogGroup({
    date,
    entries,
    formatDateTime,
    getMoodLabel,
    getMoodColor,
    getMoodDescription,
    getMoodEmoji,
    getPhysicalActivityLabel,
    getSocialInteractionLabel,
    renderMetric,
    onEdit,
    onDelete
}) {
    // Sort entries by time (newest first)
    const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return (
        <Card
            className="mb-5 shadow-sm border-0 overflow-hidden journal-card"
            style={{
                borderRadius: '16px',
                backgroundColor: '#fcfcfd'
            }}
        >
            <Card.Header
                className="d-flex justify-content-between align-items-center py-3"
                style={{
                    backgroundColor: "rgba(240, 247, 255, 0.5)",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                }}
            >
                <div className="d-flex align-items-center">
                    <i className="bi bi-calendar-week text-info me-2" style={{ fontSize: '1.2rem' }}></i>
                    <div>
                        <h5 className="mb-0">{date}</h5>
                        <small>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</small>
                    </div>
                </div>
            </Card.Header>

            <Accordion defaultActiveKey={entries[0]?.id.toString()}>
                {sortedEntries.map(entry => (
                    <LogEntryCard
                        key={entry.id}
                        entry={entry}
                        formatDateTime={formatDateTime}
                        getMoodLabel={getMoodLabel}
                        getMoodColor={getMoodColor}
                        getMoodDescription={getMoodDescription}
                        getMoodEmoji={getMoodEmoji}
                        getPhysicalActivityLabel={getPhysicalActivityLabel}
                        getSocialInteractionLabel={getSocialInteractionLabel}
                        renderMetric={renderMetric}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isAccordionItem={true}
                    />
                ))}
            </Accordion>
        </Card>
    );
};