# Step 1: Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import SGDClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pickle

# Step 2: Load the dataset
from google.colab import files
uploaded = files.upload()  # Upload dataset_sdn.csv from local machine

dataset_path = 'dataset_sdn.csv'  # This should match the uploaded file name
ddos_data = pd.read_csv(dataset_path)

# Step 3: Data Preprocessing

# Remove missing values if there are any
ddos_data.dropna(inplace=True)

# Encode categorical variables (if any)
label_encoders = {}
for column in ddos_data.select_dtypes(include=['object']).columns:
    le = LabelEncoder()
    ddos_data[column] = le.fit_transform(ddos_data[column])
    label_encoders[column] = le

# Split the dataset into features (X) and target (y)
X = ddos_data.iloc[:, :-1]  # All columns except the last one are features
y = ddos_data.iloc[:, -1]   # The last column is the target (attack/no attack)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Standardize the feature values (this is important for some models)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Step 4: Function to evaluate models
def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    return model

# Step 5: Train and evaluate models
models = {
    'KNN': KNeighborsClassifier(n_neighbors=5),
    'NaiveBayes': GaussianNB(),
    'SGD': SGDClassifier(max_iter=1000, tol=1e-3),
    'XGBoost': XGBClassifier(use_label_encoder=False, eval_metric='mlogloss'),
    'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42)
}

trained_models = {}

for model_name, model in models.items():
    print(f"\nTraining and Evaluating {model_name}:")
    model.fit(X_train_scaled, y_train)
    evaluate_model(model, X_test_scaled, y_test)
    trained_models[model_name] = model

# Step 6: Save the models and scaler
for model_name, model in trained_models.items():
    with open(f'{model_name}_model.pkl', 'wb') as model_file:
        pickle.dump(model, model_file)

with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

print("\nModels and scaler saved successfully!")

# Step 7: Download the models and scaler
from google.colab import files

for model_name in trained_models:
    files.download(f'{model_name}_model.pkl')
    
files.download('scaler.pkl')
