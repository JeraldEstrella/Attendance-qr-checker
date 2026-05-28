import React, { useState } from 'react';
import Dashboard from './panel/dashboard/Dashboard';
import ControlPanel from './ControlPanel';
import Navbar from './components/navbar/Navbar';

const App = () => {
  const [panel, setPanel] = useState('dashboard');

  return (
    <div className='app-container'>
      <Navbar panel={panel} setPanel={setPanel} />
      <ControlPanel panel={panel} />
    </div>
  );
};

export default App;
