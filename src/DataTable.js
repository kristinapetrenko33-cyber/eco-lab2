import React, { useState } from "react";

function DataTable({ stations, onEdit, onDelete }) {
  const [showDetails, setShowDetails] = useState(null);

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Місто</th>
            <th>Координати</th>
            <th>Контакт</th>
            <th>Типи вимірювань</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <React.Fragment key={station._id}>
              <tr>
                <td>{station.name}</td>
                <td>{station.city}</td>
                <td>
                  {station.latitude}, {station.longitude}
                </td>
                <td>
                  {station.contact
                    ? `${station.contact.email || ""} ${
                        station.contact.phone || ""
                      }`
                    : ""}
                </td>
                <td>{station.measurement_types?.join(", ")}</td>
                <td>
                  <button onClick={() => onEdit(station)}>Редагувати</button>
                  <button onClick={() => onDelete(station._id)}>
                    Видалити
                  </button>
                  <button
                    onClick={() =>
                      setShowDetails(
                        showDetails === station._id ? null : station._id
                      )
                    }
                  >
                    Дивитись вимірювання
                  </button>
                </td>
              </tr>
              {showDetails === station._id && (
                <tr>
                  <td colSpan={6}>
                    <div style={{ background: "#f9f9ff", padding: "10px" }}>
                      <b>Значення вимірювань:</b>
                      <ul style={{ marginTop: 4 }}>
                        {station.measurement_values ? (
                          Object.entries(station.measurement_values).map(
                            ([type, value]) => (
                              <li key={type}>
                                {type.replace("_", ".")}: <b>{value}</b>
                              </li>
                            )
                          )
                        ) : (
                          <em>Немає даних</em>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {stations.length === 0 && (
        <div style={{ padding: "15px", color: "#c62828" }}>
          Немає доступних станцій
        </div>
      )}
    </div>
  );
}

export default DataTable;
