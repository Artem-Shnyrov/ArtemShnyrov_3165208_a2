import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h1>Welcome</h1>
      <p>Choose the page you want to use:</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
        <Link href="/part-a" style={{ padding: '10px 16px', background: '#007bff', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>
          Movie Booking
        </Link>
        <Link href="/part-b-c" style={{ padding: '10px 16px', background: '#28a745', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>
          Inventory
        </Link>
      </div>
    </div>
  );
}
