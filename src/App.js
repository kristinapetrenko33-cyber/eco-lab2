import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import "./App.css";

const API_URL = "http://localhost:3000/api/stations";

const typesList = ["PM2.5", "PM10", "Temperature", "Humidity", "NO2"];

function App() {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    city: "",
    latitude: "",
    longitude: "",
    contactEmail: "",
    contactPhone: "",
    measurement_types: [],
    measurement_values: {},
    _id: null,
  });
  const [editing, setEditing] = useState(false);

  // Fetch all stations
  const fetchStations = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStations(data.data);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle measurement types
  const handleMeasurementType = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      measurement_types: checked
        ? [...prev.measurement_types, value]
        : prev.measurement_types.filter((t) => t !== value),
      measurement_values: checked
        ? { ...prev.measurement_values, [value.replace(".", "_")]: "" }
        : Object.fromEntries(
            Object.entries(prev.measurement_values).filter(
              ([key]) => key !== value.replace(".", "_")
            )
          ),
    }));
  };

  // Handle measurement value change
  const handleMeasurementValue = (type, val) => {
    setForm((prev) => ({
      ...prev,
      measurement_values: {
        ...prev.measurement_values,
        [type.replace(".", "_")]: val,
      },
    }));
  };

  // Submit new or edited station
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      city: form.city,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      contact: {
        email: form.contactEmail,
        phone: form.contactPhone,
      },
      measurement_types: form.measurement_types,
      measurement_values: Object.fromEntries(
        Object.entries(form.measurement_values).map(([k, v]) => [k, Number(v)])
      ),
    };
    if (editing && form._id) {
      await fetch(`${API_URL}/${form._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setForm({
      name: "",
      city: "",
      latitude: "",
      longitude: "",
      contactEmail: "",
      contactPhone: "",
      measurement_types: [],
      measurement_values: {},
      _id: null,
    });
    setEditing(false);
    fetchStations();
  };

  // Edit handler
  const handleEdit = (station) => {
    setForm({
      name: station.name,
      city: station.city,
      latitude: station.latitude,
      longitude: station.longitude,
      contactEmail: station.contact?.email || "",
      contactPhone: station.contact?.phone || "",
      measurement_types: station.measurement_types,
      measurement_values: station.measurement_values || {},
      _id: station._id,
    });
    setEditing(true);
  };

  // Delete handler
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchStations();
  };

  return (
    <div className="App">
      <h1>Станції моніторингу довкілля</h1>
      <form className="station-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Назва станції"
          required
        />
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Місто"
          required
        />
        <input
          type="number"
          name="latitude"
          value={form.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          required
        />
        <input
          type="number"
          name="longitude"
          value={form.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          required
        />
        <input
          type="email"
          name="contactEmail"
          value={form.contactEmail}
          onChange={handleChange}
          placeholder="Email станції"
        />
        <input
          type="text"
          name="contactPhone"
          value={form.contactPhone}
          onChange={handleChange}
          placeholder="Телефон станції"
        />
        <div className="measurement-types">
          <label>Тип вимірювань:</label>
          {typesList.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                checked={form.measurement_types.includes(type)}
                onChange={handleMeasurementType}
              />
              {type}
              {form.measurement_types.includes(type) && (
                <input
                  style={{ width: "60px", marginLeft: "4px" }}
                  type="number"
                  placeholder="Значення"
                  value={form.measurement_values[type.replace(".", "_")] ?? ""}
                  onChange={(e) => handleMeasurementValue(type, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
        <button type="submit">{editing ? "Оновити" : "Додати"}</button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setForm({
                name: "",
                city: "",
                latitude: "",
                longitude: "",
                contactEmail: "",
                contactPhone: "",
                measurement_types: [],
                measurement_values: {},
                _id: null,
              });
              setEditing(false);
            }}
          >
            Відміна
          </button>
        )}
      </form>

      <DataTable
        stations={stations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
