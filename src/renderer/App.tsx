import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [version, setVersion] = useState('0.0.1');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-version', []);
    window.electron.ipcRenderer.once('version', (version) => {
      setVersion(version);
    });
  }, []);
  useEffect(() => {
    const handleMessage = (
      event: Electron.IpcRendererEvent,
      ...args: any[]
    ) => {
      const [text] = args;
      setMessages((prevMessages) => [...prevMessages, text]);
    };

    const unsubscribe = window.electron.ipcRenderer.on(
      'message',
      handleMessage,
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);
  const handleCheckUpdate = () => {
    window.electron.ipcRenderer.sendMessage('check-for-updates', []);
  };

  const handleAutoLaunch = () => {
    window.electron.ipcRenderer.sendMessage('toggle-auto-launch', []);
  };
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-demo</h1>
      <div>
        Current Version: <span>{version}</span>
      </div>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div className="Hello">
        <button type="button" onClick={handleCheckUpdate}>
          检查更新
        </button>
        <button type="button" onClick={handleAutoLaunch}>
          开机自启动
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
