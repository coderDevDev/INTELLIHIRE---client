// MongoDB Schema for InteliHire Job Portal

// This file defines the MongoDB collections and their schemas
// You can use this as a reference for creating your collections

// Declare db variable
var db = db || connect("mongodb://localhost:27017/intelihire")

// Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "role", "createdAt", "updatedAt"],
      properties: {
        email: {
          bsonType: "string",
          description: "Email must be a string and is required",
        },
        password: {
          bsonType: "string",
          description: "Hashed password is required",
        },
        role: {
          enum: ["applicant", "admin", "employer"],
          description: "Role must be either applicant, admin, or employer",
        },
        firstName: {
          bsonType: "string",
          description: "First name of the user",
        },
        lastName: {
          bsonType: "string",
          description: "Last name of the user",
        },
        phoneNumber: {
          bsonType: "string",
          description: "Phone number of the user",
        },
        address: {
          bsonType: "object",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            province: { bsonType: "string" },
            zipCode: { bsonType: "string" },
          },
        },
        profilePicture: {
          bsonType: "string",
          description: "URL to profile picture",
        },
        isVerified: {
          bsonType: "bool",
          description: "Whether the user's email is verified",
        },
        isActive: {
          bsonType: "bool",
          description: "Whether the user account is active",
        },
        lastLogin: {
          bsonType: "date",
          description: "Last login timestamp",
        },
        createdAt: {
          bsonType: "date",
          description: "Account creation timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Account update timestamp",
        },
      },
    },
  },
})

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Applicant Profiles Collection (extends user information for applicants)
db.createCollection("applicantProfiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "createdAt", "updatedAt"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "Reference to user ID",
        },
        headline: {
          bsonType: "string",
          description: "Professional headline",
        },
        summary: {
          bsonType: "string",
          description: "Professional summary",
        },
        skills: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          description: "List of skills",
        },
        education: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              institution: { bsonType: "string" },
              degree: { bsonType: "string" },
              fieldOfStudy: { bsonType: "string" },
              startDate: { bsonType: "date" },
              endDate: { bsonType: "date" },
              isOngoing: { bsonType: "bool" },
              description: { bsonType: "string" },
            },
          },
        },
        experience: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              company: { bsonType: "string" },
              position: { bsonType: "string" },
              location: { bsonType: "string" },
              startDate: { bsonType: "date" },
              endDate: { bsonType: "date" },
              isCurrentPosition: { bsonType: "bool" },
              description: { bsonType: "string" },
            },
          },
        },
        certifications: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              issuingOrganization: { bsonType: "string" },
              issueDate: { bsonType: "date" },
              expirationDate: { bsonType: "date" },
              credentialId: { bsonType: "string" },
              credentialURL: { bsonType: "string" },
            },
          },
        },
        eligibility: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              issuingBody: { bsonType: "string" },
              issueDate: { bsonType: "date" },
              expirationDate: { bsonType: "date" },
              licenseNumber: { bsonType: "string" },
            },
          },
        },
        languages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              language: { bsonType: "string" },
              proficiency: { bsonType: "string" },
            },
          },
        },
        preferences: {
          bsonType: "object",
          properties: {
            jobTypes: {
              bsonType: "array",
              items: { bsonType: "string" },
            },
            locations: {
              bsonType: "array",
              items: { bsonType: "string" },
            },
            industries: {
              bsonType: "array",
              items: { bsonType: "string" },
            },
            minSalary: { bsonType: "number" },
          },
        },
        profileCompleteness: {
          bsonType: "number",
          description: "Percentage of profile completion",
        },
        createdAt: {
          bsonType: "date",
          description: "Profile creation timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Profile update timestamp",
        },
      },
    },
  },
})

// Create indexes for applicantProfiles collection
db.applicantProfiles.createIndex({ userId: 1 }, { unique: true })
db.applicantProfiles.createIndex({ skills: 1 })
db.applicantProfiles.createIndex({ "education.fieldOfStudy": 1 })
db.applicantProfiles.createIndex({ "experience.company": 1 })

