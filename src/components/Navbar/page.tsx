
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#333', color: '#fff' }}>
      <div>
        <Link href="/"><span style={{ fontWeight: 'bold' }}>DevConnector</span></Link>
      </div>
      <div>
        <Link href="/developers">Developers</Link> |
        <Link href="/posts">Posts</Link> |
        <Link href="/dashboard">Dashboard</Link> |
        <Link href="/logout">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
