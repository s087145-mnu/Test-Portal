// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useMockSync } from './sync';
import { Lock, X, Send, Check } from 'lucide-react';

if (typeof AFRAME !== 'undefined' && !AFRAME.components['pin-click']) {
  AFRAME.registerComponent('pin-click', {
    init: function () {
      this.el.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-pin', { detail: this.el.id }));
      });
    }
  });
}

export default function Explorer() {
  const { portalState, updatePortalState } = useMockSync('explorer');
  const [activePin, setActivePin] = useState(null);
  const [myQuestion, setMyQuestion] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      const pin = portalState.hotspots?.find(p => p.id === e.detail);
      if (pin) {
        setActivePin(pin);
        setSent(false);
      }
    };
    window.addEventListener('open-pin', handleOpen);
    return () => window.removeEventListener('open-pin', handleOpen);
  }, [portalState.hotspots]);

  // FIX: This now safely checks if the questions list exists before adding to it!
  const submitQuestion = () => {
    if (myQuestion.trim() === "") return;
    
    const existingQuestions = portalState.questions || [];
    
    updatePortalState({
      questions: [...existingQuestions, { id: Math.random(), text: myQuestion, pinTitle: activePin.title }]
    });
    
    setMyQuestion("");
    setSent(true);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      
      <a-scene embedded cursor="rayOrigin: mouse" raycaster="objects: .clickable" style={{ position: 'absolute', height: '100%', width: '100%', zIndex: 1 }}>
        <a-sky src={portalState.activeSkybox} rotation="0 -130 0"></a-sky>
        <a-camera position="0 1.6 0" look-controls="pointerLockEnabled: false"></a-camera>
        
        {portalState.hotspots?.map((pin) => (
          <a-entity key={pin.id} id={pin.id} position={pin.position} geometry="primitive: sphere; radius: 0.3" material="color: #ef4444" class="clickable" pin-click animation="property: position; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true; to: 0 1.7 -4"></a-entity>
        ))}
      </a-scene>

      {activePin && !portalState.isLocked && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', color: 'black', padding: '30px', borderRadius: '15px', zIndex: 60, width: '80%', maxWidth: '400px', fontFamily: 'sans-serif', boxShadow: '0px 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>{activePin.title}</h2>
            <X style={{ cursor: 'pointer' }} onClick={() => setActivePin(null)} />
          </div>
          <p style={{ color: '#666', marginBottom: '20px' }}>{activePin.description}</p>
          <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1d4ed8' }}>So What?</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#1e3a8a' }}>{activePin.soWhat}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder={sent ? "Check the Admin screen!" : "Ask the Admin a question..."}
              value={myQuestion}
              onChange={(e) => setMyQuestion(e.target.value)}
              disabled={sent}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <button onClick={submitQuestion} disabled={sent} style={{ padding: '10px 15px', display: 'flex', gap: '5px', alignItems: 'center', backgroundColor: sent ? '#22c55e' : 'black', color: 'white', border: 'none', borderRadius: '6px', cursor: sent ? 'default' : 'pointer' }}>
              {sent ? <Check size={18} /> : <Send size={18} />}
              {sent ? "Sent!" : ""}
            </button>
          </div>
        </div>
      )}

      {portalState.isLocked && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(15px)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
          <Lock size={64} style={{ marginBottom: '20px' }} />
          <h2>Knowledge Gap Active</h2>
        </div>
      )}
    </div>
  );
}