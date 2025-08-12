import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#D9D9D9] text-black py-8 fixed bottom-0 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
        
       <div className="flex space-x-6 text-black">
            <Link href="/about" className="hover:text-gray-100 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-100 transition">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-gray-100 transition">
              Privacy
            </Link>
          </div>
        </div>

     
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-black">
          <p>&copy; {currentYear} . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}