// Companies Collection
db.createCollection("companies", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "createdAt", "updatedAt"],
      properties: {
        name: {
          bsonType: "string",
          description: "Company name is required",
        },
        logo: {
          bsonType: "string",
          description: "URL to company logo",
        },
        description: {
          bsonType: "string",
          description: "Company description",
        },
        industry: {
          bsonType: "string",
          description: "Industry sector",
        },
        website: {
          bsonType: "string",
          description: "Company website URL",
        },
        contactEmail: {
          bsonType: "string",
          description: "Contact email",
        },
        contactPhone: {
          bsonType: "string",
          description: "Contact phone number",
        },
        address: {
          bsonType: "object",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            province: { bsonType: "string" },
            zipCode: { bsonType: "string" },
          },
        },
        isGovernment: {
          bsonType: "bool",
          description: "Whether the company is a government entity",
        },
        isVerified: {
          bsonType: "bool",
          description: "Whether the company is verified",
        },
        adminId: {
          bsonType: "objectId",
          description: "Reference to admin user who manages this company",
        },
        createdAt: {
          bsonType: "date",
          description: "Company creation timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Company update timestamp",
        },
      },
    },
  },
})

// Create indexes for companies collection
db.companies.createIndex({ name: 1 })
db.companies.createIndex({ industry: 1 })
db.companies.createIndex({ isGovernment: 1 })

// Job Categories Collection
db.createCollection("jobCategories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "createdAt", "updatedAt"],
      properties: {
        name: {
          bsonType: "string",
          description: "Category name is required",
        },
        description: {
          bsonType: "string",
          description: "Category description",
        },
        icon: {
          bsonType: "string",
          description: "Icon name for the category",
        },
        color: {
          bsonType: "string",
          description: "Color code for the category",
        },
        parentCategory: {
          bsonType: "objectId",
          description: "Reference to parent category if this is a subcategory",
        },
        isActive: {
          bsonType: "bool",
          description: "Whether the category is active",
        },
        createdAt: {
          bsonType: "date",
          description: "Category creation timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Category update timestamp",
        },
      },
    },
  },
})

// Create indexes for jobCategories collection
db.jobCategories.createIndex({ name: 1 }, { unique: true })
db.jobCategories.createIndex({ parentCategory: 1 })

// Jobs Collection
db.createCollection("jobs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "companyId", "categoryId", "status", "createdAt", "updatedAt"],
      properties: {
        title: {
          bsonType: "string",
          description: "Job title is required",
        },
        companyId: {
          bsonType: "objectId",
          description: "Reference to company ID",
        },
        categoryId: {
          bsonType: "objectId",
          description: "Reference to job category ID",
        },
        description: {
          bsonType: "string",
          description: "Job description",
        },
        responsibilities: {
          bsonType: "string",
          description: "Job responsibilities",
        },
        requirements: {
          bsonType: "string",
          description: "Job requirements",
        },
        benefits: {
          bsonType: "string",
          description: "Job benefits",
        },
        location: {
          bsonType: "string",
          description: "Job location",
        },
        employmentType: {
          enum: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
          description: "Type of employment",
        },
        salaryMin: {
          bsonType: "number",
          description: "Minimum salary",
        },
        salaryMax: {
          bsonType: "number",
          description: "Maximum salary",
        },
        salaryCurrency: {
          bsonType: "string",
          description: "Salary currency",
        },
        salaryPeriod: {
          enum: ["hourly", "daily", "weekly", "monthly", "yearly"],
          description: "Salary period",
        },
        isSalaryNegotiable: {
          bsonType: "bool",
          description: "Whether salary is negotiable",
        },
        experienceLevel: {
          enum: ["Entry Level", "Junior", "Mid-Level", "Senior", "Expert"],
          description: "Required experience level",
        },
        experienceYearsMin: {
          bsonType: "number",
          description: "Minimum years of experience required",
        },
        experienceYearsMax: {
          bsonType: "number",
          description: "Maximum years of experience considered",
        },
        educationLevel: {
          enum: ["High School", "Associate", "Bachelor", "Master", "Doctorate"],
          description: "Required education level",
        },
        skills: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          description: "Required skills",
        },
        eligibility: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          description: "Required eligibility or certifications",
        },
        postedDate: {
          bsonType: "date",
          description: "Date when job was posted",
        },
        expiryDate: {
          bsonType: "date",
          description: "Date when job posting expires",
        },
        applicationDeadline: {
          bsonType: "date",
          description: "Deadline for applications",
        },
        applicationEmail: {
          bsonType: "string",
          description: "Email for applications",
        },
        applicationUrl: {
          bsonType: "string",
          description: "URL for external applications",
        },
        status: {
          enum: ["draft", "active", "paused", "closed", "archived"],
          description: "Status of the job posting",
        },
        isFeatured: {
          bsonType: "bool",
          description: "Whether the job is featured",
        },
        isUrgent: {
          bsonType: "bool",
          description: "Whether the job is marked as urgent hiring",
        },
        allowsRemote: {
          bsonType: "bool",
          description: "Whether the job allows remote work",
        },
        department: {
          bsonType: "string",
          description: "Department within the company",
        },
        positionCount: {
          bsonType: "number",
          description: "Number of positions available",
        },
        viewCount: {
          bsonType: "number",
          description: "Number of views",
        },
        applicationCount: {
          bsonType: "number",
          description: "Number of applications received",
        },
        createdBy: {
          bsonType: "objectId",
          description: "Reference to user who created the job",
        },
        createdAt: {
          bsonType: "date",
          description: "Job creation timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Job update timestamp",
        },
      },
    },
  },
})

