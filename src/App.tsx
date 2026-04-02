import {
  CameraKitProvider,
  LensPlayer,
  LiveCanvas,
  useCameraKit,
} from '@snap/react-camera-kit';
import { useEffect, useState } from 'react';

const LENS_GROUP_ID = 'a4da2ba5-6d01-441f-942a-99b9a0143fd6';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzc1MDU5Mjc2LCJzdWIiOiJmN2U5ODBjNC00ODhhLTRkZWMtOWM3NS1jODU4NDIzZTZhODh-U1RBR0lOR345NmU2Y2MwNS1mMzI5LTQyZjUtODU5Zi1iOGYzZjNlZWQyYmQifQ._tPEEnmGU12iavp6NgZ_elyKERRQWkMS_6nBwhnw8h0';

function LensSwitcher() {
  const {
    sdkStatus,
    lenses,
    lens,
    fetchLenses,
    applyLens,
    isMuted,
    toggleMuted,
  } = useCameraKit();

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    if (sdkStatus === 'ready') {
      fetchLenses(LENS_GROUP_ID);
      loadCameras();
    }
  }, [sdkStatus]);

  const loadCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error loading cameras:', error);
    }
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
  };

  return (
    <div>
      <select
        value={selectedCamera}
        onChange={(e) => handleCameraChange(e.target.value)}
      >
        <option value="" disabled>
          Select a Camera
        </option>
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
          </option>
        ))}
      </select>

      <select
        value={lens.lensId ?? ''}
        onChange={(e) => applyLens(e.target.value, LENS_GROUP_ID)}
      >
        <option value="" disabled>
          Select a Lens
        </option>
        {lenses.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      <button onClick={toggleMuted}>{isMuted ? 'Unmute' : 'Mute'}</button>

      <LensPlayer lensId={lens.lensId} lensGroupId={LENS_GROUP_ID}>
        <LiveCanvas style={{ width: '100%', maxWidth: 640 }} />
      </LensPlayer>
    </div>
  );
}

export default function App() {
  return (
    <CameraKitProvider apiToken={API_TOKEN}>
      <LensSwitcher />
    </CameraKitProvider>
  );
}

