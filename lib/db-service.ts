import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

// Define types for our collections
export type User = {
  _id?: ObjectId;
  email: string;
  password: string;
  role: 'applicant' | 'admin' | 'employer';
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
  };
  profilePicture?: string;
  isVerified?: boolean;
  isActive?: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Job = {
  _id?: ObjectId;
  title: string;
  companyId: ObjectId;
  categoryId: ObjectId;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  location: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  isSalaryNegotiable?: boolean;
  experienceLevel?: string;
  experienceYearsMin?: number;
  experienceYearsMax?: number;
  educationLevel?: string;
  skills?: string[];
  eligibility?: string[];
  postedDate: Date;
  expiryDate: Date;
  applicationDeadline?: Date;
  applicationEmail?: string;
  applicationUrl?: string;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'archived';
  isFeatured?: boolean;
  isUrgent?: boolean;
  allowsRemote?: boolean;
  department?: string;
  positionCount?: number;
  viewCount?: number;
  applicationCount?: number;
  createdBy?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type Company = {
  _id?: ObjectId;
  name: string;
  logo?: string;
  description?: string;
  industry?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
  };
  isGovernment?: boolean;
  isVerified?: boolean;
  adminId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type Application = {
  _id?: ObjectId;
  jobId: ObjectId;
  applicantId: ObjectId;
  resumeId?: ObjectId;
  coverLetterId?: ObjectId;
  pdsId?: ObjectId;
  additionalDocuments?: ObjectId[];
  status:
    | 'applied'
    | 'screening'
    | 'interview'
    | 'offered'
    | 'hired'
    | 'rejected'
    | 'withdrawn';
  notes?: string;
  matchScore?: number;
  matchDetails?: {
    educationScore?: number;
    experienceScore?: number;
    skillsScore?: number;
    eligibilityScore?: number;
  };
  interviewDate?: Date;
  interviewLocation?: string;
  interviewType?: 'in-person' | 'phone' | 'video';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Document = {
  _id?: ObjectId;
  userId: ObjectId;
  type: 'pds' | 'resume' | 'cv' | 'cover-letter' | 'certificate' | 'other';
  title?: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  isDefault?: boolean;
  parsedData?: any;
  createdAt: Date;
  updatedAt?: Date;
};

export type JobCategory = {
  _id?: ObjectId;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentCategory?: ObjectId;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Database service class
class DatabaseService {
  private client;
  private db;

  constructor() {
    this.client = null;
    this.db = null;
  }

  // Initialize the database connection
  async connect() {
    if (this.db) return this.db;

    this.client = await clientPromise;
    this.db = this.client.db(process.env.MONGODB_DB || 'intelihire');
    return this.db;
  }

  // Users collection methods
  async getUsers(query = {}, options = {}) {
    const db = await this.connect();
    return db.collection('users').find(query, options).toArray();
  }

  async getUserById(id: string | ObjectId) {
    const db = await this.connect();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return db.collection('users').findOne({ _id: objectId });
  }

  async getUserByEmail(email: string) {
    const db = await this.connect();
    return db.collection('users').findOne({ email });
  }

  async createUser(user: User) {
    const db = await this.connect();
    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async updateUser(id: string | ObjectId, update: Partial<User>) {
    const db = await this.connect();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await db
      .collection('users')
      .updateOne(
        { _id: objectId },
        { $set: { ...update, updatedAt: new Date() } }
      );
    return result;
  }

  // Jobs collection methods
  async getJobs(query = {}, options = {}) {
    const db = await this.connect();
    return db.collection('jobs').find(query, options).toArray();
  }

  async getJobById(id: string | ObjectId) {
    const db = await this.connect();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return db.collection('jobs').findOne({ _id: objectId });
  }

  async getFeaturedJobs(limit = 6) {
    const db = await this.connect();
    return db
      .collection('jobs')
      .find({
        status: 'active',
        isFeatured: true,
        expiryDate: { $gt: new Date() }
      })
      .sort({ postedDate: -1 })
      .limit(limit)
      .toArray();
  }

  async getGovernmentJobs(limit = 4) {
    const db = await this.connect();

    // First get government company IDs
    const govCompanies = await db
      .collection('companies')
      .find({
        isGovernment: true
      })
      .project({ _id: 1 })
      .toArray();

    const govCompanyIds = govCompanies.map(company => company._id);

    return db
      .collection('jobs')
      .find({
        companyId: { $in: govCompanyIds },
        status: 'active',
        expiryDate: { $gt: new Date() }
      })
      .sort({ postedDate: -1 })
      .limit(limit)
      .toArray();
  }

  async createJob(job: Job) {
    const db = await this.connect();
    const result = await db.collection('jobs').insertOne(job);
    return { ...job, _id: result.insertedId };
  }

  async updateJob(id: string | ObjectId, update: Partial<Job>) {
    const db = await this.connect();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await db
      .collection('jobs')
      .updateOne(
        { _id: objectId },
        { $set: { ...update, updatedAt: new Date() } }
      );
    return result;
  }

  async searchJobs(query: string, filters = {}) {
    const db = await this.connect();
    const searchQuery = {
      $text: { $search: query },
      status: 'active',
      expiryDate: { $gt: new Date() },
      ...filters
    };

    return db.collection('jobs').find(searchQuery).toArray();
  }

  // Companies collection methods
  async getCompanies(query = {}, options = {}) {
    const db = await this.connect();
    return db.collection('companies').find(query, options).toArray();
  }

  async getCompanyById(id: string | ObjectId) {
    const db = await this.connect();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return db.collection('companies').findOne({ _id: objectId });
  }

  async getTopCompanies(limit = 6) {
    const db = await this.connect();

    // Get companies with the most active jobs
    const pipeline = [
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'companyId',
          as: 'jobs'
        }
      },
      {
        $addFields: {
          activeJobCount: {
            $size: {
              $filter: {
                input: '$jobs',
                as: 'job',
                cond: {
                  $and: [
                    { $eq: ['$$job.status', 'active'] },
                    { $gt: ['$$job.expiryDate', new Date()] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $match: {
          activeJobCount: { $gt: 0 }
        }
      },
      {
        $sort: { activeJobCount: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          activeJobCount: 1
        }
      }
    ];

    return db.collection('companies').aggregate(pipeline).toArray();
  }
}
