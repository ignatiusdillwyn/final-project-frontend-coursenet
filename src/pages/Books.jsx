import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaTrash } from "react-icons/fa";
import { getBooks, deleteBook } from "../services/api";

const Books = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${title}" permanently?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Book has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete book",
      });
    }
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">📚 Books IT</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="rounded-xl border bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="p-5 flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{book.title}</h2>
                <p className="text-sm text-gray-500 mb-3">
                  {book.author} • {book.year}
                </p>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {book.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {book.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {book.publisher}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="font-semibold text-green-700">
                  {formatRupiah(book.price)}
                </span>

                <div className="flex gap-2">
                  <Link
                    to={`/books/${book.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    <FaEye />
                    Detail
                  </Link>

                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No books available</p>
      )}
    </div>
  );
};

export default Books;
