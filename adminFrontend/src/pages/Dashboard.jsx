import React from 'react';
import { useAuthContext } from '../contexts/AuthProvider';
import { Outlet } from 'react-router-dom';
import CountdownToLogout from '../components/CountdownToLogout';

function Dashboard({ isTokenValid }) {
  // accessing some global state from appropriate contexts
  const { adminUsername, logoutAdmin, isOnline, setShowCountdown, showCountdown } = useAuthContext();

  return (
    <>
      {showCountdown === true && (
        <CountdownToLogout hide={() => setShowCountdown(false)} />
      )}


      <header style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <p>{adminUsername}</p>
          <button
            style={{
              backgroundColor: 'var(--primary-clr)',
              color: 'var(--secondary-clr-dark)',
              outline: '1px solid var(--secondary-clr)',
            }}
            onClick={logoutAdmin}
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        {isOnline === false && (
          <div
            style={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              right: '1rem',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                backgroundColor: 'var(--error-clr)',
                borderRadius: '1rem',
                fontSize: '1rem',
                paddingInline: '2rem',
                paddingBlock: '1rem',
                color: 'var(--primary-clr)',
                fontWeight: '700',
              }}
            >
              Oops, you're offline. Check your Internet!
            </p>
          </div>
        )}
       
        <Outlet />
      </main>
    </>
  );
}

export default Dashboard;
