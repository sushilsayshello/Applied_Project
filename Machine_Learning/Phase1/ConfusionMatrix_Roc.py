# Confusion Matrix and ROC Curve for Best Model

# Determine the best model based on accuracy
best_model_name = model_names[accuracies.index(max(accuracies))]
best_model = models[best_model_name]
y_pred_best = best_model.predict(X_test)

# Confusion Matrix for Best Model
cm = confusion_matrix(y_test, y_pred_best)
plt.figure(figsize=(6,4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Greens')
plt.title(f'Confusion Matrix for Best Model: {best_model_name}')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()

# ROC Curve for Best Model
if hasattr(best_model, "predict_proba"):
    y_scores = best_model.predict_proba(X_test)[:,1]
else:
    y_scores = best_model.decision_function(X_test)
    y_scores = (y_scores - y_scores.min()) / (y_scores.max() - y_scores.min())  # Normalize scores to [0,1]

fpr, tpr, thresholds = roc_curve(y_test, y_scores)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(6,4))
plt.plot(fpr, tpr, label=f'{best_model_name} (AUC = {roc_auc:.2f})')
plt.plot([0,1], [0,1], 'k--')
plt.title(f'ROC Curve for Best Model: {best_model_name}')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.legend(loc='lower right')
plt.show()
