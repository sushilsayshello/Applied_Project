# Data Preprocessing

# Check for missing values
print("\nMissing values in each column:")
print(df.isnull().sum())

# Handle missing values
df = df.dropna()

# Convert columns to appropriate data types
numeric_columns = ['dt', 'switch', 'pktcount', 'bytecount', 'dur', 'dur_nsec', 'tot_dur', 'flows',
                   'packetins', 'pktperflow', 'byteperflow', 'pktrate', 'Pairflow', 'port_no',
                   'tx_bytes', 'rx_bytes', 'tx_kbps', 'rx_kbps', 'tot_kbps', 'label']

for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Re-check for any NaN values after conversion
df = df.dropna()

# Encode categorical variables
# Encoding 'Protocol' using LabelEncoder
protocol_encoder = LabelEncoder()
df['Protocol'] = protocol_encoder.fit_transform(df['Protocol'])

# Converting IP addresses to numerical values
def ip_to_int(ip):
    try:
        return int(ipaddress.IPv4Address(ip))
    except:
        return 0  # Assign 0 for invalid IPs

df['src'] = df['src'].apply(ip_to_int)
df['dst'] = df['dst'].apply(ip_to_int)

# Feature Scaling
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df[numeric_columns[:-1]])  # Exclude 'label' from scaling

# Create a DataFrame with scaled features
scaled_df = pd.DataFrame(scaled_features, columns=numeric_columns[:-1])

# Combine scaled features with encoded categorical variables
processed_df = pd.concat([scaled_df.reset_index(drop=True), df[['Protocol', 'src', 'dst', 'label']].reset_index(drop=True)], axis=1)
