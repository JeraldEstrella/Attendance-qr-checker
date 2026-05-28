import Members from './panel/member/Members';
import './ControlPanel.css';
import Dashboard from './panel/dashboard/Dashboard';

const listPanel = [
  { label: 'dashboard', content: <Dashboard /> },
  { label: 'members', content: <Members /> },
];

const ControlPanel = ({ panel }) => {
  return (
    <div className='control-panel'>
      {listPanel.find((p) => p.label === panel)?.content}
    </div>
  );
};

export default ControlPanel;
