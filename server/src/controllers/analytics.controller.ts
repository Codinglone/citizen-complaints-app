import { FastifyRequest, FastifyReply } from 'fastify';
import { getRepository, MoreThanOrEqual } from 'typeorm';
import { Complaint } from '../entities/Complaint';
import { Agency } from '../entities/Agency';

interface AnalyticsQuery {
  timeRange: 'week' | 'month' | 'quarter' | 'year';
}

export const getAnalytics = async (request: FastifyRequest<{ Querystring: AnalyticsQuery }>, reply: FastifyReply) => {
  try {
    const { timeRange } = request.query;
    const complaintRepository = getRepository(Complaint);
    const agencyRepository = getRepository(Agency);

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get total complaints
    const totalComplaints = await complaintRepository.count({
      where: {
        createdAt: MoreThanOrEqual(startDate)
      }
    });

    // Get resolved complaints
    const resolvedComplaints = await complaintRepository.count({
      where: {
        status: 'resolved',
        createdAt: MoreThanOrEqual(startDate)
      }
    });

    // Calculate average resolution time
    const resolvedComplaintsData = await complaintRepository.find({
      where: {
        status: 'resolved',
        createdAt: MoreThanOrEqual(startDate)
      },
      select: ['createdAt', 'updatedAt']
    });

    const avgResolutionTime = resolvedComplaintsData.length > 0
      ? resolvedComplaintsData.reduce((acc, complaint) => {
          const resolutionTime = (complaint.updatedAt.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return acc + resolutionTime;
        }, 0) / resolvedComplaintsData.length
      : 0;

    // Get category distribution
    const categoryDistribution = await complaintRepository
      .createQueryBuilder('complaint')
      .select('category.name', 'name')
      .addSelect('COUNT(*)', 'value')
      .leftJoin('complaint.category', 'category')
      .where('complaint.createdAt >= :startDate', { startDate })
      .groupBy('category.name')
      .getRawMany();

    // Get time series data
    const timeSeriesData = await complaintRepository
      .createQueryBuilder('complaint')
      .select('DATE(complaint.createdAt)', 'date')
      .addSelect('COUNT(*)', 'complaints')
      .addSelect('SUM(CASE WHEN complaint.status = :resolved THEN 1 ELSE 0 END)', 'resolved')
      .setParameter('resolved', 'resolved')
      .where('complaint.createdAt >= :startDate', { startDate })
      .groupBy('DATE(complaint.createdAt)')
      .orderBy('date')
      .getRawMany();

    // Get top agencies
    const topAgencies = await agencyRepository
      .createQueryBuilder('agency')
      .select('agency.name', 'name')
      .addSelect('COUNT(complaint.id)', 'complaintsHandled')
      .addSelect('AVG(CASE WHEN complaint.status = :resolved THEN 1 ELSE 0 END) * 100', 'resolutionRate')
      .addSelect('AVG(CASE WHEN complaint.status = :resolved THEN DATEDIFF(complaint.updatedAt, complaint.createdAt) ELSE NULL END)', 'avgResolutionTime')
      .leftJoin('agency.complaints', 'complaint')
      .where('complaint.createdAt >= :startDate', { startDate })
      .groupBy('agency.name')
      .orderBy('complaintsHandled', 'DESC')
      .limit(5)
      .getRawMany();

    return reply.send({
      totalComplaints,
      resolvedComplaints,
      averageResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      satisfactionRate: Math.round((resolvedComplaints / totalComplaints) * 100) || 0,
      categoryDistribution,
      timeSeriesData,
      topAgencies
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return reply.status(500).send({ error: 'Failed to fetch analytics data' });
  }
}; 