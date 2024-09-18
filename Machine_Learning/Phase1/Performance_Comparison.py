# Performance Comparison

# Accuracy Comparison
plt.figure(figsize=(8,6))
sns.barplot(x=model_names, y=accuracies, palette='viridis')
plt.title('Model Accuracy Comparison')
plt.ylabel('Accuracy')
plt.xticks(rotation=45)
plt.ylim(0, 1)
plt.show()

# ROC AUC Comparison
plt.figure(figsize=(8,6))
sns.barplot(x=model_names, y=roc_aucs, palette='magma')
plt.title('Model ROC AUC Comparison')
plt.ylabel('ROC AUC')
plt.xticks(rotation=45)
plt.ylim(0, 1)
plt.show()
