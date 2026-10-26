import React, { useCallback, useEffect, useState } from "react";
import {
    BookOpen,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Save,
    RefreshCw,
    Package,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    getAdminBookInventory,
    createAdminBook,
    updateAdminBook,
    deleteAdminBook,
} from "../../services/api";

const EDUCATION_LEVELS = [
    "Primary",
    "Middle",
    "Matric (9th-10th)",
    "Intermediate (FSc/ICS)",
    "General Reading",
    "Other",
];

const LANGUAGES = ["English", "Urdu", "Bilingual"];
const CONDITIONS = ["Restored", "Good", "Fair"];

const EMPTY_FORM = {
    title: "",
    author: "",
    subject: "",
    educationLevel: "Primary",
    board: "AJK / FBISE",
    language: "English",
    condition: "Restored",
    availableQuantity: 1,
    locationShelf: "Muzaffarabad Main Hub",
};

const INPUT_CLASS =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#276B56] focus:ring-2 focus:ring-[#276B56]/15";

const LABEL_CLASS =
    "mb-1.5 block text-xs font-bold text-slate-700";

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [search, setSearch] = useState("");
    const [availability, setAvailability] = useState("All");

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });

    const loadBooks = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getAdminBookInventory({
                page,
                limit: 10,
                search: search.trim(),
                availability:
                    availability === "All" ? undefined : availability,
            });

            if (!response.data?.success) {
                throw new Error("The inventory response was unsuccessful.");
            }

            setBooks(response.data.data || []);
            setTotal(response.data.total || 0);
            setTotalPages(response.data.totalPages || 0);
        } catch (err) {
            console.error("Failed to load books:", err);

            setError(
                err.response?.data?.error ||
                "Unable to load inventory. Please check your connection."
            );
        } finally {
            setLoading(false);
        }
    }, [page, search, availability]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadBooks();
        }, 300);

        return () => clearTimeout(timer);
    }, [loadBooks]);

    useEffect(() => {
        setPage(1);
    }, [search, availability]);

    const openAddModal = () => {
        setEditingBook(null);
        setForm({ ...EMPTY_FORM });
        setModalOpen(true);
        setError("");
    };

    const openEditModal = (book) => {
        setEditingBook(book);

        setForm({
            title: book.title || "",
            author: book.author || "",
            subject: book.subject || "",
            educationLevel: book.educationLevel || "Primary",
            board: book.board || "",
            language: book.language || "English",
            condition: book.condition || "Restored",
            availableQuantity: book.availableQuantity ?? 0,
            locationShelf: book.locationShelf || "",
        });

        setModalOpen(true);
        setError("");
    };

    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        setEditingBook(null);
        setForm({ ...EMPTY_FORM });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setError("");
        setNotice("");

        const quantity = Number(form.availableQuantity);

        if (
            !Number.isSafeInteger(quantity) ||
            quantity < 0
        ) {
            setError("Quantity must be a whole number of zero or more.");
            return;
        }

        if (
            !form.title.trim() ||
            !form.subject.trim() ||
            !form.educationLevel
        ) {
            setError("Please complete all required fields.");
            return;
        }

        const payload = {
            ...form,
            title: form.title.trim(),
            author: form.author.trim() || "Unknown",
            subject: form.subject.trim(),
            board: form.board.trim(),
            locationShelf: form.locationShelf.trim(),
            availableQuantity: quantity,
        };

        setSaving(true);

        try {
            if (editingBook) {
                await updateAdminBook(editingBook._id, payload);
                setNotice("Book updated successfully.");
            } else {
                await createAdminBook(payload);
                setNotice("Book added to inventory successfully.");
            }

            setModalOpen(false);
            setEditingBook(null);
            setForm({ ...EMPTY_FORM });

            if (page !== 1) {
                setPage(1);
            } else {
                await loadBooks();
            }
        } catch (err) {
            console.error("Failed to save book:", err);

            setError(
                err.response?.data?.error ||
                "Unable to save the book. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (book) => {
        const confirmed = window.confirm(
            `Permanently delete "${book.title}" from the inventory?`
        );

        if (!confirmed) return;

        setDeletingId(book._id);
        setError("");
        setNotice("");

        try {
            await deleteAdminBook(book._id);

            setNotice("Book deleted successfully.");

            if (books.length === 1 && page > 1) {
                setPage((previous) => previous - 1);
            } else {
                await loadBooks();
            }
        } catch (err) {
            console.error("Failed to delete book:", err);

            setError(
                err.response?.data?.error ||
                "Unable to delete the book."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const inputField = (
        label,
        name,
        options = {}
    ) => (
        <div>
            <label htmlFor={`book-${name}`} className={LABEL_CLASS}>
                {label}
                {options.required && (
                    <span className="ml-1 text-rose-500">*</span>
                )}
            </label>

            <input
                id={`book-${name}`}
                name={name}
                type={options.type || "text"}
                min={options.min}
                step={options.step}
                required={options.required}
                value={form[name]}
                onChange={handleChange}
                placeholder={options.placeholder || ""}
                className={INPUT_CLASS}
            />
        </div>
    );

    const selectField = (
        label,
        name,
        options
    ) => (
        <div>
            <label htmlFor={`book-${name}`} className={LABEL_CLASS}>
                {label}
            </label>

            <select
                id={`book-${name}`}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={INPUT_CLASS}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl bg-[#193E32] p-6 text-white shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-[#E8A94A]">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Library Operations
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Book Inventory Management
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                            Manage restored books, monitor available copies,
                            and keep the public catalog up to date.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8A94A] px-5 py-3 text-sm font-bold text-[#193E32] transition hover:bg-[#f2bc68]"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Book
                    </button>
                </div>
            </div>

            {/* Inventory overview */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Matching Titles
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-[#193E32]">
                        {total}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Titles on This Page
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-[#193E32]">
                        {books.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Available Copies on This Page
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-[#193E32]">
                        {books.reduce(
                            (sum, book) => sum + (book.availableQuantity || 0),
                            0
                        )}
                    </p>
                </div>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        type="search"
                        placeholder="Search by title, author, or subject..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className={`${INPUT_CLASS} pl-10`}
                    />
                </div>

                <select
                    value={availability}
                    onChange={(event) => setAvailability(event.target.value)}
                    className={`${INPUT_CLASS} sm:w-48`}
                >
                    <option value="All">All Books</option>
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                </select>

                <button
                    type="button"
                    onClick={loadBooks}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* Messages */}
            {notice && (
                <div
                    role="status"
                    className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    {notice}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                >
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Inventory table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 p-16">
                        <Loader2 className="h-8 w-8 animate-spin text-[#276B56]" />
                        <p className="text-sm text-slate-500">
                            Loading book inventory...
                        </p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
                        <Package className="h-12 w-12 text-slate-300" />

                        <h3 className="text-lg font-bold text-[#193E32]">
                            No books found
                        </h3>

                        <p className="max-w-sm text-sm text-slate-500">
                            Your inventory is empty or no books match the
                            selected filters.
                        </p>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="mt-2 rounded-xl bg-[#193E32] px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Add a Book
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Book</th>
                                    <th className="px-5 py-4">Education Level</th>
                                    <th className="px-5 py-4">Condition</th>
                                    <th className="px-5 py-4">Copies</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {books.map((book) => {
                                    const inStock = book.availableQuantity > 0;

                                    return (
                                        <tr
                                            key={book._id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-[#193E32]">
                                                    {book.title}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {book.author || "Unknown"} · {book.subject}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {book.locationShelf}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-slate-700">
                                                {book.educationLevel}
                                            </td>

                                            <td className="px-5 py-4 text-slate-700">
                                                {book.condition}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="font-bold text-[#193E32]">
                                                    {book.availableQuantity}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${inStock
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-rose-50 text-rose-700"
                                                        }`}
                                                >
                                                    {inStock ? "Available" : "Out of Stock"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(book)}
                                                        aria-label={`Edit ${book.title}`}
                                                        className="rounded-lg border border-slate-200 p-2 text-[#276B56] transition hover:bg-emerald-50"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(book)}
                                                        disabled={deletingId === book._id}
                                                        aria-label={`Delete ${book.title}`}
                                                        className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                                                    >
                                                        {deletingId === book._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        Page {page} of {totalPages}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage((previous) => previous - 1)}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((previous) => previous + 1)}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 disabled:opacity-40"
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="book-modal-title"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#276B56]">
                                    Inventory Editor
                                </p>

                                <h3
                                    id="book-modal-title"
                                    className="text-2xl font-bold text-[#193E32]"
                                >
                                    {editingBook ? "Edit Book" : "Add New Book"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close dialog"
                                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    {inputField("Book Title", "title", {
                                        required: true,
                                        placeholder: "Enter book title",
                                    })}
                                </div>

                                {inputField("Author", "author", {
                                    placeholder: "Author name",
                                })}

                                {inputField("Subject", "subject", {
                                    required: true,
                                    placeholder: "e.g. Mathematics",
                                })}

                                {selectField(
                                    "Education Level",
                                    "educationLevel",
                                    EDUCATION_LEVELS
                                )}

                                {selectField(
                                    "Language",
                                    "language",
                                    LANGUAGES
                                )}

                                {selectField(
                                    "Condition",
                                    "condition",
                                    CONDITIONS
                                )}

                                {inputField("Available Quantity", "availableQuantity", {
                                    type: "number",
                                    required: true,
                                    min: 0,
                                    step: 1,
                                })}

                                {inputField("Board", "board", {
                                    placeholder: "e.g. AJK / FBISE",
                                })}

                                {inputField("Shelf / Location", "locationShelf", {
                                    placeholder: "Storage location",
                                })}
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                                Setting quantity to <strong>0</strong> marks the book
                                as out of stock and removes it from the public
                                Available Books catalog. Increasing the quantity
                                makes it available again.
                            </div>

                            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#193E32] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#276B56] disabled:opacity-60"
                                >
                                    {saving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}

                                    {saving ? "Saving..." : "Save Book"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ManageBooks;