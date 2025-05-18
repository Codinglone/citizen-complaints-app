export enum ComplaintStatus {
  PENDING = "pending",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in-progress",
  RESOLVED = "resolved"
}

export enum ComplaintPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum ApiRoutes {
  // Public routes
  GET_CATEGORIES = "/api/categories",
  GET_AGENCIES = "/api/agencies",
  CREATE_ANONYMOUS_COMPLAINT = "/api/complaints/anonymous",
  
  // Auth required routes
  CREATE_COMPLAINT = "/api/complaints",
  GET_USER_COMPLAINTS = "/api/complaints",
  GET_COMPLAINT_BY_ID = "/api/complaints/:id",
  
  // Admin routes
  GET_ALL_COMPLAINTS = "/api/admin/complaints",
  UPDATE_COMPLAINT = "/api/admin/complaints/:id"
}

export enum UserRoles {
  ADMIN = "admin",
  DEPARTMENT_MANAGER = "department_manager",
  DEPARTMENT_STAFF = "department_staff",
  USER = "user"
}