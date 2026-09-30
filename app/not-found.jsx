import Link from 'next/link';
import { InnerPage } from '../components/InnerPage';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return <InnerPage title="Page not found" description="The page you are looking for does not exist or has moved.">
    <p><Link className="button-primary" href="/">Back to the homepage</Link></p>
  </InnerPage>;
}
