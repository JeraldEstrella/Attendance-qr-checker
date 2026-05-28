import './Navbar.css';

const Navbar = ({ panel, setPanel }) => {
  const links = [
    { label: 'Dashboard', icon: 'ti-layout-dashboard', badge: null },
    { label: 'Members', icon: 'ti-users', badge: null },
  ];

  return (
    <div className='navbar'>
      {links.map((link) => (
        <a
          key={link.label}
          href='#'
          className={panel === link.label.toLowerCase() ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            setPanel(link.label.toLowerCase());
          }}
        >
          <i className={`ti ${link.icon}`}></i>
          {link.label}
          {link.badge !== null && <span className='badge'>{link.badge}</span>}
        </a>
      ))}
    </div>
  );
};

export default Navbar;
