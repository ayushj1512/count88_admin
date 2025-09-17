"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast"; // For notifications
import { FiTrash2 } from "react-icons/fi";

export default function QueriesPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch queries
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/queries`);
        const data = await res.json();
        setQueries(data);
      } catch (err) {
        console.error("Error fetching queries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, [API_BASE_URL]);

  // Filtered queries
  const filteredQueries = useMemo(() => {
    let filtered = [...queries];
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (q.email && q.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.message && q.message.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }
    return filtered;
  }, [queries, searchTerm, statusFilter]);

  // Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/api/queries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setQueries((prev) =>
        prev.map((q) => (q._id === id ? updated : q))
      );
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Delete query
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/api/queries/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQueries((prev) => prev.filter((q) => q._id !== deleteId));
        toast.success("Query deleted successfully");
      } else {
        toast.error("Failed to delete query");
      }
    } catch (err) {
      console.error("Error deleting query:", err);
      toast.error("Failed to delete query");
    } finally {
      setUpdating(false);
      setDeleteId(null);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Queries Management
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full md:w-1/3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Queries Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors relative">
        {(loading || updating) && (
          <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Name", "Email", "Phone", "Organisation", "Type", "Message", "Status", "Date", "Actions"].map(
                (title) => (
                  <th
                    key={title}
                    className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200"
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredQueries.length > 0 ? (
              filteredQueries.map((query) => (
                <tr
                  key={query._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{query.name}</td>
                  <td className="px-6 py-4">{query.email}</td>
                  <td className="px-6 py-4">{query.phoneNumber}</td>
                  <td className="px-6 py-4">{query.organisationName || "-"}</td>
                  <td className="px-6 py-4">{query.queryType}</td>
                  <td className="px-6 py-4">{query.message}</td>
                  <td className="px-6 py-4">
                    <select
                      value={query.status}
                      onChange={(e) =>
                        handleStatusChange(query._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded-lg text-sm"
                    >
                      {["New", "Contacted", "In Progress", "Resolved", "Closed"].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDeleteId(query._id);
                        setConfirmDelete(true);
                      }}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-1"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-300"
                >
                  No queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this query? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader CSS */}
      <style>
        {`
          .loader {
            border-width: 4px;
            border-top-color: transparent;
            border-right-color: #3b82f6;
            border-bottom-color: #3b82f6;
            border-left-color: #3b82f6;
          }
        `}
      </style>
    </div>
  );
}
