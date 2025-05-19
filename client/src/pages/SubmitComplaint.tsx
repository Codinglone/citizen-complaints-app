import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

export const SubmitComplaint: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { isAuthenticated, getToken } = useAuth();
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
        // Make sure to use the correct endpoint for categories (without duplicated /api/)
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL ||
            "https://citizen-complaints-app.onrender.com"
          }/api/categories`
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", response.status);
          // Don't use simple numeric IDs - use real UUIDs even in mock data
          setCategories([
            {
              id: "8a7d5c1e-4b6a-4b0e-8f9a-1c2d3e4f5a6b",
              name: t("complaint.categories.roads"),
            },
            {
              id: "9b8c7d6e-5f4a-3b2c-1d0e-9f8a7b6c5d4e",
              name: t("complaint.categories.water"),
            },
            {
              id: "7c6d5b4a-3f2e-1d0c-9b8a-7f6e5d4c3b2a",
              name: t("complaint.categories.waste"),
            },
            {
              id: "6b5a4d3c-2e1f-0d9c-8b7a-6e5d4c3b2a1f",
              name: t("complaint.categories.electricity"),
            },
            {
              id: "5a4b3c2d-1e0f-9d8c-7b6a-5d4c3b2a1e0f",
              name: t("complaint.categories.publicTransport"),
            },
            {
              id: "4d3c2b1a-0e9f-8d7c-6b5a-4c3b2a1d0e9f",
              name: t("complaint.categories.noise"),
            },
            {
              id: "3c2b1a9d-8e7f-6d5c-4b3a-2c1d0e9f8a7b",
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

  // Fix API endpoint path and add anonymous submission flag

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Log the data being sent for debugging
      console.log("Submitting complaint data:", formData);

      // Check if categoryId is valid
      if (
        !formData.categoryId ||
        !formData.categoryId.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        )
      ) {
        throw new Error("Please select a valid category");
      }

      // No need to try authentication if we're going to use anonymous submission
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

      const response = await fetch(`${baseUrl}/api/complaints/anonymous`, {
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
              />
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
