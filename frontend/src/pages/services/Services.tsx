import { FileText, Image, IdCard, Landmark, ScanLine } from "lucide-react";
import { useEffect, useRef, useState, type ElementType } from "react";

type Service = {
  id: number;
  name: string;
  icon: string | null;
  parent_id: number | null;
  badge: "NEW" | "HOT" | null;
  sort_order: number;
  status: number;
};

type StaticService = {
  id: number;
  name: string;
  icon: ElementType;
  badge?: "NEW" | "HOT";
};

type StaticCategory = {
  id: number;
  title: string;
  services: StaticService[];
};

const staticCategories: StaticCategory[] = [
  {
    id: 1,
    title: "Essential & Services",
    services: [
      { id: 1, name: "Photo Crop & Resize", icon: Image },
      { id: 2, name: "Passport Photo Maker", icon: Image },
      {
        id: 3,
        name: "Background Remove",
        icon: Image,
        badge: "NEW",
      },
      { id: 4, name: "Photo Print", icon: Image },
      { id: 5, name: "Document Scan", icon: ScanLine },
      { id: 6, name: "PDF to Image", icon: FileText },
      { id: 7, name: "Image to PDF", icon: FileText },
    ],
  },

  {
    id: 2,
    title: "Creative Design Studio",
    services: [
      {
        id: 8,
        name: "Pro Resume Maker",
        icon: FileText,
        badge: "HOT",
      },
      { id: 9, name: "CV Maker", icon: FileText },
      { id: 10, name: "Marriage Biodata", icon: FileText },
      { id: 11, name: "Visiting Card", icon: IdCard },
      { id: 12, name: "Letterhead Design", icon: FileText },
      { id: 13, name: "ID Card Design", icon: IdCard },
      { id: 14, name: "Certificate Design", icon: FileText },
    ],
  },

  {
    id: 3,
    title: "Smart PDF & Image Tools",
    services: [
      { id: 15, name: "PDF Merge", icon: FileText },
      { id: 16, name: "PDF Split", icon: FileText },
      { id: 17, name: "PDF Compress", icon: FileText },
      { id: 18, name: "PDF to Word", icon: FileText },
      { id: 19, name: "Word to PDF", icon: FileText },
      { id: 20, name: "Image Compress", icon: Image },
      { id: 21, name: "Image Resize", icon: Image },
    ],
  },

  {
    id: 4,
    title: "Card Printing Services",
    services: [
      { id: 22, name: "Aadhaar Card Print", icon: IdCard },
      { id: 23, name: "PAN Card Print", icon: IdCard },
      { id: 24, name: "Voter ID Card Print", icon: IdCard },
      {
        id: 25,
        name: "PVC Card Print",
        icon: IdCard,
        badge: "NEW",
      },
      { id: 26, name: "Ayushman Card Print", icon: IdCard },
      { id: 27, name: "ABHA Card Print", icon: IdCard },
      {
        id: 28,
        name: "Udyam Certificate Print",
        icon: FileText,
      },
    ],
  },
];

// ==================================================
// Icon mapping
// ==================================================

const iconMap: Record<string, ElementType> = {
  FileText,
  Image,
  IdCard,
  Landmark,
  ScanLine,
};

// ==================================================
// Services
// ==================================================

