// Global cycle-safe JSON.stringify patch to prevent "Converting circular structure to JSON"
(() => {
  const nativeStringify = JSON.stringify;
  JSON.stringify = function (value: any, replacer?: any, space?: any) {
    const seen = new WeakSet();
    const cycleReplacer = (key: string, val: any) => {
      if (typeof val === 'object' && val !== null) {
        if (
          seen.has(val) ||
          (typeof Node !== 'undefined' && val instanceof Node) ||
          (typeof Window !== 'undefined' && val instanceof Window) ||
          (typeof Document !== 'undefined' && val instanceof Document)
        ) {
          return undefined; // Drop circular reference or DOM element
        }
        try {
          seen.add(val);
        } catch (_) {}
      }
      if (typeof replacer === 'function') {
        return replacer.call(this, key, val);
      }
      return val;
    };

    try {
      return (nativeStringify as any).call(this, value, cycleReplacer, space);
    } catch {
      try {
        if (typeof value === 'object' && value !== null) {
          const shallow: Record<string, any> = {};
          for (const k in value) {
            try {
              if (typeof value[k] !== 'object' && typeof value[k] !== 'function') {
                shallow[k] = value[k];
              }
            } catch (_) {}
          }
          return nativeStringify.call(this, shallow, null, space);
        }
        return nativeStringify.call(this, String(value));
      } catch {
        return '"{}"';
      }
    }
  };
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
