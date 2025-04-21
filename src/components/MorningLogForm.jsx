import { Form } from "react-bootstrap";
      
export default function MorningLogForm({ coreLogs, setCoreLogs, setExtendedLogs, handleImageUpload }) {
    return (    
        <>
          <Form.Group className="mb-3">
            <Form.Label>🧠 How would you rate your mood this morning?</Form.Label>
            <Form.Range
              min={0}
              max={10}
              value={coreLogs.mood}
              onChange={(e) =>
                setCoreLogs({ ...coreLogs, mood: parseInt(e.target.value) })
              }
            />
            <div>Mood: {coreLogs.mood}/10</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>⚡ Energy level (1–10)</Form.Label>
            <Form.Range
              min={1}
              max={10}
              value={coreLogs.energy_level}
              onChange={(e) =>
                setCoreLogs({ ...coreLogs, energy_level: parseInt(e.target.value) })
              }
            />
            <div>Energy: {coreLogs.energy_level}/10</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>😴 How many hours did you sleep?</Form.Label>
            <Form.Control
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={coreLogs.sleep_log.sleep_hours}
              onChange={(e) =>
                setCoreLogs({
                  ...coreLogs,
                  sleep_log: {
                    ...coreLogs.sleep_log,
                    sleep_hours: parseFloat(e.target.value)
                  }
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>🌙 How would you rate your sleep quality?</Form.Label>
            <Form.Range
              min={0}
              max={10}
              value={coreLogs.sleep_log.sleep_quality}
              onChange={(e) =>
                setCoreLogs({
                  ...coreLogs,
                  sleep_log: {
                    ...coreLogs.sleep_log,
                    sleep_quality: parseInt(e.target.value)
                  }
                })
              }
            />
            <div>Quality: {coreLogs.sleep_log.sleep_quality}/10</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>🔄 Did you wake up during the night?</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={coreLogs.sleep_log.night_awakenings}
              onChange={(e) =>
                setCoreLogs({
                  ...coreLogs,
                  sleep_log: {
                    ...coreLogs.sleep_log,
                    night_awakenings: parseInt(e.target.value)
                  }
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>📸 Upload a photo or image that represents your morning</Form.Label>
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
    );
}