"use client";

import { useMemo, useState } from "react";

type Customer = {
  id: string;
  email: string | null;
};

export function CustomerPicker({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter((customer) =>
      (customer.email ?? "").toLowerCase().includes(needle),
    );
  }, [customers, query]);

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a3a3a3]">
          Filter customers
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by email"
          className="mt-2 w-full border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 font-body text-body text-white outline-none focus:border-white"
        />
      </label>
      <label className="block">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a3a3a3]">
          Customer
        </span>
        <select
          name="customer_user_id"
          required
          defaultValue=""
          className="mt-2 w-full border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 font-body text-body text-white outline-none focus:border-white"
        >
          <option value="" disabled>
            {filtered.length === 0
              ? "No matching accounts"
              : "Select a registered account"}
          </option>
          {filtered.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.email ?? customer.id}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
