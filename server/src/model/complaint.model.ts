import { AppDataSource } from '../data-source';
import { Complaint } from '../entities/Complaint';
import { Category } from '../entities/Category';
import { Agency } from '../entities/Agency';
import { User } from '../entities/User';
import { generateTrackingCode } from '../utils/helpers';
import { ComplaintStatus, ComplaintPriority } from '../utility/enums';

interface CreateComplaintParams {
  title: string;
  description: string;
  categoryId: string;
  location: string;
  user: User;
}

interface CreateAnonymousComplaintParams {
  title: string;
  description: string;
  categoryId: string;
  location: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface UpdateComplaintParams {
  id: string;
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  agencyId?: string;
}

interface ComplaintListItem {
  id: string;
  title: string;
  description: string;
  location: string | null;
  status: string;
  priority: string;
  trackingCode: string;
  categoryName: string;
  agencyName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminComplaintListItem extends ComplaintListItem {
  submittedBy: string;
  contactEmail: string | null;
  contactPhone: string | null;
}

interface ComplaintDetail {
  id: string;
  title: string;
  description: string;
  location: string | null;
  status: string;
  priority: string;
  trackingCode: string;
  category: {
    id: string;
    name: string;
  };
  agency: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export class ComplaintModel {
  static complaintRepository = AppDataSource.getRepository(Complaint);
  static categoryRepository = AppDataSource.getRepository(Category);
  static agencyRepository = AppDataSource.getRepository(Agency);

  static async createComplaint(params: CreateComplaintParams): Promise<{ id: string; trackingCode: string }> {
    const { title, description, categoryId, location, user } = params;
    
    // Get category
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new Error('Invalid category');
    }
    
    // Create complaint
    const complaint = new Complaint();
    complaint.title = title;
    complaint.description = description;
    complaint.location = location;
    complaint.status = ComplaintStatus.PENDING;
    complaint.priority = ComplaintPriority.MEDIUM;
    complaint.category = category;
    complaint.user = user;
    
    // Generate tracking code
    const trackingCode = generateTrackingCode('CMP');
    complaint.trackingCode = trackingCode;
    
    // Save complaint
    const savedComplaint = await this.complaintRepository.save(complaint);
    
    return {
      id: savedComplaint.id,
      trackingCode: savedComplaint.trackingCode
    };
  }

  static async createAnonymousComplaint(params: CreateAnonymousComplaintParams): Promise<{ id: string; trackingCode: string }> {
    const { title, description, categoryId, location, contactEmail, contactPhone } = params;
    
    // Get category
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new Error('Invalid category');
    }
    
    // Create complaint
    const complaint = new Complaint();
    complaint.title = title;
    complaint.description = description;
    complaint.location = location;
    complaint.status = ComplaintStatus.PENDING;
    complaint.priority = ComplaintPriority.MEDIUM;
    complaint.category = category;
    complaint.contactEmail = contactEmail;
    complaint.contactPhone = contactPhone;
    
    // Generate tracking code
    const trackingCode = generateTrackingCode('ANO');
    complaint.trackingCode = trackingCode;
    
    // Save complaint
    const savedComplaint = await this.complaintRepository.save(complaint);
    
    return {
      id: savedComplaint.id,
      trackingCode: savedComplaint.trackingCode
    };
  }

  static async getUserComplaints(userId: string): Promise<ComplaintListItem[]> {
    // Get all complaints for the authenticated user
    const complaints = await this.complaintRepository.find({
      where: { user: { id: userId } },
      relations: ['category', 'agency']
    });
    
    return complaints.map(complaint => ({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
      status: complaint.status,
      priority: complaint.priority,
      trackingCode: complaint.trackingCode,
      categoryName: complaint.category.name,
      agencyName: complaint.agency ? complaint.agency.name : null,
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString()
    }));
  }

  static async getComplaintById(id: string, userId: string): Promise<ComplaintDetail> {
    // Get complaint with category and agency
    const complaint = await this.complaintRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category', 'agency']
    });
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    
    return {
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
      status: complaint.status,
      priority: complaint.priority,
      trackingCode: complaint.trackingCode,
      category: {
        id: complaint.category.id,
        name: complaint.category.name
      },
      agency: complaint.agency ? {
        id: complaint.agency.id,
        name: complaint.agency.name
      } : null,
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString()
    };
  }

  static async getAllComplaints(): Promise<AdminComplaintListItem[]> {
    // Get all complaints with related entities
    const complaints = await this.complaintRepository.find({
      relations: ['category', 'agency', 'user']
    });
    
    return complaints.map(complaint => ({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
      status: complaint.status,
      priority: complaint.priority,
      trackingCode: complaint.trackingCode,
      categoryName: complaint.category.name,
      agencyName: complaint.agency ? complaint.agency.name : null,
      submittedBy: complaint.user ? complaint.user.fullName : 'Anonymous',
      contactEmail: complaint.contactEmail || (complaint.user ? complaint.user.email : null),
      contactPhone: complaint.contactPhone || (complaint.user ? complaint.user.phoneNumber : null),
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString()
    }));
  }

  static async updateComplaint(params: UpdateComplaintParams): Promise<string> {
    const { id, status, priority, agencyId } = params;
    
    // Get complaint
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: ['agency']
    });
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    
    // Update complaint fields if provided
    if (status) {
      complaint.status = status;
    }
    
    if (priority) {
      complaint.priority = priority;
    }
    
    if (agencyId) {
      const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
      if (!agency) {
        throw new Error('Invalid agency');
      }
      complaint.agency = agency;
    }
    
    // Save updated complaint
    await this.complaintRepository.save(complaint);
    
    return complaint.id;
  }

  static async getComplaintByTrackingCode(trackingCode: string): Promise<ComplaintDetail> {
    // Simplify the query to only select fields we're certain exist in the database
    const complaint = await this.complaintRepository
      .createQueryBuilder('complaint')
      .leftJoinAndSelect('complaint.category', 'category')
      .leftJoin('complaint.agency', 'agency')
      .addSelect([
        'agency.id', 
        'agency.name'
        // Only select minimal fields that we know exist
      ])
      .where('complaint.trackingCode = :trackingCode', { trackingCode })
      .getOne();
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    
    // Transform to DTO
    return {
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
      status: complaint.status,
      priority: complaint.priority,
      trackingCode: complaint.trackingCode,
      category: complaint.category ? {
        id: complaint.category.id,
        name: complaint.category.name
      } : null,
      agency: complaint.agency ? {
        id: complaint.agency.id,
        name: complaint.agency.name
      } : null,
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString()
    };
  }
}