import React, { useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AUTH_URL_BASE } from '../utils/baseURL';
import { useSessionStorage } from '../hooks/useSessionStorage';

const AuthContext = React.createContext();
export const useAuthContext = () => {
  return React.useContext(AuthContext);
};

const ADMIN_USER_TOKEN_KEY = 'adminUserToken';
const ADMIN_USERNAME_KEY = 'adminUsername';
const JWT_EXPIRED = 'jwt expired'

function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage(ADMIN_USER_TOKEN_KEY, '');
  const [adminUsername, setAdminUsername] = useSessionStorage(ADMIN_USERNAME_KEY, '');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [startTokenCheck, setStartTokenCheck] = useState(false)
  const [timerId, setTimerId] = useState("")
  const [showCountdown, setShowCountdown] = useState(false)
  const [aboutToExpireCount, setAboutToExpireCount] = useState(0)

  function logoutAdmin() {
    setStartTokenCheck(false)
    setToken('');
    resetTokenChecker();
  }


  function resetTokenChecker() {
    setAboutToExpireCount(0)
    setShowCountdown(false)
    setTimerId("")
  }

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    // Listen to the online status
    window.addEventListener('online', handleStatusChange);

    // Listen to the offline status
    window.addEventListener('offline', handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  // effect used to manage the timer that periodically checks for token 
  //  startTokenCheck is the primary state that controls if we get to initiate checking of the token or not
  useEffect(() => {
    // make sure we are clear to start token check and that there is no timer running already
    if (startTokenCheck === true) {
      if (timerId === '') {
        setTimerId(
          setInterval(async () => {
            const response = await checkTokenAboutToExpire();
            // Ensures we run setShowCountdown(true) just once even if the server tells us everytime that token is about to expire
            if (aboutToExpireCount === 0) {
              if (response.success === true) {
                if (response.aboutToExpire === true) {
                  setAboutToExpireCount((prev) => prev + 1)
                  setShowCountdown(true)
                }
              } else {
                if (response.message === JWT_EXPIRED) {
                  logoutAdmin();
                }
              }
            }
          }, 5000)
        )
      }
    } else {
      if (timerId !== '') {
        clearTimer();
        return;
      }
    }

    function clearTimer() {
      clearInterval(timerId);
      setTimerId("")
    }

    // makes sure the interval is reset everytime aboutToExpireCount changes so that the callback of setInterval() can use the most up to date version of aboutToExpireCount
    return function () {
      if (timerId !== '') {
        clearTimer();
      }
    }
  }, [startTokenCheck, timerId, aboutToExpireCount])

  const getAdminInfo = async () => {
    try {
      const data = await (
        await fetch(AUTH_URL_BASE + '/@me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
      ).json();

      if (data.success) {
        setAdminUsername(data.data.admin.username);
      }
      return data;
    } catch (err) {
      return { success: false };
    }
  };


  const checkTokenAboutToExpire = async () => {
    try {
      const data = await (
        await fetch(AUTH_URL_BASE + '/checkToken', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
      ).json();
      return data;
    } catch (err) {
      if (err === "jwt expired") {
        return { success: false, message: JWT_EXPIRED }
      } else {
        return { success: false };
      }
    }
  };

  //  get a new token to replace the old one before it expires
  async function refreshToken() {
    try {
      const data = await (
        await fetch(AUTH_URL_BASE + '/signNewToken', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
      ).json();

      return data;
    } catch (err) {
      return { success: false, message: err }
    }
  }

  async function attemptLogin({ username, password }) {
    try {
      const response = await fetch(AUTH_URL_BASE + '/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();
      if (result.success === true) {
        setAdminUsername(result.data.admin.username)
        // once this is set, the effect in App.jsx will run retryCheckToken() which will make sure the token is valid. 
        // This was done so that even if user already had a valid token and so did not need to go through a login phase, 
        // the startTokenCheck would still be set to true
        setToken(result.data.admin.token);
      }
      return result;
    } catch (err) {
      return { success: false };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        adminUsername,
        setAdminUsername,
        logoutAdmin,
        resetTokenChecker,
        attemptLogin,
        getAdminInfo,
        isOnline,
        refreshToken,
        setStartTokenCheck,
        showCountdown
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export default AuthProvider;
