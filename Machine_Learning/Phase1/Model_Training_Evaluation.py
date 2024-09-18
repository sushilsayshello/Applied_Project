# Model Training and Evaluation

# Initialize models
models = {
    'K-Nearest Neighbors': KNeighborsClassifier(),
    'Naive Bayes': GaussianNB(),
    'Stochastic Gradient Descent': SGDClassifier(max_iter=1000, tol=1e-3, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'XGBoost': xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
}

# Lists to store results
model_names = []
accuracies = []
roc_aucs = []

# Train and evaluate models
for name, model in models.items():
    print(f"\nTraining {name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    accuracies.append(accuracy)
    model_names.append(name)
    print(f"{name} Accuracy: {accuracy:.4f}")
    print(f"\nClassification Report for {name}:\n{classification_report(y_test, y_pred)}")

    # Save the model
    joblib.dump(model, f"{name.replace(' ', '_')}_model.pkl")

    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6,4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title(f'Confusion Matrix for {name}')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.show()

    # ROC Curve and AUC
    if hasattr(model, "predict_proba"):
        y_scores = model.predict_proba(X_test)[:,1]
    else:
        # Use decision function for models that don't support predict_proba
        y_scores = model.decision_function(X_test)
        y_scores = (y_scores - y_scores.min()) / (y_scores.max() - y_scores.min())  # Normalize scores to [0,1]

    fpr, tpr, thresholds = roc_curve(y_test, y_scores)
    roc_auc = auc(fpr, tpr)
    roc_aucs.append(roc_auc)

    plt.figure(figsize=(6,4))
    plt.plot(fpr, tpr, label=f'{name} (AUC = {roc_auc:.2f})')
    plt.plot([0,1], [0,1], 'k--')
    plt.title(f'ROC Curve for {name}')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.legend(loc='lower right')
    plt.show()
