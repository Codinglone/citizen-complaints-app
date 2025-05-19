import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const SubmitComplaint: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, getToken } = useAuth();
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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_URL ||
            "https://citizen-complaints-app.onrender.com"
          }/categories`
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          // Fallback to mock categories if API fails
          setCategories([
            { id: "1", name: t("complaint.categories.roads") },
            { id: "2", name: t("complaint.categories.water") },
            { id: "3", name: t("complaint.categories.waste") },
            { id: "4", name: t("complaint.categories.electricity") },
            { id: "5", name: t("complaint.categories.publicTransport") },
            { id: "6", name: t("complaint.categories.noise") },
            { id: "7", name: t("complaint.categories.other") },
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
      // Bypass fetchWithAuth to handle auth token explicitly
      const token = isAuthenticated ? getToken() : null;
      const baseUrl =
        process.env.REACT_APP_API_URL ||
        "https://citizen-complaints-app.onrender.com";

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("Submitting with token:", token ? "Present" : "None");
      console.log("Headers:", headers);

      const response = await fetch(`${baseUrl}/api/complaints`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Get detailed error information
        const errorText = await response.text();
        console.error("Server response:", response.status, errorText);
        throw new Error(
          `Failed to submit complaint: ${response.status} ${response.statusText}`
        );
      }

      setSuccess(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        location: "",
      });

      // Redirect to complaints list after successful submission
      setTimeout(() => {
        navigate("/dashboard/complaints");
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
