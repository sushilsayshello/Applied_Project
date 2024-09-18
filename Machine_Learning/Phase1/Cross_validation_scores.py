# Cross-Validation Scores

print("\nCross-Validation Scores:")
for name, model in models.items():
    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"{name} CV Mean Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
