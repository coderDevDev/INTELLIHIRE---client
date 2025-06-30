// Sample data for InteliHire MongoDB database

// This file contains sample data to populate the MongoDB collections
// You can use this to initialize your database with test data

// Import ObjectId from mongodb
const { ObjectId } = require("mongodb")

// Sample Job Categories
const jobCategories = [
  {
    _id: ObjectId(),
    name: "Information Technology",
    description: "Jobs related to IT, software development, and technical support",
    icon: "Code",
    color: "bg-blue-100 text-blue-600",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Business",
    description: "Jobs related to business administration and management",
    icon: "Building2",
    color: "bg-purple-100 text-purple-600",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Sales",
    description: "Jobs related to sales and marketing",
    icon: "ShoppingBag",
    color: "bg-green-100 text-green-600",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Construction",
    description: "Jobs related to construction and engineering",
    icon: "Hammer",
    color: "bg-yellow-100 text-yellow-600",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Healthcare",
    description: "Jobs related to healthcare and medical services",
    icon: "HeartPulse",
    color: "bg-red-100 text-red-600",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Government",
    description: "Jobs in government agencies and public service",
    icon: "Landmark",
    color: "bg-indigo-100 text-indigo-600",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Sample Companies
const companies = [
  {
    _id: ObjectId(),
    name: "Epson Precision Philippines Inc.",
    logo: "/placeholder.svg?height=60&width=120",
    description:
      "Epson is a global technology leader dedicated to becoming indispensable to society by connecting people, things and information with its original efficient, compact and precision technologies.",
    industry: "Manufacturing",
    website: "https://www.epson.com.ph",
    contactEmail: "careers@epson.com.ph",
    contactPhone: "(043) 123-4567",
    address: {
      street: "Lima Technology Center",
      city: "Sto. Tomas",
      province: "Batangas",
      zipCode: "4234",
    },
    isGovernment: false,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "MyBrush Technology Inc.",
    logo: "/placeholder.svg?height=60&width=120",
    description: "MyBrush Technology Inc. is a leading technology company specializing in innovative solutions.",
    industry: "Information Technology",
    website: "https://www.mybrush.com",
    contactEmail: "hr@mybrush.com",
    contactPhone: "(043) 234-5678",
    address: {
      street: "First Philippine Industrial Park",
      city: "Sto. Tomas",
      province: "Batangas",
      zipCode: "4234",
    },
    isGovernment: false,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Murata Manufacturing",
    logo: "/placeholder.svg?height=60&width=120",
    description:
      "Murata Manufacturing is a global leader in the design, manufacture and supply of advanced electronic components.",
    industry: "Electronics Manufacturing",
    website: "https://www.murata.com",
    contactEmail: "careers@murata.com",
    contactPhone: "(043) 345-6789",
    address: {
      street: "Lima Technology Center",
      city: "Sto. Tomas",
      province: "Batangas",
      zipCode: "4234",
    },
    isGovernment: false,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "SM City Sto. Tomas",
    logo: "/placeholder.svg?height=60&width=120",
    description: "SM City Sto. Tomas is a shopping mall operated by SM Prime Holdings.",
    industry: "Retail",
    website: "https://www.smsupermalls.com",
    contactEmail: "hr.stotomas@sm.com",
    contactPhone: "(043) 456-7890",
    address: {
      street: "Maharlika Highway",
      city: "Sto. Tomas",
      province: "Batangas",
      zipCode: "4234",
    },
    isGovernment: false,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "City Government of Sto. Tomas",
    logo: "/placeholder.svg?height=60&width=120",
    description: "The local government unit of Sto. Tomas, Batangas.",
    industry: "Government",
    website: "https://www.stotomas.gov.ph",
    contactEmail: "hr@stotomas.gov.ph",
    contactPhone: "(043) 567-8901",
    address: {
      street: "City Hall, Maharlika Highway",
      city: "Sto. Tomas",
      province: "Batangas",
      zipCode: "4234",
    },
    isGovernment: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Sample Admin User
const adminUser = {
  _id: ObjectId(),
  email: "admin@stotomas.gov.ph",
  password: "$2b$10$X7KAUg1Z8dRNGSz7/zIGGu4VeQKTWjJEFj6OAWp1X7Lp0xZ7JvKSa", // hashed "password123"
  role: "admin",
  firstName: "Admin",
  lastName: "User",
  phoneNumber: "09123456789",
  isVerified: true,
  isActive: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Sample Applicant User
const applicantUser = {
  _id: ObjectId(),
  email: "john.doe@example.com",
  password: "$2b$10$X7KAUg1Z8dRNGSz7/zIGGu4VeQKTWjJEFj6OAWp1X7Lp0xZ7JvKSa", // hashed "password123"
  role: "applicant",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "09123456780",
  address: {
    street: "123 Main St",
    city: "Sto. Tomas",
    province: "Batangas",
    zipCode: "4234",
  },
  isVerified: true,
  isActive: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Sample Applicant Profile
const applicantProfile = {
  _id: ObjectId(),
  userId: applicantUser._id,
  headline: "Software Developer with 3+ years of experience",
  summary: "Experienced software developer with a passion for creating efficient and scalable applications.",
  skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "HTML", "CSS"],
  education: [
    {
      institution: "Batangas State University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: new Date("2016-06-01"),
      endDate: new Date("2020-04-01"),
      isOngoing: false,
      description: "Graduated with honors",
    },
  ],
  experience: [
    {
      company: "Tech Solutions Inc.",
      position: "Junior Software Developer",
      location: "Batangas City",
      startDate: new Date("2020-06-01"),
      endDate: new Date("2022-05-31"),
      isCurrentPosition: false,
      description: "Developed and maintained web applications using React and Node.js",
    },
    {
      company: "Web Innovations",
      position: "Software Developer",
      location: "Sto. Tomas, Batangas",
      startDate: new Date("2022-06-01"),
      endDate: null,
      isCurrentPosition: true,
      description: "Leading development of e-commerce platforms using MERN stack",
    },
  ],
  certifications: [
    {
      name: "MongoDB Certified Developer",
      issuingOrganization: "MongoDB Inc.",
      issueDate: new Date("2021-03-15"),
      expirationDate: new Date("2024-03-15"),
      credentialId: "MCD12345",
      credentialURL: "https://mongodb.com/certifications/verify/MCD12345",
    },
  ],
  eligibility: [
    {
      name: "Civil Service Professional",
      issuingBody: "Civil Service Commission",
      issueDate: new Date("2020-08-10"),
      expirationDate: null,
      licenseNumber: "CSP-2020-12345",
    },
  ],
  languages: [
    {
      language: "English",
      proficiency: "Fluent",
    },
    {
      language: "Filipino",
      proficiency: "Native",
    },
  ],
  preferences: {
    jobTypes: ["Full-time", "Remote"],
    locations: ["Sto. Tomas", "Batangas City", "Lipa City"],
    industries: ["Information Technology", "Software Development"],
    minSalary: 30000,
  },
  profileCompleteness: 85,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Sample Jobs
const itCategoryId = jobCategories[0]._id
const govCategoryId = jobCategories[5]._id
const epsonCompanyId = companies[0]._id
const cityGovId = companies[4]._id

const jobs = [
  {
    _id: ObjectId(),
    title: "Software Developer",
    companyId: epsonCompanyId,
    categoryId: itCategoryId,
    description:
      "We are looking for a skilled Software Developer to join our team. The ideal candidate will have experience in developing high-quality applications using modern technologies.",
    responsibilities:
      "- Design and implement software solutions\n- Write clean, maintainable code\n- Troubleshoot and debug applications\n- Collaborate with cross-functional teams",
    requirements:
      "- Bachelor's degree in Computer Science or related field\n- 2+ years of experience in software development\n- Proficiency in JavaScript, React, and Node.js\n- Experience with database systems",
    benefits: "- Competitive salary\n- Health insurance\n- 13th month pay\n- Professional development opportunities",
    location: "Sto. Tomas, Batangas",
    employmentType: "Full-time",
    salaryMin: 30000,
    salaryMax: 45000,
    salaryCurrency: "PHP",
    salaryPeriod: "monthly",
    isSalaryNegotiable: true,
    experienceLevel: "Mid-Level",
    experienceYearsMin: 2,
    experienceYearsMax: 5,
    educationLevel: "Bachelor",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
    postedDate: new Date(),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: "active",
    isFeatured: true,
    isUrgent: false,
    allowsRemote: false,
    department: "IT Department",
    positionCount: 2,
    viewCount: 45,
    applicationCount: 18,
    createdBy: adminUser._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: "IT Helpdesk",
    companyId: cityGovId,
    categoryId: itCategoryId,
    description:
      "The City Government of Sto. Tomas is seeking an IT Helpdesk Specialist to provide technical support to city employees and maintain IT systems.",
    responsibilities:
      "- Respond to user inquiries and provide technical assistance\n- Troubleshoot hardware and software issues\n- Set up workstations and peripheral devices\n- Maintain IT inventory",
    requirements:
      "- Bachelor's degree in IT or related field\n- 1+ years of experience in IT support\n- Knowledge of Windows and Office applications\n- Basic networking knowledge",
    benefits:
      "- Government salary grade SG-11 (₱25,439/month)\n- Government benefits\n- Career advancement opportunities",
    location: "Sto. Tomas City Hall",
    employmentType: "Full-time",
    salaryMin: 25439,
    salaryMax: 25439,
    salaryCurrency: "PHP",
    salaryPeriod: "monthly",
    isSalaryNegotiable: false,
    experienceLevel: "Junior",
    experienceYearsMin: 1,
    experienceYearsMax: 3,
    educationLevel: "Bachelor",
    skills: ["IT Support", "Windows", "Office", "Networking", "Hardware Troubleshooting"],
    postedDate: new Date(),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: "active",
    isFeatured: true,
    isUrgent: true,
    allowsRemote: false,
    department: "City Information Technology Office",
    positionCount: 1,
    viewCount: 32,
    applicationCount: 8,
    createdBy: adminUser._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: "Administrative Assistant",
    companyId: cityGovId,
    categoryId: govCategoryId,
    description:
      "The City Government of Sto. Tomas is looking for an Administrative Assistant to provide clerical and administrative support to the City Mayor's Office.",
    responsibilities:
      "- Manage office correspondence and filing systems\n- Schedule appointments and meetings\n- Prepare reports and presentations\n- Handle inquiries and requests",
    requirements:
      "- Bachelor's degree in Business Administration or related field\n- 1+ years of administrative experience\n- Proficiency in MS Office applications\n- Excellent communication skills",
    benefits:
      "- Government salary grade SG-8 (₱18,998/month)\n- Government benefits\n- Career advancement opportunities",
    location: "Sto. Tomas City Hall",
    employmentType: "Contract",
    salaryMin: 18998,
    salaryMax: 18998,
    salaryCurrency: "PHP",
    salaryPeriod: "monthly",
    isSalaryNegotiable: false,
    experienceLevel: "Junior",
    experienceYearsMin: 1,
    experienceYearsMax: 3,
    educationLevel: "Bachelor",
    skills: ["Administrative Support", "MS Office", "Filing", "Communication", "Customer Service"],
    postedDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 25)),
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 25)),
    status: "active",
    isFeatured: false,
    isUrgent: false,
    allowsRemote: false,
    department: "City Mayor's Office",
    positionCount: 1,
    viewCount: 28,
    applicationCount: 15,
    createdBy: adminUser._id,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
]

// Sample Document (PDS)
const pdsDocument = {
  _id: ObjectId(),
  userId: applicantUser._id,
  type: "pds",
  title: "Personal Data Sheet - John Doe",
  fileUrl: "/sample-documents/john-doe-pds.pdf",
  fileSize: 1024000,
  fileType: "application/pdf",
  isDefault: true,
  parsedData: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      middleName: "Smith",
      birthDate: new Date("1995-05-15"),
      birthPlace: "Batangas City",
      gender: "Male",
      civilStatus: "Single",
      citizenship: "Filipino",
      address: {
        residential: {
          houseNumber: "123",
          street: "Main St",
          subdivision: "Green Village",
          barangay: "San Roque",
          city: "Sto. Tomas",
          province: "Batangas",
          zipCode: "4234",
        },
        permanent: {
          houseNumber: "123",
          street: "Main St",
          subdivision: "Green Village",
          barangay: "San Roque",
          city: "Sto. Tomas",
          province: "Batangas",
          zipCode: "4234",
        },
      },
      contactInfo: {
        telephone: "043-123-4567",
        mobile: "09123456780",
        email: "john.doe@example.com",
      },
    },
    education: [
      {
        level: "College",
        schoolName: "Batangas State University",
        degree: "Bachelor of Science in Computer Science",
        from: "2016",
        to: "2020",
        units: "Graduated",
        yearGraduated: "2020",
        honors: "Cum Laude",
      },
      {
        level: "Secondary",
        schoolName: "Sto. Tomas National High School",
        degree: "High School Diploma",
        from: "2012",
        to: "2016",
        units: "Graduated",
        yearGraduated: "2016",
        honors: "With Honors",
      },
    ],
    civilService: [
      {
        examTitle: "Civil Service Professional",
        rating: "85.23",
        examDate: new Date("2020-08-10"),
        examPlace: "Batangas City",
        licenseNumber: "CSP-2020-12345",
        validity: "Lifetime",
      },
    ],
    workExperience: [
      {
        position: "Junior Software Developer",
        company: "Tech Solutions Inc.",
        from: new Date("2020-06-01"),
        to: new Date("2022-05-31"),
        salary: 25000,
        salaryGrade: "N/A",
        appointmentStatus: "Permanent",
        isGovernmentService: false,
      },
      {
        position: "Software Developer",
        company: "Web Innovations",
        from: new Date("2022-06-01"),
        to: null,
        salary: 35000,
        salaryGrade: "N/A",
        appointmentStatus: "Permanent",
        isGovernmentService: false,
      },
    ],
    training: [
      {
        title: "Web Development Bootcamp",
        from: new Date("2020-01-15"),
        to: new Date("2020-03-15"),
        hours: 120,
        type: "Technical",
        sponsor: "Code Academy",
      },
      {
        title: "Project Management Fundamentals",
        from: new Date("2021-06-10"),
        to: new Date("2021-06-12"),
        hours: 24,
        type: "Managerial",
        sponsor: "Management Institute",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "HTML", "CSS", "Git", "Agile Methodologies"],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Sample Resume Document
const resumeDocument = {
  _id: ObjectId(),
  userId: applicantUser._id,
  type: "resume",
  title: "John Doe - Software Developer Resume",
  fileUrl: "/sample-documents/john-doe-resume.pdf",
  fileSize: 512000,
  fileType: "application/pdf",
  isDefault: true,
  parsedData: {
    // Resume parsed data would go here
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Sample Application
const application = {
  _id: ObjectId(),
  jobId: jobs[0]._id,
  applicantId: applicantUser._id,
  resumeId: resumeDocument._id,
  pdsId: pdsDocument._id,
  status: "screening",
  notes: "Candidate has relevant experience and skills for the position.",
  matchScore: 85,
  matchDetails: {
    educationScore: 90,
    experienceScore: 80,
    skillsScore: 85,
    eligibilityScore: 70,
  },
  createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
}

// Sample Analytics Data
const analyticsData = [
  {
    _id: ObjectId(),
    type: "job-views",
    date: new Date(),
    data: {
      totalViews: 245,
      uniqueViews: 187,
      jobViews: {
        [jobs[0]._id.toString()]: 45,
        [jobs[1]._id.toString()]: 32,
        [jobs[2]._id.toString()]: 28,
      },
      categoryViews: {
        [itCategoryId.toString()]: 120,
        [govCategoryId.toString()]: 65,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    type: "applications",
    date: new Date(),
    data: {
      totalApplications: 42,
      applicationsByJob: {
        [jobs[0]._id.toString()]: 18,
        [jobs[1]._id.toString()]: 8,
        [jobs[2]._id.toString()]: 16,
      },
      applicationsByCategory: {
        [itCategoryId.toString()]: 26,
        [govCategoryId.toString()]: 16,
      },
      applicationsByStatus: {
        applied: 15,
        screening: 18,
        interview: 5,
        offered: 2,
        hired: 1,
        rejected: 1,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Sample Settings
const settings = [
  {
    _id: ObjectId(),
    key: "site_name",
    value: "InteliHire",
    description: "Name of the job portal",
    category: "general",
    isPublic: true,
    updatedBy: adminUser._id,
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    key: "contact_email",
    value: "peso@stotomas.gov.ph",
    description: "Contact email for the job portal",
    category: "contact",
    isPublic: true,
    updatedBy: adminUser._id,
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    key: "contact_phone",
    value: "(043) 123-4567",
    description: "Contact phone number for the job portal",
    category: "contact",
    isPublic: true,
    updatedBy: adminUser._id,
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    key: "matching_algorithm_threshold",
    value: 70,
    description: "Minimum match score threshold for job recommendations",
    category: "algorithm",
    isPublic: false,
    updatedBy: adminUser._id,
    updatedAt: new Date(),
  },
]

// Connect to MongoDB
const { MongoClient } = require("mongodb")

const uri = "mongodb://localhost:27017" // Replace with your MongoDB connection string
const client = new MongoClient(uri)

async function run() {
  try {
    await client.connect()
    console.log("Connected successfully to server")

    const db = client.db("InteliHire") // Replace with your database name

    // Insert all sample data
    await db.collection("jobCategories").insertMany(jobCategories)
    await db.collection("companies").insertMany(companies)
    await db.collection("users").insertOne(adminUser)
    await db.collection("users").insertOne(applicantUser)
    await db.collection("applicantProfiles").insertOne(applicantProfile)
    await db.collection("jobs").insertMany(jobs)
    await db.collection("documents").insertOne(pdsDocument)
    await db.collection("documents").insertOne(resumeDocument)
    await db.collection("applications").insertOne(application)
    await db.collection("analytics").insertMany(analyticsData)
    await db.collection("settings").insertMany(settings)

    console.log("Sample data inserted successfully!")
  } finally {
    await client.close()
  }
}

run().catch(console.dir)
