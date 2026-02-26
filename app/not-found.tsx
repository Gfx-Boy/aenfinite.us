import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - Page Not Found | Aenfinite®',
    description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            fontFamily: '"Arial", sans-serif',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <style>{`
        .aenfinite-404-btn {
          display: inline-block;
          background-color: #227bf3;
          color: #ffffff;
          text-decoration: none;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(34, 123, 243, 0.4);
        }
        .aenfinite-404-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(34, 123, 243, 0.6);
          color: #ffffff;
        }
      `}</style>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(34, 123, 243, 0.15) 0%, rgba(10, 10, 10, 1) 70%)',
                zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                <h1 style={{
                    fontSize: 'clamp(6rem, 15vw, 10rem)',
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1,
                    color: '#227bf3',
                    textShadow: '0 0 40px rgba(34, 123, 243, 0.4)',
                    letterSpacing: '-5px'
                }}>
                    404
                </h1>

                <h2 style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: 600,
                    margin: '1rem 0 2rem 0',
                    letterSpacing: '-1px'
                }}>
                    Page Not Found
                </h2>

                <p style={{
                    fontSize: '1.1rem',
                    color: '#a0a0a0',
                    marginBottom: '3rem',
                    lineHeight: 1.6
                }}>
                    The page you are looking for might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>

                <Link href="/" className="aenfinite-404-btn">
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}