const Services = () => {
  // ------------------------------------------------
  // Portal parent services
  // ------------------------------------------------

  const [portalServices, setPortalServices] = useState<Service[]>([]);

  const [loadingPortal, setLoadingPortal] = useState(true);

  const [portalError, setPortalError] = useState("");

  // ------------------------------------------------
  // Children
  // ------------------------------------------------

  const [children, setChildren] = useState<Record<number, Service[]>>({});

  // ------------------------------------------------
  // Open service
  // ------------------------------------------------

  const [openService, setOpenService] = useState<number | null>(null);

  // ------------------------------------------------
  // Loading child
  // ------------------------------------------------

  const [loadingChildren, setLoadingChildren] = useState<number | null>(null);

  // ------------------------------------------------
  // Responsive columns
  // ------------------------------------------------

  const [portalColumns, setPortalColumns] = useState(6);

  const portalGridRef = useRef<HTMLDivElement | null>(null);

  // ==================================================
  // Fetch Portal Parent Services
  // ==================================================

  const fetchPortalServices = async () => {
    try {
      setLoadingPortal(true);
      setPortalError("");

      const response = await fetch("http://localhost:5000/api/service");

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data: Service[] = await response.json();

      setPortalServices(data);
    } catch (error) {
      console.error(error);

      setPortalError("Unable to load Portal Services");
    } finally {
      setLoadingPortal(false);
    }
  };

  // ==================================================
  // Initial Load
  // ==================================================

  useEffect(() => {
    fetchPortalServices();
  }, []);

  // ==================================================
  // Responsive Columns
  // ==================================================

  useEffect(() => {
    const element = portalGridRef.current;

    if (!element) {
      return;
    }

    const updateColumns = () => {
      const width = element.clientWidth;

      if (width >= 1100) {
        setPortalColumns(6);
      } else if (width >= 900) {
        setPortalColumns(5);
      } else if (width >= 700) {
        setPortalColumns(4);
      } else if (width >= 500) {
        setPortalColumns(3);
      } else {
        setPortalColumns(2);
      }
    };

    updateColumns();

    const observer = new ResizeObserver(updateColumns);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // ==================================================
  // Fetch Children
  // ==================================================

  const fetchChildren = async (parentId: number) => {
    try {
      setLoadingChildren(parentId);

      const response = await fetch(
        `http://localhost:5000/api/service/${parentId}/children`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch child services");
      }

      const data: Service[] = await response.json();

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

  // ==================================================
  // Parent Click
  // ==================================================

  const handlePortalServiceClick = async (service: Service) => {
    // ----------------------------------------------
    // Already open → close
    // ----------------------------------------------

    if (openService === service.id) {
      setOpenService(null);
      return;
    }

    // ----------------------------------------------
    // Children already loaded
    // ----------------------------------------------

    if (children[service.id]) {
      setOpenService(service.id);
      return;
    }

    // ----------------------------------------------
    // Fetch children
    // ----------------------------------------------

    await fetchChildren(service.id);

    setOpenService(service.id);
  };

  // ==================================================
  // Service Card
  // ==================================================

  const ServiceCard = ({
    service,
    onClick,
    active = false,
  }: {
    service: StaticService | Service;
    onClick?: () => void;
    active?: boolean;
  }) => {
    const Icon =
      typeof service.icon === "string"
        ? (iconMap[service.icon] ?? FileText)
        : (service.icon ?? FileText);

    const hasChildren =
      "children" in service &&
      Array.isArray(service.children) &&
      service.children.length > 0;

    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          group
          relative
          flex
          min-h-28
          w-full
          flex-col
          items-center
          justify-center
          rounded-lg
          border
          border-slate-200
          bg-white
          p-4
          text-center
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:border-sky-300
          hover:shadow-md
          cursor-pointer
          ${active ? "border-sky-300 shadow-md" : ""}
        `}
      >
        {/* Badge */}

        {service.badge && (
          <span className="absolute right-2 top-2 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">
            {service.badge}
          </span>
        )}

        {/* Icon */}

        <div
          className={`
            mb-3
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-lg
            bg-sky-50
            text-sky-600
            transition-colors
            duration-200
            group-hover:bg-sky-600
            group-hover:text-white
            ${active ? "bg-sky-600 text-white" : ""}
          `}
        >
          <Icon size={23} strokeWidth={1.8} />
        </div>

        {/* Name */}

        <span
          className={`
            text-sm
            font-medium
            leading-5
            text-slate-700
            group-hover:text-sky-700
            ${active ? "text-sky-700" : ""}
          `}
        >
          {service.name}
        </span>

        {/* Child indicator */}

        {hasChildren && (
          <span className="absolute bottom-2 right-2 text-xs text-slate-400">
            ▾
          </span>
        )}
      </button>
    );
  };

  // ==================================================
  // Child Services
  // ==================================================

  const ChildServices = ({ service }: { service: Service }) => {
    const serviceChildren = children[service.id] || [];

    const isLoading = loadingChildren === service.id;

    return (
      <div
        className={`
          grid
          transition-all
          animate-[childServiceIn_0.25s_ease-out]
          duration-300
          ease-out
          ${
            openService === service.id
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">
                {service.name} Services
              </h3>

              {!isLoading && (
                <span className="text-xs text-slate-400">
                  {serviceChildren.length} Services
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="py-5 text-center text-sm text-slate-500">
                Loading services...
              </div>
            ) : serviceChildren.length === 0 ? (
              <div className="py-5 text-center text-sm text-slate-500">
                No services available.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {serviceChildren.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    className="
                      rounded-md
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-slate-700
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-sky-300
                      hover:text-sky-600
                      hover:shadow-sm
                      cursor-pointer
                    "
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================================================
  // Portal Grid
  // ==================================================

  const renderPortalServices = () => {
    const rows: Service[][] = [];

    for (let i = 0; i < portalServices.length; i += portalColumns) {
      rows.push(portalServices.slice(i, i + portalColumns));
    }

    return (
      <>
        {rows.map((row, rowIndex) => {
          const activeRowService = row.find(
            (service) => service.id === openService,
          );

          return (
            <div key={rowIndex}>
              {/* Parent Row */}

              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${portalColumns}, minmax(0, 1fr))`,
                }}
              >
                {row.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    active={openService === service.id}
                    onClick={() => handlePortalServiceClick(service)}
                  />
                ))}
              </div>

              {/* Child */}

              {activeRowService && <ChildServices service={activeRowService} />}

              {/* Row gap */}

              {rowIndex < rows.length - 1 && <div className="h-3" />}
            </div>
          );
        })}
      </>
    );
  };

  // ==================================================
  // Main UI
  // ==================================================

  return (
    <div className="space-y-8 ">
      {/* =================================================
          Portal Service
      ================================================= */}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          Portal Service
        </h2>

        <div ref={portalGridRef}>
          {loadingPortal ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading Portal Services...
            </div>
          ) : portalError ? (
            <div className="rounded-lg border border-red-200 bg-white p-8 text-center text-sm text-red-500">
              {portalError}
            </div>
          ) : portalServices.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No Portal Services available.
            </div>
          ) : (
            renderPortalServices()
          )}
        </div>
      </section>

      {/* =================================================
          Static Categories
      ================================================= */}

      {staticCategories.map((category) => (
        <section key={category.id}>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            {category.title}
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ">
            {category.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Services;
