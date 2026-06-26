import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-black border-t dark:border-gray-800 text-gray-700 dark:text-gray-300">
      
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h1 className="text-2xl font-bold text-green-500">
            FitNexus
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Build strength, stay healthy, and join the FitNexus community to
            achieve your fitness goals.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-green-500">Home</Link>
            </li>
            <li>
              <Link href="/classes" className="hover:text-green-500">Classes</Link>
            </li>
            <li>
              <Link href="/forum" className="hover:text-green-500">Community Forum</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-500">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact</h2>
          <p className="text-sm">Email: support@fitnexus.com</p>
          <p className="text-sm">Phone: +880 1XXXXXXXXX</p>
          <p className="text-sm">Location: Bangladesh</p>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>

          <div className="flex gap-4 text-xl">
            <a href="https://www.facebook.com" className="hover:text-green-500 transition">
              <FaFacebookF />
            </a>

            <a href="https://www.instagram.com" className="hover:text-green-500 transition">
              <FaInstagram />
            </a>

            <a href="https://x.com" className="hover:text-green-500 transition">
              <FaXTwitter />
            </a>
          </div>
        </div>

      </div>
      <div className="border-t dark:border-gray-800 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} FitNexus. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;