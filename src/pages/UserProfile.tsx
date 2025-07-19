import React, { useState } from "react";
import type { User } from "@/models/User";

interface UserProfileProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onSave }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    address: user.address || "",
  });

  const [editing, setEditing] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setEditing(false);
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8 border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>
      <form onSubmit={handleSave} className="space-y-5">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={user.id}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <input
            type="text"
            value={user.type}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 capitalize"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={!editing}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pt-3">
          {!editing ? (
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
                onClick={() => {
                  setForm({
                    name: user.name || "",
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    address: user.address || "",
                  });
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};