import { Type } from '@sinclair/typebox';
import { 
  createComplaintController,
  createAnonymousComplaintController,
  getUserComplaintsController,
  getComplaintByIdController,
  getAllComplaintsController,
  updateComplaintController,
  trackComplaintController
} from '../controllers/complaint.controller';
import { ComplaintStatus, ComplaintPriority } from '../utility/enums';

// Status and priority schema definitions
const statusSchema = Type.Enum(ComplaintStatus);
const prioritySchema = Type.Enum(ComplaintPriority);

// Common response schemas
const complaintResponseSchema = Type.Object({
  id: Type.String({ description: 'Unique identifier for the complaint' }),
  title: Type.String({ description: 'Title of the complaint' }),
  description: Type.String({ description: 'Detailed description of the complaint' }),
  location: Type.Union([
    Type.String({ description: 'Location related to the complaint' }), 
    Type.Null()
  ]),
  status: statusSchema,
  priority: prioritySchema,
  trackingCode: Type.String({ description: 'Unique tracking code for the complaint' }),
  categoryName: Type.String({ description: 'Category of the complaint' }),
  agencyName: Type.Union([
    Type.String({ description: 'Agency handling the complaint' }), 
    Type.Null()
  ]),
  createdAt: Type.String({ format: 'date-time', description: 'Date and time when the complaint was created' }),
  updatedAt: Type.String({ format: 'date-time', description: 'Date and time when the complaint was last updated' })
});

// Tracking response schema
const complaintTrackingResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  location: Type.String(),
  status: Type.String(),
  priority: Type.String(),
  trackingCode: Type.String(),
  categoryName: Type.String(),
  categoryId: Type.String(),
  agencyName: Type.Optional(Type.String()),
  agencyId: Type.Optional(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String()
});

// Create complaint options
export const createComplaintOpts = {
  schema: {
    tags: ['Complaints'],
    summary: 'Submit new complaint',
    description: 'Submit a new complaint (requires authentication)',
    body: Type.Object({
      title: Type.String({ 
        minLength: 3, 
        maxLength: 100,
        description: 'Title of the complaint' 
      }),
      description: Type.String({ 
        minLength: 10, 
        maxLength: 2000,
        description: 'Detailed description of the complaint' 
      }),
      categoryId: Type.String({ 
        format: 'uuid',
        description: 'ID of the complaint category' 
      }),
      location: Type.String({ 
        minLength: 3, 
        maxLength: 200,
        description: 'Location related to the complaint' 
      })
    }),
    response: {
      201: Type.Object({
        id: Type.String({ description: 'ID of the created complaint' }),
        trackingCode: Type.String({ description: 'Tracking code for the complaint' }),
        message: Type.String({ description: 'Success message' })
      }),
      400: Type.Object({
        error: Type.String({ description: 'Error message' })
      }),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    },
    security: [{ bearerAuth: [] }]
  },
  handler: createComplaintController
};

// Anonymous complaint options
export const createAnonymousComplaintOpts = {
  schema: {
    tags: ['Complaints'],
    summary: 'Submit an anonymous complaint',
    body: Type.Object({
      title: Type.String({ minLength: 3, maxLength: 100 }),
      description: Type.String({ minLength: 10 }),
      categoryId: Type.String(),
      location: Type.Optional(Type.String()),
      contactEmail: Type.Optional(Type.String({ format: 'email' })),
      contactPhone: Type.Optional(Type.String())
    }),
    response: {
      201: Type.Object({
        id: Type.String(),
        trackingCode: Type.String(),
        message: Type.String(),
        aiSuggestions: Type.Optional(Type.Object({
          suggestedCategoryId: Type.Optional(Type.String()),
          suggestedCategory: Type.Optional(Type.String()),
          suggestedAgencyId: Type.Optional(Type.String()),
          suggestedAgency: Type.Optional(Type.String()),
          confidence: Type.Number()
        }))
      }),
      400: Type.Object({
        error: Type.String()
      }),
      500: Type.Object({
        error: Type.String()
      })
    }
  },
  handler: createAnonymousComplaintController
};

