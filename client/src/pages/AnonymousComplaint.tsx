import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApi } from "../utils/api";

export const AnonymousComplaint: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth("/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [fetchWithAuth]);

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

    try {
      const response = await fetchWithAuth("/complaints/anonymous", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setTrackingCode(data.trackingCode);

        // Check if AI suggestions were returned
        if (data.aiSuggestions) {
          setAiSuggestions(data.aiSuggestions);
        }

        // Reset form
        setFormData({
          title: "",
          description: "",
          categoryId: categories.length > 0 ? categories[0].id : "",
          location: "",
          contactEmail: "",
          contactPhone: "",
        });
      } else {
        throw new Error("Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting anonymous complaint:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {t("anonymousComplaint.title")}
      </h1>

      {success ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-success">
              {t("anonymousComplaint.success")}
            </h2>
            <div className="alert alert-success mb-4">
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
              <span>{t("anonymousComplaint.submittedSuccess")}</span>
            </div>

            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">
                {t("anonymousComplaint.trackingInfo")}
              </h3>
              <p className="mb-2">
                {t("anonymousComplaint.trackingInstructions")}
              </p>
              <div className="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-primary">
                <span className="font-mono text-lg">{trackingCode}</span>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => navigator.clipboard.writeText(trackingCode)}
                >
                  📋 {t("common.copy")}
                </button>
              </div>
            </div>

            {/* Show AI suggestions if available */}
            {aiSuggestions && (
              <div className="bg-base-200 p-4 rounded-lg mb-4">
                <h3 className="font-bold mb-2">
                  {t("anonymousComplaint.aiAnalysis")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">
                      {t("anonymousComplaint.suggestedCategory")}
                    </h4>
                    <div className="flex items-center mt-1">
                      <div className="badge badge-primary">
                        {aiSuggestions.suggestedCategory || "None"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">
                      {t("anonymousComplaint.suggestedAgency")}
                    </h4>
                    <div className="flex items-center mt-1">
                      <div className="badge badge-secondary">
                        {aiSuggestions.suggestedAgency || "None"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-medium">
                    {t("anonymousComplaint.confidence")}
                  </h4>
                  <div className="flex items-center mt-1">
                    <progress
                      className="progress progress-primary w-full"
                      value={aiSuggestions.confidence}
                      max="100"
                    ></progress>
                    <span className="ml-2">{aiSuggestions.confidence}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/track")}
              >
                {t("anonymousComplaint.trackComplaint")}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSuccess(false);
                  setTrackingCode("");
                  setAiSuggestions(null);
                }}
              >
                {t("anonymousComplaint.submitAnother")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4 flex flex-col gap-y-4">
                <label className="label">
                  <span className="label-text">
                    {t("anonymousComplaint.title")}
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder={t("anonymousComplaint.titlePlaceholder")}
                  required
                />
              </div>

              <div className="form-control mb-4 flex flex-col gap-y-4">
                <label className="label">
                  <span className="label-text">
                    {t("anonymousComplaint.category")}
                  </span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="select select-bordered"
                  required
                >
                  <option value="" disabled>
                    {t("anonymousComplaint.selectCategory")}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4 flex flex-col gap-y-4">
                <label className="label">
                  <span className="label-text">
                    {t("anonymousComplaint.description")}
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered"
                  placeholder={t("anonymousComplaint.descriptionPlaceholder")}
                  rows={5}
                  required
                ></textarea>
              </div>

              <div className="form-control mb-4 flex flex-col gap-y-4">
                <label className="label">
                  <span className="label-text">
                    {t("anonymousComplaint.location")}
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder={t("anonymousComplaint.locationPlaceholder")}
                />
              </div>

              <div className="divider">
                {t("anonymousComplaint.contactInfo")} (
                {t("anonymousComplaint.optional")})
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control flex flex-col gap-y-4">
                  <label className="label">
                    <span className="label-text">
                      {t("anonymousComplaint.email")}
                    </span>
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder={t("anonymousComplaint.emailPlaceholder")}
                  />
                </div>

                <div className="form-control flex flex-col gap-y-4">
                  <label className="label">
                    <span className="label-text">
                      {t("anonymousComplaint.phone")}
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder={t("anonymousComplaint.phonePlaceholder")}
                  />
                </div>
              </div>

              <div className="alert alert-info mt-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{t("anonymousComplaint.aiExplanation")}</span>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/")}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("common.submitting")
                    : t("anonymousComplaint.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
