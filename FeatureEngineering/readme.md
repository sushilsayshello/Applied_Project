# 🛡️ DDoS Attack Detection - Feature Engineering

This project aims to detect DDoS attacks using machine learning techniques. The feature engineering process includes creating new features, transforming existing ones, handling missing values, and reducing dimensionality to improve the model's performance.

## 🛠️ Feature Engineering Steps

### 1. 🆕 Creating New Features

We created new features to provide more meaningful information to the model:

- **📊 Packet Rate**: Calculated as the number of packets per flow (`pktperflow / dur`).
- **📊 Byte Rate**: Calculated as the number of bytes per flow (`byteperflow / dur`).

These features help the model understand the rate of packet and byte transfer, which is crucial for detecting abnormal patterns.

### 2. 🔄 Transforming Features

To make features more suitable for modeling, we applied transformations:

- **🔍 Log Transformation**: Applied to the `bytecount` feature to handle skewness using the `log1p` function to avoid taking the log of zero values.

### 3. 🔢 Encoding Categorical Variables

Categorical variables were converted into numerical format using one-hot encoding to make them compatible with machine learning algorithms.

- Used `dummyVars` from the `caret` package to create dummy variables for categorical columns with more than one level.

### 4. 🧩 Handling Missing Values

Missing values in the dataset were imputed using the k-Nearest Neighbors (kNN) algorithm:

- We used the `VIM` package's `kNN` function to impute missing values based on the nearest neighbors in the dataset.

### 5. 📉 Dimensionality Reduction

To reduce the complexity of the model and improve its performance, we applied Principal Component Analysis (PCA):

- Reduced the number of features to 5 principal components while retaining the most important information.

## 📊 Visualizations

### 📈 Feature Importance

We trained a Random Forest model to determine the importance of each feature in predicting DDoS attacks. The plot below shows the top features ranked by their importance.
<img width="765" alt="Screenshot 2024-09-17 at 10 20 22 PM" src="https://github.com/user-attachments/assets/6f9e7012-016b-4de9-a0f4-0cd04b42de76">

<img width="772" alt="Screenshot 2024-09-17 at 10 22 57 PM" src="https://github.com/user-attachments/assets/b3ef06de-09fa-4214-a430-3122c9c43ba0">

<img width="768" alt="Screenshot 2024-09-17 at 10 23 14 PM" src="https://github.com/user-attachments/assets/b0f35c54-bd06-456d-bfb2-8f539d8e18c9">
<img width="768" alt="Screenshot 2024-09-17 at 10 23 14 PM" src="https://github.com/user-attachments/assets/9b9dac6f-5119-47e9-8e2a-dad725683a0d">
<img width="895" alt="Screenshot 2024-09-17 at 10 23 42 PM" src="https://github.com/user-attachments/assets/9b170b2b-1f91-4cc5-a703-693f5c5b73be">



### 🌐 Correlation Heatmap

A correlation heatmap of the top 10 most important features helps us understand the relationships between them. High correlations indicate redundancy, which can guide further feature selection.

<img width="894" alt="Screenshot 2024-09-17 at 10 24 14 PM" src="https://github.com/user-attachments/assets/1bd3f57a-5d71-4803-80eb-9265c5d82890">




## ✅ Conclusion

This feature engineering process enhances the dataset by creating informative features, handling missing values, and reducing dimensionality. These steps are crucial for building an effective DDoS detection model.