export const trackComplaintOpts = {
  schema: {
    tags: ['Complaints'],
    summary: 'Track complaint by tracking code',
    description: 'Track a complaint using its tracking code (no authentication required)',
    params: Type.Object({
      trackingCode: Type.String({ description: 'Tracking code of the complaint' })
    }),
    response: {
      200: complaintTrackingResponseSchema,
      404: Type.Object({
        error: Type.String({ description: 'Error message' })
      }),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    }
  },
  handler: trackComplaintController
};

// Get user complaints options
export const getUserComplaintsOpts = {
  schema: {
    tags: ['Complaints'],
    summary: 'Get user complaints',
    description: 'Get all complaints for the authenticated user',
    response: {
      200: Type.Array(complaintResponseSchema),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    },
    security: [{ bearerAuth: [] }]
  },
  handler: getUserComplaintsController
};

// Get complaint by ID options
export const getComplaintByIdOpts = {
  schema: {
    tags: ['Complaints'],
    summary: 'Get complaint by ID',
    description: 'Get a specific complaint by ID',
    params: Type.Object({
      id: Type.String({ 
        format: 'uuid',
        description: 'Complaint ID' 
      })
    }),
    response: {
      200: Type.Object({
        id: Type.String({ description: 'Unique identifier for the complaint' }),
        title: Type.String({ description: 'Title of the complaint' }),
        description: Type.String({ description: 'Detailed description of the complaint' }),
        location: Type.Union([
          Type.String({ description: 'Location related to the complaint' }), 
          Type.Null()
        ]),
        status: statusSchema,
        priority: prioritySchema,
        trackingCode: Type.String({ description: 'Unique tracking code for the complaint' }),
        category: Type.Object({
          id: Type.String({ description: 'Category ID' }),
          name: Type.String({ description: 'Category name' })
        }),
        agency: Type.Union([
          Type.Null(),
          Type.Object({
            id: Type.String({ description: 'Agency ID' }),
            name: Type.String({ description: 'Agency name' })
          })
        ]),
        createdAt: Type.String({ format: 'date-time', description: 'Date and time when the complaint was created' }),
        updatedAt: Type.String({ format: 'date-time', description: 'Date and time when the complaint was last updated' })
      }),
      404: Type.Object({
        error: Type.String({ description: 'Error message' })
      }),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    },
    security: [{ bearerAuth: [] }]
  },
  handler: getComplaintByIdController
};

// Admin complaint list item with additional fields
const adminComplaintResponseSchema = Type.Intersect([
  complaintResponseSchema,
  Type.Object({
    submittedBy: Type.Union([
      Type.String({ description: 'Name of the user who submitted the complaint' }),
      Type.Null()
    ]),
    contactEmail: Type.Union([
      Type.String({ description: 'Contact email for the complaint' }),
      Type.Null()
    ]),
    contactPhone: Type.Union([
      Type.String({ description: 'Contact phone for the complaint' }),
      Type.Null()
    ])
  })
]);

// Get all complaints (admin) options
export const getAllComplaintsOpts = {
  schema: {
    tags: ['Admin', 'Complaints'],
    summary: 'Get all complaints (admin)',
    description: 'Get all complaints (admin access required)',
    response: {
      200: Type.Array(adminComplaintResponseSchema),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    },
    security: [{ bearerAuth: [] }]
  },
  handler: getAllComplaintsController
};

// Update complaint options
export const updateComplaintOpts = {
  schema: {
    tags: ['Admin', 'Complaints'],
    summary: 'Update complaint',
    description: 'Update a complaint (admin access required)',
    params: Type.Object({
      id: Type.String({ 
        format: 'uuid',
        description: 'Complaint ID' 
      })
    }),
    body: Type.Object({
      status: Type.Optional(statusSchema),
      agencyId: Type.Optional(Type.String({ 
        format: 'uuid',
        description: 'ID of the agency to assign the complaint to' 
      })),
      priority: Type.Optional(prioritySchema)
    }),
    response: {
      200: Type.Object({
        id: Type.String({ description: 'ID of the updated complaint' }),
        message: Type.String({ description: 'Success message' })
      }),
      400: Type.Object({
        error: Type.String({ description: 'Error message' })
      }),
      404: Type.Object({
        error: Type.String({ description: 'Error message' })
      }),
      500: Type.Object({
        error: Type.String({ description: 'Error message' })
      })
    },
    security: [{ bearerAuth: [] }]
  },
  handler: updateComplaintController
};