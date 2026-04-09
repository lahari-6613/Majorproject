

// import React, { useState } from "react";
// import "../styles/main.css";
// import GaugeChart from "react-gauge-chart";

// function UserDashboard() {

//   const user_id = localStorage.getItem("user_id");

//   const [formData, setFormData] = useState({
//     patient_name: "",
//     sex: "",
//     cp: "",
//     restecg: "",
//     thalach: "",
//     exang: "",
//     oldpeak: "",
//     slope: "",
//     ca: "",
//     thal: ""
//   });

//   const [result, setResult] = useState("");
//   const [confidence, setConfidence] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handlePredict = async () => {

//     const response = await fetch("http://127.0.0.1:8000/predict", {

//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },

//       body: JSON.stringify({
//         user_id: parseInt(user_id),
//         patient_name: formData.patient_name,
//         sex: parseFloat(formData.sex),
//         cp: parseFloat(formData.cp),
//         restecg: parseFloat(formData.restecg),
//         thalach: parseFloat(formData.thalach),
//         exang: parseFloat(formData.exang),
//         oldpeak: parseFloat(formData.oldpeak),
//         slope: parseFloat(formData.slope),
//         ca: parseFloat(formData.ca),
//         thal: parseFloat(formData.thal)
//       })

//     });

//     const data = await response.json();

//     if (response.ok) {
//       setResult(data.prediction);
//       setConfidence(data.confidence_score);
//     } else {
//       alert(data.detail);
//     }

//   };

//   return (

//     <div className="card-large">

//       <h2>Patient Health Details</h2>

//       <div className="grid">

//         <input
//           name="patient_name"
//           placeholder="Patient Name"
//           onChange={handleChange}
//         />

//         <input
//           name="sex"
//           placeholder="Sex (1=Male,0=Female)"
//           onChange={handleChange}
//         />

//         <input
//           name="cp"
//           placeholder="Chest Pain Type"
//           onChange={handleChange}
//         />

//         <input
//           name="restecg"
//           placeholder="Rest ECG"
//           onChange={handleChange}
//         />

//         <input
//           name="thalach"
//           placeholder="Max Heart Rate"
//           onChange={handleChange}
//         />

//         <input
//           name="exang"
//           placeholder="Exercise Angina (1=Yes,0=No)"
//           onChange={handleChange}
//         />

//         <input
//           name="oldpeak"
//           placeholder="Old Peak"
//           onChange={handleChange}
//         />

//         <input
//           name="slope"
//           placeholder="Slope"
//           onChange={handleChange}
//         />

//         <input
//           name="ca"
//           placeholder="Number of Vessels"
//           onChange={handleChange}
//         />

//         <input
//           name="thal"
//           placeholder="Thal"
//           onChange={handleChange}
//         />

//       </div>

//       <button className="predict-btn" onClick={handlePredict}>
//         Predict Risk
//       </button>

//       {result && (

//         <div className="result-box">

//           <h3>Prediction Result</h3>

//           <p>
//             <b>Status:</b> {result}
//           </p>

//           <p>
//             <b>Confidence:</b> {confidence}%
//           </p>
          

//         </div>

//       )}

//     </div>

//   );

// }

// export default UserDashboard;




import React, { useState } from "react";
import "../styles/main.css";
import GaugeChart from "react-gauge-chart";

function UserDashboard() {

  const user_id = localStorage.getItem("user_id");

  const [formData, setFormData] = useState({
    patient_name: "",
    sex: "",
    cp: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: ""
  });

  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
  const [riskMeter, setRiskMeter] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {

    try {

      const response = await fetch("http://127.0.0.1:8000/predict", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          user_id: parseInt(user_id),

          patient_name: formData.patient_name,

          sex: parseFloat(formData.sex),
          cp: parseFloat(formData.cp),
          restecg: parseFloat(formData.restecg),
          thalach: parseFloat(formData.thalach),
          exang: parseFloat(formData.exang),
          oldpeak: parseFloat(formData.oldpeak),
          slope: parseFloat(formData.slope),
          ca: parseFloat(formData.ca),
          thal: parseFloat(formData.thal)

        })

      });

      const data = await response.json();

      if (response.ok) {

        setResult(data.prediction);
        setConfidence(data.confidence_score);
        setRiskMeter(data.risk_meter);

      } else {

        alert(data.detail);

      }

    } catch (error) {

      console.error(error);
      alert("Server connection failed");

    }

  };

  return (

    <div className="card-large">

      <h2>Patient Health Details</h2>

      <div className="grid">

        <input
          name="patient_name"
          placeholder="Patient Name"
          onChange={handleChange}
        />

        <input
          name="sex"
          placeholder="Sex (1=Male,0=Female)"
          onChange={handleChange}
        />

        <input
          name="cp"
          placeholder="Chest Pain Type"
          onChange={handleChange}
        />

        <input
          name="restecg"
          placeholder="Rest ECG"
          onChange={handleChange}
        />

        <input
          name="thalach"
          placeholder="Max Heart Rate"
          onChange={handleChange}
        />

        <input
          name="exang"
          placeholder="Exercise Angina (1=Yes,0=No)"
          onChange={handleChange}
        />

        <input
          name="oldpeak"
          placeholder="Old Peak"
          onChange={handleChange}
        />

        <input
          name="slope"
          placeholder="Slope"
          onChange={handleChange}
        />

        <input
          name="ca"
          placeholder="Number of Vessels"
          onChange={handleChange}
        />

        <input
          name="thal"
          placeholder="Thal"
          onChange={handleChange}
        />

      </div>

      <button className="predict-btn" onClick={handlePredict}>
        Predict Risk
      </button>

      {result && (

        <div className="result-box">

          <h3>Prediction Result</h3>

          <p>
            <b>Status:</b> {result}
          </p>

          <p>
            <b>Confidence:</b> {confidence}%
          </p>

          <div style={{ width: "400px", margin: "auto" }}>

            <GaugeChart
              id="risk-gauge"
              nrOfLevels={20}
              percent={riskMeter / 100}
              colors={["#00FF00", "#FFC300", "#FF0000"]}
              arcWidth={0.3}
              textColor="#000"
            />

            <p style={{ textAlign: "center", fontWeight: "bold" }}>
              Risk Meter: {riskMeter}%
            </p>

          </div>

        </div>

      )}

    </div>

  );

}

export default UserDashboard;