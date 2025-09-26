'use client';

import Link from 'next/link';

export function TestLinks() {
  return (
    <div className="p-8 space-y-4 relative z-40 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50">
      <h2 className="text-xl font-bold">Link Test Component</h2>

      <div className="space-y-2">
        <p>
          Test Link 1:{' '}
          <Link
            href="/test-routing"
            className="text-blue-600 hover:underline cursor-pointer">
            Test Routing
          </Link>
        </p>
        <p>
          Test Link 2:{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:underline cursor-pointer">
            Register
          </Link>
        </p>
        <p>
          Test Link 3:{' '}
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline cursor-pointer">
            Forgot Password
          </Link>
        </p>
      </div>

      <div className="space-y-2">
        <p>
          Regular anchor:{' '}
          <a
            href="/test-routing"
            className="text-blue-600 hover:underline cursor-pointer">
            Test Routing (anchor)
          </a>
        </p>
        <p>
          Regular anchor:{' '}
          <a
            href="/register"
            className="text-blue-600 hover:underline cursor-pointer">
            Register (anchor)
          </a>
        </p>
      </div>
    </div>
  );
}
