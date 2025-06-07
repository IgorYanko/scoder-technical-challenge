import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/">
            <Image
              src="/logo.png"
              alt="Clean Energy Logo"
              width={80}
              height={80}
            />
        </Link>

        <div>
          <Link href="/admin/login">
            <button className="rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              Login Admin
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}