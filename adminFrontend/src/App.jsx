import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useAuthContext } from './contexts/AuthProvider';
import { useEffect } from 'react';
import { TOKEN_STATE, useCheckToken } from './hooks/useCheckToken';
import PageNotFound from './pages/PageNotFound';
import LoadingScreen from './components/LoadingScreen';
import ConditionalRoute from './components/ConditionalRoute';
import { Collections } from './components/Collections'
import { CollectionForm } from './components/CollectionForm'
import { CollectionItemForm } from './components/CollectionItemForm'
import { CollectionItems } from './components/CollectionItems'
import { DashboardIndex } from './components/DashboardIndex'
import { useUserContentContext } from './contexts/UserContentProvider';
import StatusMessage from './components/StatusMessage';

function App() {
  const { isCheckingToken, isTokenValid, retryCheckToken } = useCheckToken();
  const { token, setStartTokenCheck } = useAuthContext();
  const { statusMessageQueue } = useUserContentContext()

  useEffect(() => {
    retryCheckToken()
  }, [token])

  // this handles starting the token check timer either when user uses the login route or is auto logged in with a still-valid token 
  useEffect(() => {
    if (isTokenValid === TOKEN_STATE.VALID) {
      setStartTokenCheck(true)
    }
  }, [isTokenValid])

  return (
    <>
      <div style={{ position: 'fixed', top: '0.5rem', left: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '50vh', overflowY: 'auto', padding: '0.5rem', zIndex: '200' }}>
        {statusMessageQueue.map(sMessage => <StatusMessage key={sMessage.id} message={sMessage.message} status={sMessage.status} />)}
      </div>
      <Routes>
        <Route path='/' element={(isCheckingToken === true || isTokenValid === TOKEN_STATE.NOT_SET_YET) ? <LoadingScreen /> : isTokenValid === TOKEN_STATE.VALID ? <Navigate to='/dashboard/collections' /> : <Navigate to='/login' />} />

        <Route path='/login' element={
          isCheckingToken === true ? <LoadingScreen /> : (
            <ConditionalRoute renderIf={isTokenValid === TOKEN_STATE.INVALID} go={{ to: '/dashboard/collections', if: isTokenValid === TOKEN_STATE.VALID }}>
              <Login />
            </ConditionalRoute>
          )} />

        <Route path="/dashboard/collections" element={
          isCheckingToken === true ? <LoadingScreen /> : (
            <ConditionalRoute renderIf={isTokenValid === TOKEN_STATE.VALID}
              go={{ to: '/login', if: isTokenValid === TOKEN_STATE.INVALID }}
            >
              <Dashboard isTokenValid={isTokenValid} />
            </ConditionalRoute>)
        }>
          <Route path='' element={<DashboardIndex />}>
            <Route path='' element={<Collections />}>
              <Route path='new' element={<CollectionForm />} />
              <Route path='edit/:collectionId' element={<CollectionForm />} />

              <Route path=':collectionId' element={<CollectionItems />}>
                <Route path='new' element={<CollectionItemForm />} />
                <Route path="edit/:itemId" element={<CollectionItemForm />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path='*' element={<PageNotFound />} />

      </Routes >
    </>
  );
}

export default App;