// Create indexes for jobs collection
db.jobs.createIndex({ title: "text", description: "text" })
db.jobs.createIndex({ companyId: 1 })
db.jobs.createIndex({ categoryId: 1 })
db.jobs.createIndex({ status: 1 })
db.jobs.createIndex({ postedDate: 1 })
db.jobs.createIndex({ expiryDate: 1 })
db.jobs.createIndex({ location: 1 })
db.jobs.createIndex({ employmentType: 1 })
db.jobs.createIndex({ isFeatured: 1 })
db.jobs.createIndex({ skills: 1 })

// Documents Collection (for PDS, resumes, etc.)
db.createCollection("documents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "fileUrl", "createdAt"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "Reference to user ID",
        },
        type: {
          enum: ["pds", "resume", "cv", "cover-letter", "certificate", "other"],
          description: "Type of document",
        },
        title: {
          bsonType: "string",
          description: "Document title",
        },
        fileUrl: {
          bsonType: "string",
          description: "URL to the document file",
        },
        fileSize: {
          bsonType: "number",
          description: "Size of the file in bytes",
        },
        fileType: {
          bsonType: "string",
          description: "MIME type of the file",
        },
        isDefault: {
          bsonType: "bool",
          description: "Whether this is the default document of its type",
        },
        parsedData: {
          bsonType: "object",
          description: "Extracted data from the document (for PDS, resumes)",
        },
        createdAt: {
          bsonType: "date",
          description: "Document upload timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Document update timestamp",
        },
      },
    },
  },
})

// Create indexes for documents collection
db.documents.createIndex({ userId: 1 })
db.documents.createIndex({ type: 1 })
db.documents.createIndex({ userId: 1, type: 1 })

// Applications Collection
db.createCollection("applications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["jobId", "applicantId", "status", "createdAt", "updatedAt"],
      properties: {
        jobId: {
          bsonType: "objectId",
          description: "Reference to job ID",
        },
        applicantId: {
          bsonType: "objectId",
          description: "Reference to applicant user ID",
        },
        resumeId: {
          bsonType: "objectId",
          description: "Reference to resume document ID",
        },
        coverLetterId: {
          bsonType: "objectId",
          description: "Reference to cover letter document ID",
        },
        pdsId: {
          bsonType: "objectId",
          description: "Reference to PDS document ID",
        },
        additionalDocuments: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
          },
          description: "References to additional document IDs",
        },
        status: {
          enum: ["applied", "screening", "interview", "offered", "hired", "rejected", "withdrawn"],
          description: "Status of the application",
        },
        notes: {
          bsonType: "string",
          description: "Notes about the application",
        },
        matchScore: {
          bsonType: "number",
          description: "AI-calculated match score between applicant and job",
        },
        matchDetails: {
          bsonType: "object",
          properties: {
            educationScore: { bsonType: "number" },
            experienceScore: { bsonType: "number" },
            skillsScore: { bsonType: "number" },
            eligibilityScore: { bsonType: "number" },
          },
          description: "Detailed scores for different matching criteria",
        },
        interviewDate: {
          bsonType: "date",
          description: "Scheduled interview date",
        },
        interviewLocation: {
          bsonType: "string",
          description: "Interview location or link",
        },
        interviewType: {
          enum: ["in-person", "phone", "video"],
          description: "Type of interview",
        },
        rejectionReason: {
          bsonType: "string",
          description: "Reason for rejection if applicable",
        },
        createdAt: {
          bsonType: "date",
          description: "Application submission timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Application update timestamp",
        },
      },
    },
  },
})

