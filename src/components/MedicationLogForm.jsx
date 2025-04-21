import { Form } from 'react-bootstrap';

export default function MedicationLogForm({
  coreLogs,
  setCoreLogs,
  extendedLogs,
  setExtendedLogs,
  handleImageUpload,
}) {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="✅ I took my medication"
          checked={coreLogs.medication_taken}
          onChange={(e) =>
            setCoreLogs({ ...coreLogs, medication_taken: e.target.checked })
          }
        />
      </Form.Group>

      {coreLogs.medication_taken && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>💬 Optional notes about your medication</Form.Label>
            <Form.Control
              type="text"
              placeholder="E.g., new dosage, side effects, skipped dose yesterday..."
              value={extendedLogs.medication_details}
              onChange={(e) =>
                setExtendedLogs({
                  ...extendedLogs,
                  medication_details: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              📸 Upload a photo (e.g., your medication or pill organizer)
              <span className="text-muted d-block" style={{ fontSize: "0.9em" }}>
                Optional – just if it helps you remember or reflect
              </span>
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = await handleImageUpload(file);
                  setExtendedLogs((prev) => ({
                    ...prev,
                    image_url: url,
                  }));
                }
              }}
            />
          </Form.Group>
        </>
      )}
    </>
  );
}
