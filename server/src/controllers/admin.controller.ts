import { FastifyRequest, FastifyReply } from "fastify";
import { ComplaintModel } from "../model/complaint.model";
// Import both required enums
import { ComplaintStatus, ComplaintPriority } from "../utility/enums";

export async function getAllComplaintsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const complaints = await ComplaintModel.getAllForAdmin();

    // Debug: log the first complaint to see if isAnonymous exists
    console.log(
      "First complaint isAnonymous:",
      complaints.length > 0 ? complaints[0].isAnonymous : "no complaints"
    );

    // Debug logging to trace what's happening
    console.log("Number of complaints:", complaints.length);
    if (complaints.length > 0) {
      console.log("First complaint keys:", Object.keys(complaints[0]));
      console.log(
        "isAnonymous present:",
        complaints[0].hasOwnProperty("isAnonymous")
      );
      console.log("isAnonymous value:", complaints[0].isAnonymous);
      console.log("userId value:", complaints[0].userId);
    }

    // Force isAnonymous to be a boolean on each complaint
    const safeComplaints = complaints.map((complaint) => {
      // Convert nested objects to simpler forms to avoid serialization issues
      return {
        id: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        priority: complaint.priority,
        trackingCode: complaint.trackingCode,
        location: complaint.location || null,
        categoryId: complaint.categoryId || null,
        category: complaint.category
          ? {
              id: complaint.category.id,
              name: complaint.category.name,
              description: complaint.category.description || null,
            }
          : null,
        agencyId: complaint.agencyId || null,
        agency: complaint.agency
          ? {
              id: complaint.agency.id,
              name: complaint.agency.name,
              description: complaint.agency.description || null,
            }
          : null,
        userId: complaint.userId || null,
        user: complaint.user
          ? {
              id: complaint.user.id,
              fullName: complaint.user.fullName,
              email: complaint.user.email,
            }
          : null,
        contactEmail: complaint.contactEmail || null,
        contactPhone: complaint.contactPhone || null,
        sentimentScore: complaint.sentimentScore || null,
        language: complaint.language || null,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        isAnonymous: Boolean(!complaint.userId),
      };
    });

    return safeComplaints;
  } catch (error) {
    request.log.error("Failed to retrieve complaints:", error);
    return reply.code(500).send({ error: "Failed to retrieve complaints" });
  }
}

// Add this function to your controller file
export async function updateComplaintController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: { notes?: string; status?: string; priority?: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const { notes, status, priority } = request.body;

    // Validate and convert string status to the enum value
    let statusEnum: ComplaintStatus | undefined = undefined;
    if (status) {
      // Check if the status string is a valid enum value
      if (Object.values(ComplaintStatus).includes(status as ComplaintStatus)) {
        statusEnum = status as ComplaintStatus;
      } else {
        return reply.code(400).send({
          error: `Invalid status value. Must be one of: ${Object.values(
            ComplaintStatus
          ).join(", ")}`,
        });
      }
    }

    // Validate and convert string priority to the enum value
    let priorityEnum: ComplaintPriority | undefined = undefined;
    if (priority) {
      // Check if the priority string is a valid enum value
      if (
        Object.values(ComplaintPriority).includes(priority as ComplaintPriority)
      ) {
        priorityEnum = priority as ComplaintPriority;
      } else {
        return reply.code(400).send({
          error: `Invalid priority value. Must be one of: ${Object.values(
            ComplaintPriority
          ).join(", ")}`,
        });
      }
    }

    const updatedComplaint = await ComplaintModel.updateComplaint({
      id,
      notes,
      status: statusEnum,
      priority: priorityEnum,
    });

    if (!updatedComplaint) {
      return reply.code(404).send({ error: "Complaint not found" });
    }

    return updatedComplaint;
  } catch (error) {
    request.log.error("Failed to update complaint:", error);
    return reply.code(500).send({ error: "Failed to update complaint" });
  }
}
