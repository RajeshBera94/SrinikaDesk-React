import { FileText, Image, IdCard, Landmark, ScanLine } from "lucide-react";
import { useEffect, useRef, useState, type ElementType } from "react";

type Service = {
  id: number;
  name: string;
  icon: ElementType;
  badge?: "NEW" | "HOT";
  children?: string[];
};

type ServiceCategory = {
  id: number;
  title: string;
  services: Service[];
};

const serviceCategories: ServiceCategory[] = [
   {
    id: 5,
    title: "Portal Service",
    services: [
      {
        id: 29,
        name: "Aadhaar",
        icon: Landmark,
        children: [
          "Aadhaar Download",
          "Aadhaar Update",
          "Aadhaar Status",
          "Aadhaar PVC",
          "Aadhaar Information",
        ],
      },
      {
        id: 30,
        name: "PAN Card",
        icon: IdCard,
        children: [
          "pan Download",
          "pan Update",
          "pan Status",
          "pan PVC",
          "pan Information",
        ],
      },
      {
        id: 31,
        name: "Voter ID",
        icon: IdCard,
        children: [
          "votar Download",
          "votar Update",
          "votar Status",
          "votar PVC",
          "votar Information",
        ],
      },
      {
        id: 32,
        name: "Udyam",
        icon: FileText,
      },
      {
        id: 33,
        name: "Ayushman Bharat",
        icon: Landmark,
      },
      {
        id: 34,
        name: "ABHA",
        icon: Landmark,
      },
      {
        id: 35,
        name: "EPFO",
        icon: FileText,
      },
      {
        id: 36,
        name: "Passport",
        icon: FileText,
      },
      {
        id: 37,
        name: "Driving Licence",
        icon: IdCard,
      },
      {
        id: 38,
        name: "Ration Card",
        icon: IdCard,
      },
      {
        id: 39,
        name: "Birth Certificate",
        icon: FileText,
      },
      {
        id: 40,
        name: "Death Certificate",
        icon: FileText,
      },
      {
        id: 41,
        name: "GST",
        icon: FileText,
      },
      {
        id: 42,
        name: "e-District",
        icon: Landmark,
      },
    ],
  },
  {
    id: 1,
    title: "Essential & Services",
    services: [
      {
        id: 1,
        name: "Photo Crop & Resize",
        icon: Image,
      },
      {
        id: 2,
        name: "Passport Photo Maker",
        icon: Image,
      },
      {
        id: 3,
        name: "Background Remove",
        icon: Image,
        badge: "NEW",
      },
      {
        id: 4,
        name: "Photo Print",
        icon: Image,
      },
      {
        id: 5,
        name: "Document Scan",
        icon: ScanLine,
      },
      {
        id: 6,
        name: "PDF to Image",
        icon: FileText,
      },
      {
        id: 7,
        name: "Image to PDF",
        icon: FileText,
      },
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
      {
        id: 9,
        name: "CV Maker",
        icon: FileText,
      },
      {
        id: 10,
        name: "Marriage Biodata",
        icon: FileText,
      },
      {
        id: 11,
        name: "Visiting Card",
        icon: IdCard,
      },
      {
        id: 12,
        name: "Letterhead Design",
        icon: FileText,
      },
      {
        id: 13,
        name: "ID Card Design",
        icon: IdCard,
      },
      {
        id: 14,
        name: "Certificate Design",
        icon: FileText,
      },
    ],
  },

  {
    id: 3,
    title: "Smart PDF & Image Tools",
    services: [
      {
        id: 15,
        name: "PDF Merge",
        icon: FileText,
      },
      {
        id: 16,
        name: "PDF Split",
        icon: FileText,
      },
      {
        id: 17,
        name: "PDF Compress",
        icon: FileText,
      },
      {
        id: 18,
        name: "PDF to Word",
        icon: FileText,
      },
      {
        id: 19,
        name: "Word to PDF",
        icon: FileText,
      },
      {
        id: 20,
        name: "Image Compress",
        icon: Image,
      },
      {
        id: 21,
        name: "Image Resize",
        icon: Image,
      },
    ],
  },

  {
    id: 4,
    title: "Card Printing Services",
    services: [
      {
        id: 22,
        name: "Aadhaar Card Print",
        icon: IdCard,
      },
      {
        id: 23,
        name: "PAN Card Print",
        icon: IdCard,
      },
      {
        id: 24,
        name: "Voter ID Card Print",
        icon: IdCard,
      },
      {
        id: 25,
        name: "PVC Card Print",
        icon: IdCard,
        badge: "NEW",
      },
      {
        id: 26,
        name: "Ayushman Card Print",
        icon: IdCard,
      },
      {
        id: 27,
        name: "ABHA Card Print",
        icon: IdCard,
      },
      {
        id: 28,
        name: "Udyam Certificate Print",
        icon: FileText,
      },
    ],
  },

 
];

const Services = () => {
  const [openService, setOpenService] = useState<number | null>(null);
  const [portalColumns, setPortalColumns] = useState(6);

  const portalGridRef = useRef<HTMLDivElement | null>(null);

  // Detect how many cards can fit in Portal Service
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

  const handleServiceClick = (service: Service) => {
    if (!service.children?.length) {
      return;
    }

    setOpenService((current) => (current === service.id ? null : service.id));
  };

  const ServiceCard = ({ service }: { service: Service }) => {
    const Icon = service.icon;

    return (
      <button
        type="button"
        onClick={() => handleServiceClick(service)}
        className="group relative flex min-h-28 w-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md cursor-pointer"
      >
        {service.badge && (
          <span className="absolute right-2 top-2 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">
            {service.badge}
          </span>
        )}

        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition-colors duration-200 group-hover:bg-sky-600 group-hover:text-white">
          <Icon size={23} strokeWidth={1.8} />
        </div>

        <span className="text-sm font-medium leading-5 text-slate-700 group-hover:text-sky-700">
          {service.name}
        </span>
      </button>
    );
  };

  const ChildServices = ({ service }: { service: Service }) => {
    if (!service.children?.length) {
      return null;
    }

    return (
      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 animate-[childServiceIn_0.25s_ease-out]">
        <h3 className="mb-3 text-base font-semibold text-slate-800">
          {service.name} Services
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {service.children.map((child) => (
            <button
              key={child}
              type="button"
              className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 cursor-pointer"
            >
              {child}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPortalServices = (services: Service[]) => {
    const rows: Service[][] = [];

    for (let i = 0; i < services.length; i += portalColumns) {
      rows.push(services.slice(i, i + portalColumns));
    }

    return (
      <>
        {rows.map((row, rowIndex) => {
          const openedService = row.find(
            (service) => service.id === openService,
          );

          return (
            <div key={rowIndex}>
              {/* Service Row */}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${portalColumns}, minmax(0, 1fr))`,
                }}
              >
                {row.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Child panel for this row */}
              {openedService && <ChildServices service={openedService} />}

              {/* Gap between rows */}
              {rowIndex < rows.length - 1 && <div className="h-3" />}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-8">
      {serviceCategories.map((category) => (
        <section key={category.id}>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            {category.title}
          </h2>

          {category.id === 5 ? (
            // Portal Service
            <div ref={portalGridRef}>
              {renderPortalServices(category.services)}
            </div>
          ) : (
            // Normal Service Categories
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {category.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default Services;