// Create indexes for applications collection
db.applications.createIndex({ jobId: 1 })
db.applications.createIndex({ applicantId: 1 })
db.applications.createIndex({ status: 1 })
db.applications.createIndex({ jobId: 1, applicantId: 1 }, { unique: true })
db.applications.createIndex({ matchScore: 1 })

// Messages Collection
db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["senderId", "receiverId", "content", "createdAt"],
      properties: {
        senderId: {
          bsonType: "objectId",
          description: "Reference to sender user ID",
        },
        receiverId: {
          bsonType: "objectId",
          description: "Reference to receiver user ID",
        },
        applicationId: {
          bsonType: "objectId",
          description: "Reference to application ID if related to an application",
        },
        jobId: {
          bsonType: "objectId",
          description: "Reference to job ID if related to a job",
        },
        subject: {
          bsonType: "string",
          description: "Message subject",
        },
        content: {
          bsonType: "string",
          description: "Message content",
        },
        isRead: {
          bsonType: "bool",
          description: "Whether the message has been read",
        },
        readAt: {
          bsonType: "date",
          description: "Timestamp when message was read",
        },
        attachments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              url: { bsonType: "string" },
              fileType: { bsonType: "string" },
              fileSize: { bsonType: "number" },
            },
          },
          description: "Message attachments",
        },
        createdAt: {
          bsonType: "date",
          description: "Message creation timestamp",
        },
      },
    },
  },
})

// Create indexes for messages collection
db.messages.createIndex({ senderId: 1 })
db.messages.createIndex({ receiverId: 1 })
db.messages.createIndex({ applicationId: 1 })
db.messages.createIndex({ jobId: 1 })
db.messages.createIndex({ createdAt: 1 })

// Notifications Collection
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "message", "createdAt"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "Reference to user ID",
        },
        type: {
          enum: ["application", "message", "interview", "status-change", "system"],
          description: "Type of notification",
        },
        message: {
          bsonType: "string",
          description: "Notification message",
        },
        relatedId: {
          bsonType: "objectId",
          description: "Reference to related entity (job, application, etc.)",
        },
        relatedType: {
          enum: ["job", "application", "message", "user", "document"],
          description: "Type of related entity",
        },
        isRead: {
          bsonType: "bool",
          description: "Whether the notification has been read",
        },
        readAt: {
          bsonType: "date",
          description: "Timestamp when notification was read",
        },
        createdAt: {
          bsonType: "date",
          description: "Notification creation timestamp",
        },
      },
    },
  },
})

// Create indexes for notifications collection
db.notifications.createIndex({ userId: 1 })
db.notifications.createIndex({ type: 1 })
db.notifications.createIndex({ createdAt: 1 })
db.notifications.createIndex({ isRead: 1 })

// Analytics Collection
db.createCollection("analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "date", "createdAt"],
      properties: {
        type: {
          enum: ["job-views", "applications", "user-registrations", "document-uploads", "job-postings"],
          description: "Type of analytics data",
        },
        date: {
          bsonType: "date",
          description: "Date for the analytics data",
        },
        data: {
          bsonType: "object",
          description: "Analytics data object",
        },
        createdAt: {
          bsonType: "date",
          description: "Analytics record creation timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Analytics record update timestamp",
        },
      },
    },
  },
})

// Create indexes for analytics collection
db.analytics.createIndex({ type: 1 })
db.analytics.createIndex({ date: 1 })
db.analytics.createIndex({ type: 1, date: 1 })

// Settings Collection
db.createCollection("settings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["key", "value", "updatedAt"],
      properties: {
        key: {
          bsonType: "string",
          description: "Setting key",
        },
        value: {
          description: "Setting value (can be any type)",
        },
        description: {
          bsonType: "string",
          description: "Description of the setting",
        },
        category: {
          bsonType: "string",
          description: "Category of the setting",
        },
        isPublic: {
          bsonType: "bool",
          description: "Whether the setting is publicly accessible",
        },
        updatedBy: {
          bsonType: "objectId",
          description: "Reference to user who last updated the setting",
        },
        updatedAt: {
          bsonType: "date",
          description: "Setting update timestamp",
        },
      },
    },
  },
})

// Create indexes for settings collection
db.settings.createIndex({ key: 1 }, { unique: true })
db.settings.createIndex({ category: 1 })

console.log("MongoDB schema created successfully!")
