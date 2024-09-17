# Load necessary libraries
library(readr)
library(dplyr)
library(ggplot2)
library(caret)
library(randomForest)
library(corrplot)

# Load the dataset
dataset <- read_csv("Downloads/SampleDDoS - Sheet1.csv")
View(dataset)

# View the first few rows of the dataset
head(dataset)

# Summary of the dataset
summary(dataset)

# Check for missing values
sum(is.na(dataset))

# Remove rows with missing values if any
dataset_clean <- na.omit(dataset)

# Check column names and types
str(dataset_clean)

# Assuming the last column is the target, update if needed
target_column <- names(dataset_clean)[ncol(dataset_clean)]

# Convert the target column to a factor if it's categorical
dataset_clean[[target_column]] <- as.factor(dataset_clean[[target_column]])

# Convert any other categorical variables to factors if necessary
categorical_cols <- sapply(dataset_clean, is.character)
dataset_clean[, categorical_cols] <- lapply(dataset_clean[, categorical_cols], as.factor)

# Convert factors to numeric for correlation analysis if needed
dataset_numeric <- dataset_clean
numeric_columns <- sapply(dataset_clean, is.numeric)
dataset_numeric[, !numeric_columns] <- lapply(dataset_clean[, !numeric_columns], as.numeric)

# Display the first few rows of the cleaned dataset
head(dataset_clean)

# Separate features and target
X <- dataset_clean %>% select(-all_of(target_column))
y <- dataset_clean[[target_column]]

# Train a Random Forest model to determine feature importance
set.seed(123)
rf_model <- randomForest(x = X, y = y, importance = TRUE, ntree = 100)

# Extract and display the feature importance
importance_df <- as.data.frame(importance(rf_model))
importance_df$Feature <- rownames(importance_df)
importance_df <- importance_df[order(importance_df$MeanDecreaseGini, decreasing = TRUE), ]

# View the top features
head(importance_df)

# Plot the feature importance using ggplot2
ggplot(importance_df, aes(x = reorder(Feature, MeanDecreaseGini), y = MeanDecreaseGini)) +
  geom_bar(stat = 'identity', fill = 'blue') +
  coord_flip() +
  labs(title = "Feature Importance - Random Forest", x = "Feature", y = "Importance (Mean Decrease Gini)") +
  theme_minimal()

# Plot distribution for the top 5 important features
top_features <- head(importance_df$Feature, 5)

# Create density plots for the top features
for (feature in top_features) {
  ggplot(dataset_clean, aes_string(x = feature, fill = target_column)) +
    geom_density(alpha = 0.7) +
    labs(title = paste("Density Plot of", feature),
         x = feature,
         y = "Density") +
    theme_minimal() +
    scale_fill_brewer(palette = "Set1") +
    guides(fill=guide_legend(title=target_column)) +
    theme(legend.position = "top") -> plot
  print(plot)
}


# Create boxplots for the top features grouped by the target variable
for (feature in top_features) {
  ggplot(dataset_clean, aes_string(x = target_column, y = feature, fill = target_column)) +
    geom_boxplot() +
    labs(title = paste("Boxplot of", feature, "by Target Variable"),
         x = "Target",
         y = feature) +
    theme_minimal() +
    scale_fill_brewer(palette = "Set1") +
    theme(legend.position = "none") -> plot
  print(plot)
}

# Load the GGally library for pair plots
library(GGally)

# Create pair plots for the top 5 features
ggpairs(dataset_clean[, c(top_features, target_column)],
        aes(color = get(target_column)),
        title = "Pair Plot of Top Features")

# Compute the correlation matrix for the top features
correlation_matrix_top <- cor(dataset_numeric[, top_features])

# Plot the correlation heatmap
corrplot(correlation_matrix_top, method = 'color', type = 'upper', tl.cex = 0.7, 
         title = "Correlation Heatmap of Top Features")
