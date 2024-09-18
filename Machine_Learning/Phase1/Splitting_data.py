# Split the Data into Training and Testing Sets

X = processed_df.drop('label', axis=1)
y = processed_df['label']

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
