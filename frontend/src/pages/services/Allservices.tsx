import { useEffect, useState } from "react";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";

type Service = {
  id: number;
  name: string;
  icon: string | null;
  parent_id: number | null;
  badge: "NEW" | "HOT" | null;
  sort_order: number;
  status: number;
  url:string
};

type ServiceType = "parent" | "child";

const AllServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [children, setChildren] = useState<Record<number, Service[]>>({});
  const [openService, setOpenService] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState<number | null>(null);
  const [error, setError] = useState("");
  // ---------------------------------------------
  // Add Modal
  // ---------------------------------------------
  const [showAddModal, setShowAddModal] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>("parent");
  const [serviceName, setServiceName] = useState("");
  const [parentId, setParentId] = useState("");
  const [icon, setIcon] = useState("FileText");
  const [serviceUrl, setServiceUrl] = useState("");
  const [badge, setBadge] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [status, setStatus] = useState("1");
  const [editService, setEditService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [iconFile, setIconFile] = useState<File | null>(null);

  //////////////openEdit Form

  const handleOpenEditModal = (service: Service) => {
    setEditService(service);
    setServiceType(service.parent_id === null ? "parent" : "child");
    setServiceName(service.name);
    setParentId(service.parent_id ? String(service.parent_id) : "");
    setIcon(service.icon || "FileText");
    setBadge(service.badge || "");
    setSortOrder(String(service.sort_order ?? 0));
    setStatus(String(service.status ?? 1));
    setShowAddModal(true);
    setServiceUrl(service.url || "")
  };

  // ---------------------------------------------
  // Fetch Parent Services
  // ---------------------------------------------

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/service");

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();

      setServices(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ---------------------------------------------
  // Fetch Children
  // ---------------------------------------------

  const fetchChildren = async (parentId: number) => {
    try {
      setLoadingChildren(parentId);

      const response = await fetch(
        `http://localhost:5000/api/service/${parentId}/children`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch child services");
      }

      const data = await response.json();

      setChildren((current) => ({
        ...current,
        [parentId]: data,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingChildren(null);
    }
  };

  // ---------------------------------------------
  // Parent Click
  // ---------------------------------------------

  const handleServiceClick = async (service: Service) => {
    if (openService === service.id) {
      setOpenService(null);
      return;
    }

    if (!children[service.id]) {
      await fetchChildren(service.id);
    }

    setOpenService(service.id);
  };

  // ---------------------------------------------
  // Reset Add Form
  // ---------------------------------------------

  const resetAddForm = () => {
    setServiceType("parent");
    setServiceName("");
    setParentId("");
    setIcon("FileText");
    setBadge("");
    setSortOrder("");
    setStatus("1");
  };

  // ---------------------------------------------
  // Open Modal
  // ---------------------------------------------

  const handleOpenAddModal = () => {
    resetAddForm();
    setShowAddModal(true);
    setIconFile(null);
  };

  // ---------------------------------------------
  // Close Modal
  // ---------------------------------------------

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetAddForm();
    setEditService(null);
    setIconFile(null);
  };

  // ---------------------------------------------
  // Submit
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", serviceName);

      formData.append(
        "parent_id",
        serviceType === "child" ? String(Number(parentId)) : "",
      );

      formData.append("badge", badge || "");

      formData.append(
        "sort_order",
        sortOrder === "" ? "0" : String(Number(sortOrder)),
      );

      formData.append("status", String(Number(status)));

      formData.append("url", serviceType === "child" ? serviceUrl : "");

      // -----------------------------------------
      // Icon file
      // -----------------------------------------

      if (iconFile) {
        formData.append("icon", iconFile);
      }

      // -----------------------------------------
      // URL
      // -----------------------------------------

      const url = editService
        ? `http://localhost:5000/api/service/${editService.id}`
        : "http://localhost:5000/api/service";

      const method = editService ? "PUT" : "POST";

      // -----------------------------------------
      // Request
      // -----------------------------------------

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save service");
      }

      // -----------------------------------------
      // Refresh parent services
      // -----------------------------------------

      await fetchServices();

      // -----------------------------------------
      // Refresh children
      // -----------------------------------------

      if (editService?.parent_id) {
        await fetchChildren(editService.parent_id);
      }

      if (serviceType === "child" && parentId) {
        await fetchChildren(Number(parentId));

        setOpenService(Number(parentId));
      }

      // -----------------------------------------
      // Reset
      // -----------------------------------------

      setIconFile(null);

      handleCloseAddModal();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  };
  // ---------------------------------------------
  // Delete
  // ---------------------------------------------
  const handleDeleteService = async () => {
    if (!deleteService) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `http://localhost:5000/api/service/${deleteService.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      // Parent list refresh
      await fetchServices();

      // Cache clear
      setChildren((current) => {
        const updated = { ...current };

        delete updated[deleteService.id];

        return updated;
      });

      // যদি deleted service open থাকে
      if (openService === deleteService.id) {
        setOpenService(null);
      }

      setDeleteService(null);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "Failed to delete service",
      );
    } finally {
      setDeleting(false);
    }
  };
  {
    /* =========================================
          Pagination
      ========================================= */
  }

  const itemsPerPage = 5;
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentServices = services.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* =========================================
          Header
      ========================================= */}

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">All Services</h1>

          <p className="mt-1 text-sm text-slate-500">Manage Portal Services</p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 cursor-pointer"
        >
          + Add Service
        </button>
      </div>

      {/* =========================================
          Table
      ========================================= */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {loading && (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading services...
          </div>
        )}

        {!loading && error && (
          <div className="p-8 text-center text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-20 px-4 py-3 text-left font-medium text-slate-600">
                  SL
                </th>

                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Service
                </th>

                <th className="w-32 px-4 py-3 text-right font-medium text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentServices.map((service, index) => {
                const isOpen = openService === service.id;
                const serialNumber = startIndex + index + 1;
                const serviceChildren = children[service.id] ?? [];

                const isLoadingChildren = loadingChildren === service.id;

                return (
                  <tr key={service.id} className="border-t border-slate-100">
                    <td colSpan={3} className="p-0">
                      {/* Parent Row */}

                      <div className="grid grid-cols-[80px_1fr_128px] items-center">
                        <div className="px-4 py-4 text-slate-500">
                          {serialNumber}
                        </div>

                        <div className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleServiceClick(service)}
                            className="flex items-center gap-2 font-medium text-slate-800 hover:text-sky-600 cursor-pointer"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />

                            {service.name}
                          </button>
                        </div>

                        {/* Parent Actions */}

                        <div className="flex justify-end gap-1 px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(service)}
                            className="rounded-md p-2 text-sky-600 hover:bg-sky-50 hover:text-sky-800 cursor-pointer"
                            title="Edit service"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-800 cursor-pointer"
                            title="Delete service"
                            onClick={() => setDeleteService(service)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Child Services */}

                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                            {isLoadingChildren ? (
                              <div className="py-4 text-center text-sm text-slate-500">
                                Loading child services...
                              </div>
                            ) : serviceChildren.length === 0 ? (
                              <div className="py-4 text-sm text-slate-500">
                                No child services found.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {serviceChildren.map((child, childIndex) => (
                                  <div
                                    key={child.id}
                                    className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-slate-400">
                                        {childIndex + 1}.
                                      </span>

                                      <span className="text-sm font-medium text-slate-700">
                                        {child.name}
                                      </span>
                                    </div>

                                    <div className="flex gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenEditModal(child)
                                        }
                                        className="rounded-md p-2 text-sky-600 hover:bg-sky-50 hover:text-sky-800 cursor-pointer"
                                        title="Edit child service"
                                      >
                                        <Pencil size={16} />
                                      </button>

                                      <button
                                        type="button"
                                        className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-800 cursor-pointer"
                                        title="Delete child service"
                                        onClick={() => setDeleteService(child)}
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* =========================================
          Pagination
      ========================================= */}

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {services.length === 0 ? 0 : startIndex + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-slate-700">
            {Math.min(startIndex + itemsPerPage, services.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">{services.length}</span>{" "}
          services
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`min-w-9 rounded-md px-3 py-1.5 text-sm cursor-pointer font-medium ${
                  currentPage === page
                    ? "bg-sky-600 text-white"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm cursor-pointer text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* =========================================
          ADD SERVICE MODAL
      ========================================= */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl animate-[modalIn_0.25s_ease-out]">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editService ? "Edit Service" : "Add Service"}
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  {editService
                    ? "Update Portal Service"
                    : "Add a new Portal Service"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseAddModal}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-3.5 p-5">
              {/* Service Name */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Service Name
                </label>

                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Enter service name"
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* Service Type */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Service Type
                </label>

                <select
                  value={serviceType}
                  onChange={(e) =>
                    setServiceType(e.target.value as ServiceType)
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="parent">Parent Service</option>

                  <option value="child">Child Service</option>
                </select>
              </div>

              {/* Parent Service */}

              {serviceType === "child" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Parent Service
                  </label>

                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="">Select Parent Service</option>

                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {serviceType === "child" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Service Link
                  </label>

                  <input
                    type="url"
                    value={serviceUrl}
                    onChange={(e) => setServiceUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* Icon */}

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Icon
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon"
                    onChange={(e) => {
                      setIconFile(e.target.files?.[0] || null);
                    }}
                    className="block w-full cursor-pointer rounded-md border border-slate-300 bg-white text-sm text-slate-600 file:mr-3 file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                  />

                  {iconFile && (
                    <p className="mt-1 text-xs text-slate-500">
                      Selected: {iconFile.name}
                    </p>
                  )}
                </div>

                {/* Badge */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Badge
                  </label>

                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="">No Badge</option>

                    <option value="NEW">NEW</option>

                    <option value="HOT">HOT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Sort Order */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    placeholder="Example: 1"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                {/* Status */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="1">Active</option>

                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {saving
                    ? "Saving..."
                    : editService
                      ? "Update Service"
                      : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl animate-[modalIn_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Service
              </h2>

              <button
                type="button"
                onClick={() => setDeleteService(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  "{deleteService.name}"
                </span>
                ?
              </p>

              {deleteService.parent_id === null && (
                <p className="mt-2 text-xs text-red-500">
                  Deleting this parent service will also delete all of its child
                  services.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setDeleteService(null)}
                disabled={deleting}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteService}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllServices;
