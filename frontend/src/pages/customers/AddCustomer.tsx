import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";

type CustomarFormProps = {
  onSuccess: () => void;
  customer?: {
    id: number;
    name: string;
    phone: string;
    photo: string | null;
  };
};

const AddCustomer = ({ onSuccess, customer }: CustomarFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setphoto] = useState<File | null>(null);
  const [errorName, setErrorName] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [serverError, setServerError] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalPhoto, setOriginalPhoto] = useState("");

  useEffect(() => {
    if (!customer) {
      setName("");
      setPhone("");
      setphoto(null);

      setOriginalName("");
      setOriginalPhone("");
      setOriginalPhoto("");

      return;
    }
    setName(customer.name);
    setPhone(customer.phone);
    setphoto(null);

    setOriginalName(customer.name);
    setOriginalPhone(customer.phone);
    setOriginalPhoto(customer.photo ?? "");
  }, [customer]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorName("Name is required");
      return;
    }
    if (!phone.trim()) {
      setErrorPhone("Phone Number is required");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setErrorPhone("Enter a valid 10-digit phone number");
      return;
    }

    //Compare Data For Update Customer
    if (customer) {
      const nameChanged = name.trim() !== originalName.trim();
      const phoneChanged = phone.trim() !== originalPhone.trim();
      const photoChanged = photo !== null;

      if (!nameChanged && !phoneChanged && !photoChanged) {
        setServerError("No changes made");
        return;
      }
    }

    // add Customar to Backend

    const url = customer
      ? `http://localhost:5000/api/customers/${customer.id}`
      : "http://localhost:5000/api/customers";

    const method = customer ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("phone", phone.trim());

    if (photo) {
      formData.append("photo", photo);
    }

    const response = await fetch(url, {
      method,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setServerError(data.message);
      return;
    }
    onSuccess();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <Input
          id="name"
          type="text"
          value={name}
          label="Coustomar Name"
          onChange={(e) => {
            setName(e.target.value);
            setErrorName("");
          }}
          placeholder="Enter customer name"
          error={errorName}
        />
      </div>

      <div>
        <Input
          id="phone"
          label="Phone Number"
          type="tell"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            if (value.length <= 10) {
              setPhone(value);
              setErrorPhone("");
            }
          }}
          placeholder="Enter mobile number"
          error={errorPhone}
        />
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div>
        <label
          htmlFor="photo"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Customer Photo
        </label>

        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setphoto(file);
          }}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        />

        {photo ? (
          // নতুন photo select করলে
          <div className="mt-3">
            <img
              src={URL.createObjectURL(photo)}
              alt="Customer Preview"
              className="h-20 w-20 rounded-md object-cover"
            />
          </div>
        ) : originalPhoto ? (
          // Edit করার সময় পুরনো photo
          <div className="mt-3">
            <img
              src={`http://localhost:5000/uploads/customers/${originalPhoto}`}
              alt="Customer Photo"
              className="h-20 w-20 rounded-md object-cover"
            />
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 cursor-pointer"
      >
        {customer ? "Update Customar" : "Add Customar"}
      </button>
    </form>
  );
};

export default AddCustomer;
