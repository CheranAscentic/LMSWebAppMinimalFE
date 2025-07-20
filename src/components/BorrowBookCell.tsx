import { useState } from "react";
import { useApi } from "../hooks/useApi";
import ApiServices from "@/services/ApiServices";

interface BorrowBookCellProps {
  bookId: number;
  refreshBooks: () => void;
}

export function BorrowBookCell({ bookId , refreshBooks}: BorrowBookCellProps) {
    const [userId, setUserId] = useState("");
    const { loading, error, execute } = useApi<string>();

    const handleBorrow = async () => {
            if (!userId.trim()) return;
            try {
            await execute(() => ApiServices.borrowBook(Number(userId), bookId));
            setUserId(""); // Clear input after borrowing
            await refreshBooks(); // refresh
        } catch {
            window.confirm(`Failed to borrow book: ${error}`);
        }
        }

    return (
        <div className="flex items-center space-x-2">
        <input
            type="number"
            min={1}
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="User ID"
            className="border px-2 py-1 rounded w-20"
            disabled={loading}
        />
        <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-60"
            onClick={handleBorrow}
            disabled={loading || !userId.trim()}
        >
            Borrow
        </button>
        {/* {error && <span className="text-xs text-red-500 ml-1">{error}</span>} */}
        </div>
    );
}