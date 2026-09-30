'use client';

export default function ErrorPage({ reset }) {
  return <main id="main" className="error-page container">
    <h1>Something went wrong</h1>
    <p>The page could not be loaded. Please try again in a moment.</p>
    <p><button className="button-primary" type="button" onClick={reset}>Try again</button></p>
  </main>;
}
