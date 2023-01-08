import React from 'react';
import { useEffect, useState } from 'react';

const PREFIX = 'admin-dashboard-app-';

export default function useLocalStorage(key, initialValue = null) {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    // try to get the value from localstorage
    let jsonValue = null;
    jsonValue = localStorage.getItem(prefixedKey);

    // return it if there's actual data stored with that key
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    // if jsonValue does not exist, it means this is the first time we are trying to store this particular value. So, we can use the initial Value provided
    if (typeof initialValue === 'function') {
      return initialValue();
    } else {
      return initialValue;
    }
    console.log('nothing fits');
  });

  useEffect(() => {
    // anytime the value or key changes, update the value in localstorage
    localStorage.setItem(prefixedKey, JSON.stringify(value || ''));
  }, [prefixedKey, value]);

  return [value, setValue];
}
