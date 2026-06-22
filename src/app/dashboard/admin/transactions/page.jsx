"use client";

import { getToken } from "@/components/service/getToken";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH TRANSACTIONS =================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await getToken()
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/transactions`, {
            method:"GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            }
          }
        );
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setTransactions(data.transactions);
      } catch (err) {
        toast.error(err.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.stripeSessionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 bg-gray-50 dark:bg-gray-950">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900 dark:text-white min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transactions History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Read-only data table of all Stripe payments across the platform
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by email or TxID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      {/* ================= DATA TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-200 dark:border-white/10">
        <table className="w-full text-left border-collapse bg-white dark:bg-transparent">
          
          {/* TABLE HEADER */}
          <thead className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 font-semibold text-sm">
            <tr>
              <th className="p-4">User Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Transaction ID (Stripe)</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  {/* USER EMAIL */}
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                    {tx.userEmail}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">
                    ${tx.price}
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-gray-600 dark:text-gray-300 min-w-50">
                    {new Date(tx.bookingDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* TRANSACTION ID */}
                  <td className="p-4 font-mono text-xs text-purple-600 dark:text-purple-400 max-w-xs truncate">
                    {tx.stripeSessionId}
                  </td>

                
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                      Success
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;