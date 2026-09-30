import AdminApp from '../../components/AdminApp';
import './admin.css';
import './admin-light.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Club Control', robots: { index: false, follow: false } };

export default function AdminPage() { return <AdminApp />; }
