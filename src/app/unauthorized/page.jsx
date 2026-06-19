import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-full bg-danger/10">
            <ShieldX className="h-16 w-16 text-danger" />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-3">403</h1>

        <h2 className="text-2xl font-semibold mb-4">
          Unauthorized Access
        </h2>

        <p className="text-default-500 mb-8">
          You don't have permission to access this page.
          Please sign in with the appropriate account or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-default-300 hover:bg-default-100 transition font-medium"
          >
            Go To Home
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-green-600 text-white hover:opacity-90 transition font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}