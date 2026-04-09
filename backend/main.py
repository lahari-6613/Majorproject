# -------------------------------
# IMPORTS
# -------------------------------
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import numpy as np
import tensorflow as tf
import joblib

# -------------------------------
# FASTAPI INITIALIZATION
# -------------------------------
app = FastAPI()

# -------------------------------
# ENABLE CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# MODEL PATHS
# -------------------------------
MODEL_PATH = "model/heart_model.h5"
SCALER_PATH = "model/scaler.pkl"
FEATURES_PATH = "model/features.pkl"   # ✅ NEW

model = None
scaler = None
features = None   # ✅ NEW

# -------------------------------
# LOAD MODEL ON STARTUP
# -------------------------------
@app.on_event("startup")
def load_model():
    global model, scaler, features

    print("Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded")

    scaler = joblib.load(SCALER_PATH)
    print("Scaler loaded")

    features = joblib.load(FEATURES_PATH)   # ✅ NEW
    print("Feature order:", features)

# -------------------------------
# DATABASE CONNECTION
# -------------------------------
conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()

# -------------------------------
# USERS TABLE
# -------------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    mobile TEXT,
    password TEXT,
    role TEXT
)
""")

# -------------------------------
# PATIENTS TABLE
# -------------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    patient_name TEXT,
    sex REAL,
    cp REAL,
    restecg REAL,
    thalach REAL,
    exang REAL,
    oldpeak REAL,
    slope REAL,
    ca REAL,
    thal REAL,
    prediction TEXT,
    confidence REAL
)
""")

conn.commit()

# -------------------------------
# CREATE DEFAULT ADMIN
# -------------------------------
cursor.execute("SELECT * FROM users WHERE username=?", ("admin_cc",))
admin_exists = cursor.fetchone()

if not admin_exists:
    cursor.execute(
        "INSERT INTO users (username,email,mobile,password,role) VALUES (?,?,?,?,?)",
        ("admin_cc", "admin@gmail.com", "9999999999", "admin1", "admin")
    )
    conn.commit()

# -------------------------------
# REQUEST MODELS
# -------------------------------
class UserRegister(BaseModel):
    username: str
    email: str
    mobile: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str
    role: str


class PatientInput(BaseModel):
    user_id: int
    patient_name: str
    sex: float
    cp: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

# -------------------------------
# REGISTER
# -------------------------------
@app.post("/register")
def register(user: UserRegister):
    try:
        cursor.execute(
            "INSERT INTO users (username,email,mobile,password,role) VALUES (?,?,?,?,?)",
            (user.username, user.email, user.mobile, user.password, "user")
        )
        conn.commit()
        return {"message": "User registered successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username or Email already exists")

# -------------------------------
# LOGIN
# -------------------------------
@app.post("/login")
def login(user: UserLogin):
    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=? AND role=?",
        (user.username, user.password, user.role)
    )

    result = cursor.fetchone()

    if result:
        return {"message": "Login successful", "user_id": result[0]}

    raise HTTPException(status_code=401, detail="Invalid credentials")

# -------------------------------
# PREDICTION (FIXED)
# -------------------------------
@app.post("/predict")
def predict(data: PatientInput):

    # 🔥 STEP 1: Map input values
    input_dict = {
        "sex": data.sex,
        "cp": data.cp,
        "restecg": data.restecg,
        "thalach": data.thalach,
        "exang": data.exang,
        "oldpeak": data.oldpeak,
        "slope": data.slope,
        "ca": data.ca,
        "thal": data.thal
    }

    # 🔥 STEP 2: Arrange according to training order
    input_data = np.array([[input_dict[f] for f in features]])

    # STEP 3: Scale
    scaled_data = scaler.transform(input_data)

    # STEP 4: Reshape for CNN
    scaled_data = scaled_data.reshape(
        scaled_data.shape[0],
        scaled_data.shape[1],
        1
    )

    # STEP 5: Prediction
    prediction_prob = float(model.predict(scaled_data)[0][0])

    if prediction_prob >= 0.5:
        result = "High Risk of Heart Disease"
        confidence = prediction_prob
    else:
        result = "Low Risk of Heart Disease"
        confidence = 1 - prediction_prob

    # -------------------------------
    # SAVE TO DB
    # -------------------------------
    cursor.execute("""
    INSERT INTO patients (
        user_id, patient_name, sex, cp, restecg,
        thalach, exang, oldpeak, slope, ca, thal,
        prediction, confidence
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        data.user_id,
        data.patient_name,
        data.sex,
        data.cp,
        data.restecg,
        data.thalach,
        data.exang,
        data.oldpeak,
        data.slope,
        data.ca,
        data.thal,
        result,
        float(confidence)
    ))

    conn.commit()

    return {
        "prediction": result,
        "confidence_score": round(confidence * 100, 2),
        "risk_meter": round(prediction_prob * 100, 2)
    }

# -------------------------------
# ADMIN VIEW
# -------------------------------
@app.get("/patients")
def get_all_patients():

    cursor.execute("SELECT * FROM patients")
    rows = cursor.fetchall()

    patients = []

    for r in rows:
        patients.append({
            "id": r[0],
            "user_id": r[1],
            "patient_name": r[2],
            "prediction": r[12],
            "confidence": float(r[13])
        })

    return {"patients": patients}

# -------------------------------
# DELETE
# -------------------------------
@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):

    cursor.execute("DELETE FROM patients WHERE id=?", (patient_id,))
    conn.commit()

    return {"message": "Patient deleted successfully"}

# -------------------------------
# ROOT
# -------------------------------
@app.get("/")
def home():
    return {"message": "Heart Disease Prediction Backend Running"}