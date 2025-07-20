import React, { useState } from "react";
import type { User } from "@/models/User";
import { Badge, Home, Mail, PencilLine, Save, User2, UserCircle2, X } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import ApiServices from "@/services/ApiServices";

interface UpdateUserProps {
  updateUser: User;
}

export const UpdateUser: React.FC<UpdateUserProps> = ({ updateUser }) => {
    const { execute } = useApi<User>();

  const [form, setForm] = useState({
    ...updateUser,
    name: updateUser.name || "",
    firstName: updateUser.firstName || "",
    lastName: updateUser.lastName || "",
    address: updateUser.address || "",
  });

  const [editing, setEditing] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    await execute(() => ApiServices.updateUser(
        updateUser.id,
        {
            name: form.name || updateUser.name,
            firstName: form.firstName || updateUser.firstName,
            lastName: form.lastName || updateUser.lastName,
            address: form.address || updateUser.address,
        }
    )).then((response) => {
        if (!response.success) {
            throw new Error(response.message || "Failed to update user");
        }
        else {
            console.log("User updated successfully:", response.data);
        }
    }).catch((error) => {
        console.error("Error updating user:", error);
    }).finally(() => {
        setEditing(false);
    });
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8 border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <UserCircle2 className="w-8 h-8 text-blue-600" />
        User Profile
      </h2>
      <form onSubmit={handleSave} className="space-y-5">
        {/* Read-only fields */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <Badge className="w-4 h-4 text-gray-500" />
            User ID
          </label>
          <input
            type="text"
            value={updateUser.id}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-500" />
            Email
          </label>
          <input
            type="email"
            value={updateUser.email}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <Badge className="w-4 h-4 text-gray-500" />
            Role
          </label>
          <input
            type="text"
            value={updateUser.type}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 capitalize"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <User2 className="w-4 h-4 text-gray-500" />
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
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <User2 className="w-4 h-4 text-gray-500" />
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
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <User2 className="w-4 h-4 text-gray-500" />
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
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <Home className="w-4 h-4 text-gray-500" />
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                setEditing(true);
              }}
            >
              <PencilLine className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded flex items-center gap-2"
                onClick={() => {
                  setForm({
                    ...updateUser,
                    name: updateUser.name || "",
                    firstName: updateUser.firstName || "",
                    lastName: updateUser.lastName || "",
                    address: updateUser.address || "",
                  });
                  setEditing(false);
                }}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};