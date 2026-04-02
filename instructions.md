React Camera Kit
@snap/react-camera-kit is the official React wrapper for the Camera Kit Web SDK. Instead of managing SDK bootstrapping, sessions, and sources imperatively, you get declarative React components and hooks that handle the lifecycle for you.
If you're new to Camera Kit, start with Setting Up Accounts and the Web SDK Setup guide first.
Prerequisites​

A Camera Kit API token and at least one Lens (from the Snap Developer Portal)
React 16.8+ (hooks support)
Deployed apps require https:// for production, but http://localhost works for local development

Installation​
Install the React wrapper alongside the core Camera Kit Web SDK:
npm install @snap/react-camera-kit @snap/camera-kit
Requires @snap/camera-kit ^1.13.0.
Quick start​
The simplest way to get a Lens running is with CameraKitProvider and LensPlayer:
import { CameraKitProvider, LensPlayer } from '@snap/react-camera-kit';function App() {  return (    <CameraKitProvider apiToken="YOUR_API_TOKEN">      <LensPlayer lensId="YOUR_LENS_ID" lensGroupId="YOUR_LENS_GROUP_ID" />    </CameraKitProvider>  );}
CameraKitProvider initializes the SDK and provides context to all child components. LensPlayer sets up the camera source, applies the Lens, and renders the output canvas automatically.
Using different media sources​
By default, LensPlayer uses the user's camera. You can specify a different source via the source prop:
// Back camera<LensPlayer  source={{ kind: 'camera', options: { cameraFacing: 'environment' } }}  lensId="YOUR_LENS_ID"  lensGroupId="YOUR_LENS_GROUP_ID"/>// Video file<LensPlayer  source={{ kind: 'video', url: '/my-video.mp4', autoplay: true }}  lensId="YOUR_LENS_ID"  lensGroupId="YOUR_LENS_GROUP_ID"/>// Image<LensPlayer  source={{ kind: 'image', url: '/my-image.jpg' }}  lensId="YOUR_LENS_ID"  lensGroupId="YOUR_LENS_GROUP_ID"/>
Custom canvas layout​
Camera Kit renders to two canvases: live for the Lens user and capture for presenting to others. Use LiveCanvas and CaptureCanvas to control their layout:
<LensPlayer lensId="YOUR_LENS_ID" lensGroupId="YOUR_LENS_GROUP_ID">  <div className="preview">    <LiveCanvas style={{ width: '100%' }} />  </div>  <div className="capture">    <CaptureCanvas style={{ width: '100%' }} />  </div></LensPlayer>
Building custom UI with hooks​
When you need more control over switching between Lenses, toggling mute, or displaying loading states, use the useCameraKit hook:
import {  CameraKitProvider,  LensPlayer,  LiveCanvas,  useCameraKit,} from '@snap/react-camera-kit';import { useEffect } from 'react';const LENS_GROUP_ID = 'YOUR_LENS_GROUP_ID';function LensSwitcher() {  const {    sdkStatus,    lenses,    lens,    fetchLenses,    applyLens,    isMuted,    toggleMuted,  } = useCameraKit();  useEffect(() => {    if (sdkStatus === 'ready') {      fetchLenses(LENS_GROUP_ID);    }  }, [sdkStatus]);  return (    <div>      <select        value={lens.lensId ?? ''}        onChange={(e) => applyLens(e.target.value, LENS_GROUP_ID)}      >        <option value="" disabled>          Select a Lens        </option>        {lenses.map((l) => (          <option key={l.id} value={l.id}>            {l.name}          </option>        ))}      </select>      <button onClick={toggleMuted}>{isMuted ? 'Unmute' : 'Mute'}</button>      <LensPlayer lensId={lens.lensId} lensGroupId={LENS_GROUP_ID}>        <LiveCanvas style={{ width: '100%', maxWidth: 640 }} />      </LensPlayer>    </div>  );}export default function App() {  return (    <CameraKitProvider apiToken="YOUR_API_TOKEN">      <LensSwitcher />    </CameraKitProvider>  );}Show more▼
More hooks give you declarative control over individual aspects of the pipeline:

useApplyLens(lensId, groupId)—applies or removes a Lens when parameters change
useApplySource(source, outputSize)—applies a media source
usePlaybackOptions({ fpsLimit, muted, onError })—sets playback options

Handling loading and error states​
The SDK, source, and Lens each have a status that progresses through "none" → "loading" → "ready" or "error". Use useCameraKit() to build status-aware UI:
function Preview() {  const { sdkStatus, sdkError, source, lens } = useCameraKit();  if (sdkStatus === 'error')    return <p>SDK failed to load: {sdkError?.message}</p>;  if (sdkStatus !== 'ready') return <p>Initializing...</p>;  if (source.status === 'loading') return <p>Setting up camera...</p>;  if (lens.status === 'error') return <p>Lens error: {lens.error?.message}</p>;  return (    <LensPlayer lensId="YOUR_LENS_ID" lensGroupId="YOUR_LENS_GROUP_ID">      {lens.status !== 'ready' && <div className="spinner" />}      <LiveCanvas />    </LensPlayer>  );}
Next steps​

See the full API reference for all component props, hook parameters, and exported types
Try the live demo
Browse the source code and demo app for more examples
Learn about Lens and Camera Selectors
Explore the Remote API for sending data to Lenses in real time
Read the Web SDK Setup guide for lower-level SDK configuration
