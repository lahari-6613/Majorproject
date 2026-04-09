import os
import random
import numpy as np
import tensorflow as tf

SEED = 42

os.environ['PYTHONHASHSEED'] = str(SEED)
random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)



import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve
)

from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    Input, Conv1D, MaxPooling1D,
    Dense, Dropout, GlobalAveragePooling1D
)
from tensorflow.keras.optimizers import Adam

# 1. LOAD DATASET
df = pd.read_csv("heart.csv")

if 'target' in df.columns:
    df.rename(columns={'target': 'condition'}, inplace=True)

df.replace('?', np.nan, inplace=True)
df.dropna(inplace=True)

X = df.drop('condition', axis=1).astype(float)
print(X.columns)
y = df['condition'].astype(int)

# 2. NORMALIZATION
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

import joblib
joblib.dump(scaler, "scaler.pkl")


# 3. EUCLIDEAN DISTANCE BASED CLEANING
mean_vector = np.mean(X_scaled, axis=0)
distances = np.linalg.norm(X_scaled - mean_vector, axis=1)

threshold = np.percentile(distances, 95)
X_clean = X_scaled[distances < threshold]
y_clean = y.values[distances < threshold]

# 4. ELEPHANT HERDING OPTIMIZATION (EHO)
def fitness_function(mask, X, y):
    if np.sum(mask) == 0:
        return 0
    X_sel = X[:, mask == 1]
    X_tr, X_te, y_tr, y_te = train_test_split(
        X_sel, y, test_size=0.2, random_state=42
    )
    from sklearn.linear_model import LogisticRegression
    model = LogisticRegression(max_iter=1000)
    model.fit(X_tr, y_tr)
    return model.score(X_te, y_te)

def run_eho(X, y, n_elephants=12, iterations=20, alpha=0.5):
    # np.random.seed(42)
    n_features = X.shape[1]
    population = np.random.randint(0, 2, (n_elephants, n_features))

    for _ in range(iterations):
        fitness = np.array([fitness_function(e, X, y) for e in population])
        best = population[np.argmax(fitness)]

        for i in range(n_elephants):
            r = np.random.rand(n_features)
            population[i] = population[i] + alpha * r * (best - population[i])
            population[i] = (population[i] > 0.5).astype(int)

        population[np.argmin(fitness)] = np.random.randint(0, 2, n_features)

    final_fitness = np.array([fitness_function(e, X, y) for e in population])
    return population[np.argmax(final_fitness)]

best_features = run_eho(X_clean, y_clean)
X_selected = X_clean[:, best_features == 1]

print("Selected feature mask:", best_features)
print("Selected feature count:", X_selected.shape[1])
print("Selected feature names:", X.columns[best_features == 1])

print("Selected features count:", X_selected.shape[1])

# 5. DATA PREPARATION FOR CNN
X_selected = X_selected.reshape(X_selected.shape[0], X_selected.shape[1], 1)

X_train, X_test, y_train, y_test = train_test_split(
    X_selected, y_clean, test_size=0.2, random_state=42
)

# 6. HYBRID 3-LAYER CNN MODEL (CURRENT PROJECT)
input_layer = Input(shape=(X_train.shape[1], 1))

# CNN Layer 1
x = Conv1D(32, 3, activation='relu', padding='same')(input_layer)
x = MaxPooling1D(2, padding='same')(x)
x = Dropout(0.2)(x)

# CNN Layer 2
x = Conv1D(64, 3, activation='relu', padding='same')(x)
x = MaxPooling1D(2, padding='same')(x)
x = Dropout(0.3)(x)

# CNN Layer 3
x = Conv1D(128, 3, activation='relu', padding='same')(x)
x = GlobalAveragePooling1D()(x)

# Fully Connected Layers
x = Dense(128, activation='relu')(x)
x = Dropout(0.3)(x)

output = Dense(1, activation='sigmoid')(x)

model = Model(inputs=input_layer, outputs=output)

model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()

print(model.input_shape)

# 7. TRAINING
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=10,
    validation_split=0.2,
    verbose=1
    # shuffle=False
)
# Save trained model
model.save("heart_model.h5")


# 8. EVALUATION METRICS
y_prob = model.predict(X_test).ravel()
y_pred = (y_prob > 0.5).astype(int)

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc = roc_auc_score(y_test, y_prob)

tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
specificity = tn / (tn + fp)

print("\n===== MODEL PERFORMANCE =====")
print(f"Accuracy     : {accuracy:.4f}")
print(f"Precision    : {precision:.4f}")
print(f"Sensitivity  : {recall:.4f}")
print(f"Specificity  : {specificity:.4f}")
print(f"F1-score     : {f1:.4f}")
print(f"ROC-AUC      : {roc:.4f}")




# 9. CONFUSION MATRIX
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()


import matplotlib.pyplot as plt

# ==========================================================
# ACCURACY & LOSS CURVES
# ==========================================================
plt.figure(figsize=(12, 5))

# -------- Accuracy Curve --------
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train', linewidth=2)
plt.plot(history.history['val_accuracy'], label='Val', linewidth=2)
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.title('Accuracy')
plt.legend()
plt.grid(True)

# -------- Loss Curve --------
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train', linewidth=2)
plt.plot(history.history['val_loss'], label='Val', linewidth=2)
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.title('Loss')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()


# ==========================================================
# 10. TRAINING CURVES
# ==========================================================
# plt.figure(figsize=(12,5))

# plt.subplot(1,2,1)
# plt.plot(history.history['accuracy'], label='Train')
# plt.plot(history.history['val_accuracy'], label='Validation')
# plt.title("Accuracy vs Epoch")
# plt.xlabel("Epochs")
# plt.ylabel("Accuracy")
# plt.legend()

# plt.subplot(1,2,2)
# plt.plot(history.history['loss'], label='Train')
# plt.plot(history.history['val_loss'], label='Validation')
# plt.title("Loss vs Epoch")
# plt.xlabel("Epochs")
# plt.ylabel("Loss")
# plt.legend()

# plt.tight_layout()
# plt.show()

# ==========================================================
# 11. ROC CURVE
# ==========================================================
# fpr, tpr, _ = roc_curve(y_test, y_prob)
# plt.plot(fpr, tpr, label=f"AUC = {roc:.2f}")
# plt.plot([0,1], [0,1], '--')
# plt.xlabel("False Positive Rate")
# plt.ylabel("True Positive Rate")
# plt.title("ROC Curve")
# plt.legend()
# plt.show()
