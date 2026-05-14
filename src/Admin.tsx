// @ts-nocheck
import React from 'react';
import { useMockSync } from './sync';
import { Eye, EyeOff, MapPin, MessageCircle } from 'lucide-react';

export default function Admin() {
  const { portalState, updatePortalState } = useMockSync('admin');

  const toggleLock = () => updatePortalState({ isLocked: !portalState.isLocked });

  const dropPin = () => {
    updatePortalState({
      hotspots: [{ id: 'pin1', position: '0 1.5 -4', title: 'The Mountain Peak', description: 'This is a dormant volcano.', soWhat: 'By looking at this peak, we understand the geological history of the region.' }]
    });
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#111', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Admin Console</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={{ padding: '20px', backgroundColor: '#222', borderRadius: '10px', flex: '1 1 300px' }}>
          <h2>Knowledge Gap</h2>
          <button onClick={toggleLock} style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center', width: '100%', backgroundColor: portalState.isLocked ? '#ff4444' : 'white', color: portalState.isLocked ? 'white' : 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            {portalState.isLocked ? <EyeOff /> : <Eye />}
            {portalState.isLocked ? "Unlock Portal" : "Trigger Knowledge Gap"}
          </button>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#222', borderRadius: '10px', flex: '1 1 300px' }}>
          <h2>Environment Pins</h2>
          <button onClick={dropPin} style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center', width: '100%', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            <MapPin /> Drop Interpretation Pin
          </button>
        </div>
      </div>

      {/* NEW: The Question Inbox! */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#222', borderRadius: '10px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MessageCircle /> Student Questions ({portalState.questions?.length || 0})</h2>
        
        {portalState.questions?.length === 0 ? (
          <p style={{ color: '#666' }}>No questions yet. Wait for students to interact with pins.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {portalState.questions?.map((q) => (
              <div key={q.id} style={{ padding: '15px', backgroundColor: '#333', borderRadius: '8px', borderLeft: '4px solid #a855f7' }}>
                <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase' }}>Regarding: {q.pinTitle}</span>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>"{q.text}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}