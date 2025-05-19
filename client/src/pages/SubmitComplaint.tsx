import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const SubmitComplaint: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    location: "",
  });
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Fetch categories from API with proper endpoint
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fix the API path (remove duplicate /api/)
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL ||
            "https://citizen-complaints-app.onrender.com"
          }/api/categories`
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          console.log("Categories loaded:", data);
        } else {
          console.error("Failed to fetch categories:", response.status);
          // Use valid UUIDs that match your database
          setCategories([
            {
              id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              name: t("complaint.categories.roads"),
            },
            {
              id: "7d9c6c2b-f1c9-4c46-9126-a5c38377aabe",
              name: t("complaint.categories.water"),
            },
            {
              id: "5e939bb4-1c4b-4be1-b1a2-d3eca8a51579",
              name: t("complaint.categories.waste"),
            },
            {
              id: "9a9c2a91-40c3-4ba5-8137-739f151ed211",
              name: t("complaint.categories.electricity"),
            },
            {
              id: "c121c553-bd98-43d5-b22e-78cd68c11b89",
              name: t("complaint.categories.publicTransport"),
            },
            {
              id: "a3ab1444-cc12-4d7c-a46d-42c8a65a9ac1",
              name: t("complaint.categories.noise"),
            },
            {
              id: "e4da29df-8fb6-4b5a-af9c-31c5f35f1cd6",
              name: t("complaint.categories.other"),
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [t]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Log the data being sent for debugging
      console.log("Submitting complaint data:", formData);

      // Ensure description has at least 10 characters
      if (formData.description.length < 10) {
        throw new Error("Description must be at least 10 characters long");
      }

      // Check if categoryId is valid
      if (
        !formData.categoryId ||
        !formData.categoryId.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        )
      ) {
        throw new Error("Please select a valid category");
      }

      const baseUrl =
        import.meta.env.VITE_API_URL ||
        "https://citizen-complaints-app.onrender.com";

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Create complaint data with anonymous flag set to true
      const complaintData = {
        ...formData,
        anonymous: true, // Force anonymous for now until Auth0 is fixed
      };

      console.log("Submitting anonymously due to auth issues");

      // Use the correct endpoint path
      const response = await fetch(`${baseUrl}/complaints/anonymous`, {
        method: "POST",
        headers,
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) {
        // Get detailed error information
        const errorText = await response.text();
        console.log("Server response:", response.status, errorText);

        // Try to parse error as JSON if possible
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.validation) {
            // Format validation errors for display
            const validationErrors = errorJson.validation
              .map(
                (err: any) =>
                  `${
                    err.params.missingProperty ||
                    err.instancePath.replace("/", "")
                  } ${err.message}`
              )
              .join(", ");
            throw new Error(`Validation error: ${validationErrors}`);
          }
          throw new Error(
            `Failed to submit complaint: ${
              errorJson.error || errorJson.message || response.status
            }`
          );
        } catch (e) {
          // If not JSON or other parsing error, use text
          throw new Error(
            `Failed to submit complaint: ${response.status} ${errorText}`
          );
        }
      }

      setSuccess(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        location: "",
      });

      // Redirect to home page instead of dashboard
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-4xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">
          {t("complaint.title")}
        </h2>

        {success ? (
          <div className="alert alert-success mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{t("complaint.success")}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {t("complaint.title")}
                </span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a brief title for your complaint"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {t("complaint.category")}
                </span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  {t("complaint.categoryPlaceholder")}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {t("complaint.location")}
                </span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t("complaint.locationPlaceholder")}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text font-medium">
                  {t("complaint.description")}
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t("complaint.descriptionPlaceholder")}
                className="textarea textarea-bordered h-32"
                required
                minLength={10}
              />
              <label className="label">
                <span className="label-text-alt text-info">
                  Must be at least 10 characters
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  t("complaint.submit")
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
