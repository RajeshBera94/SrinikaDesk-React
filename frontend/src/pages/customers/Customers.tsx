import { useState, useEffect } from "react";
import AddCustomer from "./AddCustomer";
import { SquarePen, Trash2 } from "lucide-react";

type CustomerALL = {
  id: number;
  name: string;
  phone: string;
  photo: string | null;
  // deu:null
};

function Customers() {
  const [customers, setCustomers] = useState<CustomerALL[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editCustomarId, setEditcustomarId] = useState<number | null>(null);
  const [editCustomer, setEditCustomer] = useState<CustomerALL | null>(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [dataLoading, setdataLoading] = useState(false);
  /////////////////////////Filter Customer///////////////

  const FilterCustomers = customers.filter((customer) => {
    const searchText = search.toLocaleLowerCase().trim();

    return (
      customer.name.toLocaleLowerCase().includes(searchText) ||
      customer.phone.includes(searchText)
    );
  });

  //////////////fecth Data

  const fetchCoustomrs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/customers");

      if (!response.ok) {
        throw new Error("Failed to Fetch Customers");
      }

      const data = await response.json();

      // await new Promise((resolve) => setTimeout(resolve, 800));

      setCustomers(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  /////////////////////////Modal Handle
  const handleCloseForm = () => {
    setShowForm(false);
    setEditcustomarId(null);
    setEditCustomer(null);
  };

  ////////////////////fetch Single Data

  useEffect(() => {
    if (editCustomarId === null) {
      return;
    }

    const fetchSingleCustomer = async () => {
      try {
        setdataLoading(true);
        setEditCustomer(null);
        setShowForm(true);

        const response = await fetch(
          `http://localhost:5000/api/customers/${editCustomarId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customer");
        }

        const data = await response.json();

        // একটু loading দেখানোর জন্য
        await new Promise((resolve) => setTimeout(resolve, 600));

        setEditCustomer(data);
      } catch (error) {
        console.error(error);
      } finally {
        setdataLoading(false);
      }
    };

    fetchSingleCustomer();
  }, [editCustomarId]);

  //////////////fetch All Customar

  useEffect(() => {
    fetchCoustomrs();
  }, []);

  //////////////Close Modal

  const handleAddCustomers = () => {
    handleCloseForm();
    fetchCoustomrs();
  };

  const handleDeleteCustomer = async () => {
    if (deleteCustomerId === null) {
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/customers/${deleteCustomerId}`,
      {
        method: "DELETE",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    setDeleteCustomerId(null);
    fetchCoustomrs();
  };

  return (
    <div>
      <div className="mb-1 flex justify-between rounded-lg border border-slate-200 bg-white p-2">
        <h2 className="text-lg font-semibold text-slate-900">Add Customer</h2>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer..."
            className="w-64 rounded-md border border-slate-300 py-2 pl-3 pr-9 text-sm outline-none focus:border-sky-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Clear search"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setEditcustomarId(null);
            setEditCustomer(null);
          }}
          className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 cursor-pointer"
        >
          + Add Customer
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                SL
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Photo
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Mobile
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">
                Due
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          {!loading && !error && FilterCustomers.length === 0 && (
            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-lg font-semibold text-slate-500"
                >
                  {search.trim()
                    ? "No customers match your search"
                    : "No customers found"}
                </td>
              </tr>
            </tbody>
          )}

          {/* {!loading && !error && customers.length === 0 && (
            <tbody>
              <td className="text-lg font-semibold text-red-900">
                No customers found
              </td>
            </tbody>
          )} */}
          {!loading && !error && FilterCustomers.length > 0 && (
            <tbody>
              {FilterCustomers.map((item, index) => {
                return (
                  <tr className="border-t border-slate-100" key={item.id}>
                    <td className="px-4 py-3 text-slate-900">{index + 1}</td>
                    <td className="px-4 py-3 text-slate-900">
                      {item.photo ? (
                        <img
                          src={`http://localhost:5000/uploads/customers/${item.photo}`}
                          alt={item.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-500">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{item.name}</td>

                    <td className="px-4 py-3 text-slate-600">{item.phone}</td>

                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      {/* {item.due} */}50
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          setEditcustomarId(item.id);
                        }}
                        className="text-sm font-medium text-sky-600 hover:text-sky-800 cursor-pointer"
                        aria-label={`Edit ${item.name}`}
                        title="Edit customer"
                      >
                        <SquarePen size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCustomerId(item.id)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:text-red-800 cursor-pointer"
                        aria-label={`Delete ${item.name}`}
                        title="Delete customer"
                      >
                        <Trash2 size={22} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {showForm && (
          //                        {/* Modal Header */}

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl animate-[modalIn_0.25s_ease-out]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editCustomarId !== null ? "Edit Customer" : "Add Customar"}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditcustomarId(null);
                    setEditCustomer(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6">
                {dataLoading ? (
                  <div className="flex min-h-80 items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>

                      <p className="text-sm text-slate-500">
                        Loading customer...
                      </p>
                    </div>
                  </div>
                ) : (
                  <AddCustomer
                    onSuccess={handleAddCustomers}
                    customer={editCustomer ?? undefined}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* /////////////////delete confirmation diolog box */}

        {deleteCustomerId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl animate-[modalIn_0.2s_ease-out]">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Customer?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete this customer?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteCustomerId(null)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteCustomer}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
