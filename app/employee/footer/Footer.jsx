import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#8D92EB] to-[#6f74d9] text-white py-6 fixed bottom-0 w-full shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
         
          <div className="flex space-x-6 text-sm font-medium">
            <Link href="/about" className="hover:text-gray-200 transition-colors duration-300">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-200 transition-colors duration-300">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-gray-200 transition-colors duration-300">
              Privacy
            </Link>
          </div>

          <p className="text-sm text-gray-100">
            &copy; {currentYear} MyCompany. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
