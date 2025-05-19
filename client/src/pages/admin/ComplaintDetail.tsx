import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getComplaintById, updateComplaint } from "../../utils/api";

interface ComplaintDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  trackingCode: string;
  categoryName?: string;
  location?: string;
  submittedBy?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  agency?: {
    id: string;
    name: string;
    description?: string;
  };
}

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch complaint data
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const data = await getComplaintById(id);
        setComplaint(data);
        setNotes(data.notes || "");
        setStatus(data.status || "");
        setPriority(data.priority || "");
      } catch (error) {
        console.error("Failed to fetch complaint:", error);
        showToast("Failed to load complaint details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    try {
      setUpdating(true);
      const updatedComplaint = await updateComplaint(complaint.id, {
        notes,
        status,
        priority,
      });
      setComplaint({ ...complaint, ...updatedComplaint });
      showToast("Complaint updated successfully", "success");
    } catch (error) {
      console.error("Failed to update complaint:", error);
      showToast("Failed to update complaint", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!complaint) {
    return <div className="alert alert-error">Complaint not found</div>;
  }

  return (
    <div className="complaint-detail p-4">
      <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>

      {/* Toast notification */}
      {toastMessage && (
        <div className={`toast toast-top toast-end`}>
          <div
            className={`alert ${
              toastMessage.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl mb-4">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">{complaint.title}</h2>
            <div className={`badge ${getStatusBadgeClass(complaint.status)}`}>
              {complaint.status}
            </div>
          </div>
          <p>{complaint.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            <div>
              <p>
                <span className="font-bold">Tracking Code:</span>{" "}
                {complaint.trackingCode}
              </p>
              <p>
                <span className="font-bold">Category:</span>{" "}
                {complaint.categoryName || complaint.category?.name}
              </p>
              <p>
                <span className="font-bold">Location:</span>{" "}
                {complaint.location}
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold">Submitted By:</span>{" "}
                {complaint.submittedBy}
              </p>
              {complaint.contactEmail && (
                <p>
                  <span className="font-bold">Contact Email:</span>{" "}
                  {complaint.contactEmail}
                </p>
              )}
              {complaint.contactPhone && (
                <p>
                  <span className="font-bold">Contact Phone:</span>{" "}
                  {complaint.contactPhone}
                </p>
              )}
              <p>
                <span className="font-bold">Submitted:</span>{" "}
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Update Complaint</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Notes (visible to user)</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes visible to the user"
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Priority</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <button
          className={`btn btn-primary ${updating ? "loading" : ""}`}
          disabled={updating}
          type="submit"
        >
          {updating ? "Updating..." : "Update Complaint"}
        </button>
      </form>
    </div>
  );
};

// Helper function to get appropriate badge class based on status
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "RESOLVED":
      return "badge-success";
    case "IN_PROGRESS":
      return "badge-warning";
    case "REJECTED":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default ComplaintDetail;
