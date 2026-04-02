import {
  CameraKitProvider,
  LensPlayer,
  useCameraKit,
} from '@snap/react-camera-kit';
import { useEffect, useState, useMemo } from 'react';
import { getPlatformInfo } from "@snap/camera-kit/utils";


const LENS_GROUP_ID = 'a4da2ba5-6d01-441f-942a-99b9a0143fd6';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzc1MDU5Mjc2LCJzdWIiOiJmN2U5ODBjNC00ODhhLTRkZWMtOWM3NS1jODU4NDIzZTZhODh-U1RBR0lOR345NmU2Y2MwNS1mMzI5LTQyZjUtODU5Zi1iOGYzZjNlZWQyYmQifQ._tPEEnmGU12iavp6NgZ_elyKERRQWkMS_6nBwhnw8h0';

function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="status-row">
      <span className="status-label">{label}</span>
      <span className={`status-badge status-${value}`}>{value}</span>
    </div>
  );
}


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

  const diagnostics = useMemo(() => {
    const secureContext = typeof window !== "undefined" ? window.isSecureContext : false;
    const hasMediaDevices = typeof navigator !== "undefined" && !!navigator.mediaDevices;

  return {
    secureContext,
    hasMediaDevices,
    cameraKitVersion: getPlatformInfo().sdkLongVersion,
  };
  }, []);

  useEffect(() => {
    if (sdkStatus === 'ready') {
      fetchLenses(LENS_GROUP_ID);
    }
  }, [sdkStatus]);

  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');

  

  return (
    <section className = "workspace">      
      <aside className="panel">
        <section className="card">
          <h2>Controls</h2>
          <label className="field-label" htmlFor="lens-select">
            Lens to Apply
          </label>
          <div className="select-row">
            <select
              value={lens.lensId ?? ''}
              onChange={(e) => applyLens(e.target.value, LENS_GROUP_ID)}>
              <option value="" disabled>
                Select a Lens
              </option>
              {lenses.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          
          <label className="field-label" htmlFor="lens-select">
            Select Camera
          </label>
          < div className='select-row'>
            <select
              value={cameraFacing}
              onChange={(e) => setCameraFacing(e.target.value as 'user' | 'environment')} >
              <option value="user">Front Camera</option>
              <option value="environment">Back Camera</option>
            </select>          
          </div>

          <div className="button-grid">
            <button onClick={toggleMuted}>{isMuted ? 'Unmute' : 'Mute'}</button>
          </div>
        </section>
        <section className="card">
          <h2>Status</h2>
          {/* <StatusBadge label="SDK" value={sdkStatus} />
          <StatusBadge label="Source" value={source.status} />
          <StatusBadge label="Lens" value={lens.status} /> */}
        </section>
        <section className="card">
          <h2>Diagnostics</h2>
          <StatusBadge label="Camera Kit Version" value={diagnostics.cameraKitVersion} />
          <StatusBadge label="Secure context" value={diagnostics.secureContext ? "yes" : "no"} />
          <StatusBadge label="mediaDevices" value={diagnostics.hasMediaDevices ? "available" : "missing"} />
          {!diagnostics.secureContext && <p className="warning">Camera APIs require HTTPS on iOS/mobile browsers.</p>}
        </section>
  


      </aside>







        <section className = 'stage' > 
          <LensPlayer 
            lensId={lens.lensId} 
            lensGroupId={LENS_GROUP_ID}
            source={{ kind: 'camera', options: { cameraFacing: cameraFacing } }}
            className="canvas"
            >
            {/* <LiveCanvas style={{ width: '50%', maxWidth: 240 }} /> */}
          </LensPlayer>
        </section>

      
    </section>
    
  );
}

export default function App() {
  return (
    <CameraKitProvider apiToken={API_TOKEN}>
      <LensSwitcher />
    </CameraKitProvider>
  );
}

