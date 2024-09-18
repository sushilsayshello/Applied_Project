# Load the Dataset

# Since 'ddosattack.csv' is already uploaded in your Colab environment,
# we can read it directly.
dataset_path = 'ddosattack.csv'

# Load the dataset (corrected separator)
df = pd.read_csv(dataset_path)  # Removed sep='\t'

# Display the first few rows
print("Dataset Head:")
print(df.head())

# Display the column names
print("\nColumns in the DataFrame:")
print(df.columns)
