import Link from 'next/link';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 relative">
              <Image
                src="/logo.svg"
                alt="LLM比較さん"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gray-900">LLM比較さん</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Cog6ToothIcon className="h-6 w-6 mr-2" />
            <span>設定</span>
          </Link>
        </div>
      </div>
    </header>
  );
}