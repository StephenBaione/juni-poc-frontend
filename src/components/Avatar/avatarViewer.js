import { OrbitControls, useTexture, Stage, OrthographicCamera, Loader, Environment } from "@react-three/drei";

import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";

import ReactAudioPlayer from "react-audio-player";

import { Model } from "./Asian_female";
import { Suzanne } from "./Model";
import { AsianModel2 } from "./Try2";

import { Grid } from "@mui/material";

import ChatMenu from "../ChatScreen/ChatMenu";

import { useSelector } from "react-redux";

import theme from "../../Theme";

const STYLES = {
  area: { position: 'absolute', bottom: '10px', left: '10px', zIndex: 500 },
  text: { margin: '0px', width: '300px', padding: '5px', background: 'none', color: '#ffffff', fontSize: '1.2em', border: 'none' },
  speak: { padding: '10px', marginTop: '5px', display: 'block', color: '#FFFFFF', background: theme.palette.avatarScreen.speakBackground, border: 'None' },
  area2: { position: 'absolute', top: '5px', right: '15px', zIndex: 500 },
  label: { color: theme.palette.avatarScreen.label, fontSize: '0.8em' }
}

export default function AvatarViewer() {
  const audioPlayer = useRef();

  const showMenu = useSelector(state => state.display.showMenu);

  const [text, setText] = useState('');
  const [speak, setSpeak] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [playing, setPlaying] = useState(false);

  const playerEnded = (e) => {
    setAudioSource(null);
    setSpeak(false);
    setPlaying(false);
  }

  const playerReady = (e) => {
    audioPlayer.current.audioEl.current.play();
    setPlaying(true);
  }

  return (
    <div
      style={{
        'height': '1000px',
        background: theme.palette.avatarScreen.background,
        fontWeight: 'bold',
      }}
    >
      {
        showMenu &&
        <ChatMenu />
      }

      {/* Chat */}
      <div style={STYLES.area}>
        <textarea rows={20} type="text" style={STYLES.text} value={text} onChange={(e) => setText(e.target.value.substring(0, 1000))} />
        <button onClick={() => setSpeak(true)} style={STYLES.speak}> {speak ? 'Running...' : 'Speak'}</button>
      </div>

      {/* Audio Player */}
      <ReactAudioPlayer
        ref={audioPlayer}
        src={audioSource}
        onEnded={playerEnded}
        onCanPlayThrough={playerReady}
      />

      {/* Avatar Scene */}
      <Canvas
        dpr={2}
        onCreated={(ctx) => { ctx.gl.physicallyCorrectLights = true; }}
        style={{
          height: '100vh',
          width: '100vw'
        }}
      >
        <OrthographicCamera
          makeDefault
          zoom={400}
          position={[0, 0, 200]}
        />

        <Suspense fallback={null}>
          <Environment background={false} files="/images/photo_studio_loft_hall_1k.hdr" />
        </Suspense>

        <Suspense fallback={null}>
          <Suzanne 
            speak={speak}
            setSpeak={setSpeak}
            setAudioSource={setAudioSource}
            text={text}
            playing={playing}
          />
        </Suspense>

        <OrbitControls />
      </Canvas>
      <Loader dataInterpolation={(p) => `Loading... please wait`} />
    </div>
  )
}