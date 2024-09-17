
# DDoS Attack Detection - Feature Engineering

This project aims to detect DDoS attacks using machine learning techniques. The feature engineering process includes creating new features, transforming existing ones, handling missing values, and reducing dimensionality to improve the model's performance.

## Feature Engineering Steps

### 1. Creating New Features

We created new features to provide more meaningful information to the model:

- **Packet Rate**: Calculated as the number of packets per flow (`pktperflow / dur`).
- **Byte Rate**: Calculated as the number of bytes per flow (`byteperflow / dur`).

These features help the model understand the rate of packet and byte transfer, which is crucial for detecting abnormal patterns.

### 2. Transforming Features

To make features more suitable for modeling, we applied transformations:

- **Log Transformation**: Applied to the `bytecount` feature to handle skewness using the `log1p` function to avoid taking the log of zero values.

### 3. Encoding Categorical Variables

Categorical variables were converted into numerical format using one-hot encoding to make them compatible with machine learning algorithms.

- Used `dummyVars` from the `caret` package to create dummy variables for categorical columns with more than one level.

### 4. Handling Missing Values

Missing values in the dataset were imputed using the k-Nearest Neighbors (kNN) algorithm:

- We used the `VIM` package's `kNN` function to impute missing values based on the nearest neighbors in the dataset.

### 5. Dimensionality Reduction

To reduce the complexity of the model and improve its performance, we applied Principal Component Analysis (PCA):

- Reduced the number of features to 5 principal components while retaining the most important information.

## Visualizations

### Feature Importance

We trained a Random Forest model to determine the importance of each feature in predicting DDoS attacks. The plot below shows the top features ranked by their importance.

![Feature Importance](feature_importance.png)

### Correlation Heatmap

A correlation heatmap of the top 10 most important features helps us understand the relationships between them. High correlations indicate redundancy, which can guide further feature selection.

![Correlation Heatmap](correlation_heatmap.png)

## How to Run

1. Install necessary R packages: `readr`, `dplyr`, `caret`, `VIM`, `corrplot`, `ggplot2`, and `randomForest`.
2. Run the full R code provided in the `feature_engineering.R` script.
3. View the generated visualizations for feature importance and correlation heatmap.

## Interactivity Suggestions

To make this feature engineering process interactive and visually engaging:

- **Interactive Dashboard**: Implement an R Shiny dashboard where users can upload their dataset, apply feature engineering steps, and visualize the results in real-time.
- **Interactive Plot**: Use `plotly` in R to create interactive feature importance and correlation plots where users can hover over points to get detailed information.
- **Model Comparison**: Allow users to run different models on the engineered features and compare their performance metrics (e.g., accuracy, precision, recall).

## Conclusion

This feature engineering process enhances the dataset by creating informative features, handling missing values, and reducing dimensionality. These steps are crucial for building an effective DDoS detection model.
