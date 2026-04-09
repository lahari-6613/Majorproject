// import React, { useEffect, useState } from "react";
// import "../styles/main.css";

// function AdminDashboard() {

//   const [patients, setPatients] = useState([]);

//   const fetchPatients = async () => {
//     const response = await fetch("http://localhost:8000/patients");
//     const data = await response.json();
//     setPatients(data.patients);
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const handleDelete = async (id) => {

//     if (!window.confirm("Are you sure you want to delete this record?")) return;

//     await fetch(`http://localhost:8000/patients/${id}`, {
//       method: "DELETE"
//     });

//     fetchPatients(); // Refresh table
//   };

//   return (
//     <div className="card-large">
//       <h2>Patient Records</h2>

//       <table className="table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>User ID</th>
//             <th>Patient Name</th>
//             <th>Prediction</th>
//             <th>Confidence</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {patients.map((patient) => (
//             <tr key={patient[0]}>
//               <td>{patient[0]}</td>
//               <td>{patient[1]}</td>
//               <td>{patient[2]}</td>
//               <td>{patient[14]}</td>
//               <td>{(patient[15] * 100).toFixed(2)}%</td>
//               <td>
//                 <button
//                   className="delete-btn"
//                   onClick={() => handleDelete(patient[0])}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//       </table>
//     </div>
//   );
// }

// export default AdminDashboard;

// import React, { useEffect, useState } from "react";
// import "../styles/main.css";

// function AdminDashboard() {

//   const [patients, setPatients] = useState([]);

//   const fetchPatients = async () => {
//     const response = await fetch("http://localhost:8000/patients");
//     const data = await response.json();
//     setPatients(data.patients);
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const handleDelete = async (id) => {

//     if (!window.confirm("Are you sure you want to delete this record?")) return;

//     await fetch(`http://localhost:8000/patients/${id}`, {
//       method: "DELETE"
//     });

//     fetchPatients(); // Refresh table
//   };

//   return (
//     <div className="card-large">
//       <h2>Patient Records</h2>

//       <table className="table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>User ID</th>
//             <th>Patient Name</th>
//             <th>Prediction</th>
//             <th>Confidence</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {patients.map((patient) => (
//             <tr key={patient[0]}>
//               <td>{patient[0]}</td>
//               <td>{patient[1]}</td>
//               <td>{patient[2]}</td>
//               <td>{patient[14]}</td>
//               <td>{(patient[15] * 100).toFixed(2)}%</td>
//               <td>
//                 <button
//                   className="delete-btn"
//                   onClick={() => handleDelete(patient[0])}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//       </table>
//     </div>
//   );
// }

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import "../styles/main.css";

function AdminDashboard() {

  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {

    try {

      const response = await fetch("http://127.0.0.1:8000/patients");
      const data = await response.json();

      setPatients(data.patients);

    } catch (error) {

      console.error("Error fetching patients:", error);

    }

  };

  useEffect(() => {
    fetchPatients();
  }, []);


  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {

      const response = await fetch(`http://127.0.0.1:8000/patients/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {

        alert("Patient deleted successfully");

        fetchPatients(); // refresh table

      } else {

        alert("Delete failed");

      }

    } catch (error) {

      console.error("Delete error:", error);

    }

  };


  return (
    <div className="card-large">

      <h2>Patient Records</h2>

      <table className="table">

        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Patient Name</th>
            <th>Prediction</th>
            <th>Confidence</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {patients.map((patient) => (

            <tr key={patient.id}>

              <td>{patient.id}</td>

              <td>{patient.user_id}</td>

              <td>{patient.patient_name}</td>

              <td>{patient.prediction}</td>

              <td>{(patient.confidence * 100).toFixed(2)}%</td>

              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(patient.id)}
                >
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

}

export default AdminDashboard;