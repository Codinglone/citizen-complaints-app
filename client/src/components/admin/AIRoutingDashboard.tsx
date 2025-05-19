import React, { useState } from "react";
import { useApi } from "../../utils/api";

interface ComplaintData {
  title: string;
  description: string;
  location: string;
  categoryId: string;
}

export const AIRoutingDashboard: React.FC = () => {
  const { fetchWithAuth } = useApi();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState<ComplaintData>({
    title: "",
    description: "",
    location: "",
    categoryId: "",
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  React.useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth("/categories", {
          requireAuth: true,
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
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

  const testAIRouting = async () => {
    setIsAnalyzing(true);
    setAiResult(null);

    try {
      // Test the AI routing
      const response = await fetchWithAuth("/admin/test-ai-routing", {
        method: "POST",
        body: JSON.stringify(formData),
        requireAuth: true,
      });

      if (response.ok) {
        const data = await response.json();
        setAiResult(data);
      } else {
        const error = await response.json();
        console.error("AI routing test failed:", error);
      }
    } catch (error) {
      console.error("Error testing AI routing:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">AI Routing Test Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Test the AI complaint categorization and agency routing system.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Test Complaint</h3>

            <div className="form-control mb-4 flex flex-col gap-y-4">
              <label className="label">
                <span className="label-text">Complaint Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Enter complaint title"
              />
            </div>

            <div className="form-control mb-4 flex flex-col gap-y-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered"
                rows={5}
                placeholder="Enter complaint description"
              ></textarea>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Enter location"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Selected Category</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={testAIRouting}
              className={`btn btn-primary ${isAnalyzing ? "loading" : ""}`}
              disabled={isAnalyzing || !formData.title || !formData.description}
            >
              {isAnalyzing ? "Analyzing..." : "Test AI Routing"}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">AI Analysis Results</h3>

            {aiResult ? (
              <div className="bg-base-200 p-4 rounded-lg">
                <div className="mb-4">
                  <h4 className="font-medium">Suggested Category</h4>
                  <div className="flex items-center mt-2">
                    <div className="badge badge-primary mr-2">
                      {aiResult.suggestedCategory || "None"}
                    </div>
                    <span className="text-sm">
                      ({aiResult.suggestedCategoryId || "N/A"})
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium">Suggested Agency</h4>
                  <div className="flex items-center mt-2">
                    <div className="badge badge-secondary mr-2">
                      {aiResult.suggestedAgency || "None"}
                    </div>
                    <span className="text-sm">
                      ({aiResult.suggestedAgencyId || "N/A"})
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium">Confidence Score</h4>
                  <div className="flex items-center mt-2">
                    <progress
                      className="progress progress-primary w-56"
                      value={aiResult.confidence}
                      max="100"
                    ></progress>
                    <span className="ml-2">{aiResult.confidence}%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium">Sentiment Analysis</h4>
                  <div className="flex items-center mt-2">
                    <progress
                      className={`progress w-56 ${
                        aiResult.sentimentScore > 0
                          ? "progress-success"
                          : aiResult.sentimentScore < 0
                          ? "progress-error"
                          : "progress-warning"
                      }`}
                      value={Math.abs(aiResult.sentimentScore)}
                      max="100"
                    ></progress>
                    <span className="ml-2">{aiResult.sentimentScore}</span>
                  </div>
                  <div className="text-sm mt-1">
                    {aiResult.sentimentScore > 30
                      ? "Positive"
                      : aiResult.sentimentScore < -30
                      ? "Negative"
                      : "Neutral"}{" "}
                    sentiment
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="font-medium">Detected Language</h4>
                  <div className="mt-1">
                    <div className="badge">{aiResult.language}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-base-200 p-4 rounded-lg text-center">
                <p className="text-gray-500">
                  {isAnalyzing
                    ? "Analyzing complaint..."
                    : 'Enter complaint details and click "Test AI Routing" to see results'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
