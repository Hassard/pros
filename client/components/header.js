import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && currentUser.churchId && { label: 'Prayer Chain', href: '/corporates/' },
    currentUser && currentUser.role === 'owner' && { label: 'Churches', href: '/churches/' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' }
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Proseuche</a>
      </Link>

      <div className="d-flix justify-content-end">
        <ul className="nav d-flix align-items-center">
          {links}
        </ul>
      </div>
    </nav>    
  );
};

export default Header;