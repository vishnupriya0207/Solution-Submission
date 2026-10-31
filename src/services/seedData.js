// Seed data for Brightloop Software Subscription Management System

export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Brightloop Cloud Suite Enterprise",
    type: "Software License",
    salesPrice: 2499,
    costPrice: 650,
    description: "Full-spectrum enterprise resource planning, analytics, and workflow automation cloud license.",
    variants: [
      { name: "Single Region (US)", priceDelta: 0 },
      { name: "Multi-Region Global", priceDelta: 500 },
      { name: "Dedicated VPC & SLA 99.99%", priceDelta: 1200 }
    ],
    createdAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "prod-2",
    name: "API Gateway & Microservices Platform",
    type: "Cloud Resource",
    salesPrice: 899,
    costPrice: 220,
    description: "High-throughput API gateway with traffic shaping, JWT validation, and automated failover.",
    variants: [
      { name: "Standard (10M req/mo)", priceDelta: 0 },
      { name: "High-Throughput (50M req/mo)", priceDelta: 400 },
      { name: "Unlimited Enterprise Tier", priceDelta: 950 }
    ],
    createdAt: "2026-02-10T11:30:00Z"
  },
  {
    id: "prod-3",
    name: "24/7 Dedicated DevOps & Security Support",
    type: "Service",
    salesPrice: 1500,
    costPrice: 800,
    description: "Round-the-clock priority response time under 15 minutes with dedicated site reliability engineers.",
    variants: [
      { name: "Business Hours Only", priceDelta: -400 },
      { name: "24/7/365 On-Call SRE", priceDelta: 0 }
    ],
    createdAt: "2026-03-01T09:15:00Z"
  },
  {
    id: "prod-4",
    name: "Brightloop AI Intelligence Engine",
    type: "Software License",
    salesPrice: 1850,
    costPrice: 420,
    description: "Embedded predictive intelligence models for automated customer churn prediction and churn prevention.",
    variants: [
      { name: "Base Model (100k inferences)", priceDelta: 0 },
      { name: "Custom Fine-tuned LLM", priceDelta: 800 }
    ],
    createdAt: "2026-04-12T14:20:00Z"
  },
  {
    id: "prod-5",
    name: "Architecture & Integration Consulting",
    type: "Consulting",
    salesPrice: 3200,
    costPrice: 1600,
    description: "Bespoke digital architecture advisory, cloud migration planning, and security audits.",
    variants: [
      { name: "Standard Package (20 hrs)", priceDelta: 0 },
      { name: "Extended Package (50 hrs)", priceDelta: 2400 }
    ],
    createdAt: "2026-05-05T10:00:00Z"
  }
];

export const INITIAL_PLANS = [
  {
    id: "plan-1",
    name: "Enterprise Annual Commitment",
    billingCycle: "yearly",
    price: 24000,
    minQuantity: 1,
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    renewalMode: "auto",
    pauseAllowed: true,
    description: "Maximum value for large enterprise deployments. Includes annual audits and dedicated TAM.",
    active: true
  },
  {
    id: "plan-2",
    name: "Professional Monthly Pro",
    billingCycle: "monthly",
    price: 2200,
    minQuantity: 1,
    startDate: "2026-01-01",
    endDate: "2028-12-31",
    renewalMode: "auto",
    pauseAllowed: true,
    description: "Ideal for fast-scaling growth businesses needing flexible monthly commitments.",
    active: true
  },
  {
    id: "plan-3",
    name: "Growth Weekly Sprint",
    billingCycle: "weekly",
    price: 650,
    minQuantity: 1,
    startDate: "2026-01-01",
    endDate: "2027-06-30",
    renewalMode: "manual",
    pauseAllowed: true,
    description: "Weekly billed compute and consulting burst capacity for high-velocity sprint cycles.",
    active: true
  },
  {
    id: "plan-4",
    name: "High-Performance Daily Burst",
    billingCycle: "daily",
    price: 120,
    minQuantity: 2,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    renewalMode: "manual",
    pauseAllowed: false,
    description: "On-demand daily cloud processing nodes for spike processing and load testing runs.",
    active: true
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Sarah Chen",
    company: "Apex Global FinTech",
    email: "s.chen@apexfintech.com",
    phone: "+1 (415) 890-2341",
    address: "500 Howard Street, Suite 400, San Francisco, CA 94105",
    status: "active",
    createdAt: "2026-01-20T10:00:00Z"
  },
  {
    id: "cust-2",
    name: "Marcus Vance",
    company: "NovaHealth Diagnostics",
    email: "mvance@novahealth.org",
    phone: "+1 (617) 555-0199",
    address: "75 Binney Street, Cambridge, MA 02142",
    status: "active",
    createdAt: "2026-02-14T11:20:00Z"
  },
  {
    id: "cust-3",
    name: "Elena Rostova",
    company: "HyperScale Logistics",
    email: "erostova@hyperscale.eu",
    phone: "+44 20 7946 0912",
    address: "30 St Mary Axe, City of London, London EC3A 8EP",
    status: "active",
    createdAt: "2026-03-05T15:45:00Z"
  },
  {
    id: "cust-4",
    name: "David Kim",
    company: "Quantum Matrix AI",
    email: "dkim@quantummatrix.io",
    phone: "+1 (206) 448-9011",
    address: "400 Pine Street, Seattle, WA 98101",
    status: "active",
    createdAt: "2026-04-18T09:30:00Z"
  },
  {
    id: "cust-5",
    name: "Priya Patel",
    company: "BlueHorizon Media",
    email: "priya@bluehorizonmedia.com",
    phone: "+1 (312) 670-3488",
    address: "233 S Wacker Dr, Chicago, IL 60606",
    status: "inactive",
    createdAt: "2026-05-02T13:10:00Z"
  }
];

export const INITIAL_DISCOUNTS = [
  {
    id: "disc-1",
    code: "LAUNCH20",
    type: "percentage",
    value: 20,
    minPurchase: 1000,
    startDate: "2026-01-01",
    expiryDate: "2026-12-31",
    usageLimit: 100,
    timesUsed: 14,
    active: true
  },
  {
    id: "disc-2",
    code: "ENTERPRISE500",
    type: "fixed",
    value: 500,
    minPurchase: 3000,
    startDate: "2026-01-01",
    expiryDate: "2026-11-30",
    usageLimit: 50,
    timesUsed: 8,
    active: true
  },
  {
    id: "disc-3",
    code: "STARTUP10",
    type: "percentage",
    value: 10,
    minPurchase: 500,
    startDate: "2026-02-01",
    expiryDate: "2026-12-31",
    usageLimit: 200,
    timesUsed: 31,
    active: true
  }
];

export const INITIAL_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    code: "SUB-8021",
    customerId: "cust-1",
    planId: "plan-1",
    productId: "prod-1",
    status: "active",
    quantity: 1,
    discountCode: "LAUNCH20",
    discountAmount: 4800,
    unitPrice: 24000,
    totalAmount: 19200,
    billingCycle: "yearly",
    startDate: "2026-01-25",
    nextBillingDate: "2027-01-25",
    renewalSettings: "auto",
    history: [
      { action: "Created Draft", timestamp: "2026-01-20T10:15:00Z", by: "Admin" },
      { action: "Sent Quotation", timestamp: "2026-01-22T14:30:00Z", by: "Admin" },
      { action: "Confirmed Subscription", timestamp: "2026-01-24T09:00:00Z", by: "Admin" },
      { action: "Activated Plan", timestamp: "2026-01-25T08:00:00Z", by: "System" }
    ],
    createdAt: "2026-01-20T10:15:00Z"
  },
  {
    id: "sub-2",
    code: "SUB-8022",
    customerId: "cust-2",
    planId: "plan-2",
    productId: "prod-2",
    status: "active",
    quantity: 2,
    discountCode: "",
    discountAmount: 0,
    unitPrice: 2200,
    totalAmount: 4400,
    billingCycle: "monthly",
    startDate: "2026-02-15",
    nextBillingDate: "2026-11-15",
    renewalSettings: "auto",
    history: [
      { action: "Created & Confirmed", timestamp: "2026-02-14T11:45:00Z", by: "Admin" },
      { action: "Activated Plan", timestamp: "2026-02-15T09:00:00Z", by: "System" }
    ],
    createdAt: "2026-02-14T11:45:00Z"
  },
  {
    id: "sub-3",
    code: "SUB-8023",
    customerId: "cust-3",
    planId: "plan-2",
    productId: "prod-4",
    status: "active",
    quantity: 1,
    discountCode: "STARTUP10",
    discountAmount: 220,
    unitPrice: 2200,
    totalAmount: 1980,
    billingCycle: "monthly",
    startDate: "2026-03-10",
    nextBillingDate: "2026-11-10",
    renewalSettings: "auto",
    history: [
      { action: "Created Quotation", timestamp: "2026-03-08T12:00:00Z", by: "Staff" },
      { action: "Confirmed & Activated", timestamp: "2026-03-10T10:00:00Z", by: "Admin" }
    ],
    createdAt: "2026-03-08T12:00:00Z"
  },
  {
    id: "sub-4",
    code: "SUB-8024",
    customerId: "cust-4",
    planId: "plan-3",
    productId: "prod-3",
    status: "paused",
    quantity: 1,
    discountCode: "",
    discountAmount: 0,
    unitPrice: 650,
    totalAmount: 650,
    billingCycle: "weekly",
    startDate: "2026-04-20",
    nextBillingDate: "2026-11-03",
    renewalSettings: "manual",
    history: [
      { action: "Activated Plan", timestamp: "2026-04-20T09:00:00Z", by: "Admin" },
      { action: "Subscription Paused by Customer Request", timestamp: "2026-10-25T16:00:00Z", by: "Staff" }
    ],
    createdAt: "2026-04-19T14:10:00Z"
  },
  {
    id: "sub-5",
    code: "SUB-8025",
    customerId: "cust-5",
    planId: "plan-2",
    productId: "prod-1",
    status: "closed",
    quantity: 1,
    discountCode: "",
    discountAmount: 0,
    unitPrice: 2200,
    totalAmount: 2200,
    billingCycle: "monthly",
    startDate: "2026-05-10",
    nextBillingDate: "2026-09-10",
    renewalSettings: "manual",
    history: [
      { action: "Activated Plan", timestamp: "2026-05-10T09:00:00Z", by: "Admin" },
      { action: "Subscription Cancelled (End of Contract)", timestamp: "2026-09-10T17:00:00Z", by: "Admin" }
    ],
    createdAt: "2026-05-08T11:20:00Z"
  },
  {
    id: "sub-6",
    code: "SUB-8026",
    customerId: "cust-1",
    planId: "plan-4",
    productId: "prod-2",
    status: "quotation",
    quantity: 3,
    discountCode: "LAUNCH20",
    discountAmount: 72,
    unitPrice: 120,
    totalAmount: 288,
    billingCycle: "daily",
    startDate: "2026-11-01",
    nextBillingDate: "2026-11-02",
    renewalSettings: "manual",
    history: [
      { action: "Draft Created", timestamp: "2026-10-30T10:00:00Z", by: "Staff" },
      { action: "Quotation Generated", timestamp: "2026-10-31T09:30:00Z", by: "Staff" }
    ],
    createdAt: "2026-10-30T10:00:00Z"
  }
];

export const INITIAL_INVOICES = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-001",
    subscriptionId: "sub-1",
    customerId: "cust-1",
    customerName: "Apex Global FinTech (Sarah Chen)",
    customerEmail: "s.chen@apexfintech.com",
    customerAddress: "500 Howard Street, Suite 400, San Francisco, CA 94105",
    billingPeriod: "2026-01-25 to 2027-01-24",
    issueDate: "2026-01-25",
    dueDate: "2026-02-10",
    items: [
      {
        description: "Brightloop Cloud Suite Enterprise (Annual Commitment)",
        quantity: 1,
        unitPrice: 24000,
        amount: 24000
      }
    ],
    subtotal: 24000,
    discount: 4800,
    taxRate: 10,
    taxAmount: 1920,
    totalAmount: 21120,
    status: "paid",
    paidAt: "2026-01-26T15:20:00Z",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-01-25T08:30:00Z"
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-002",
    subscriptionId: "sub-2",
    customerId: "cust-2",
    customerName: "NovaHealth Diagnostics (Marcus Vance)",
    customerEmail: "mvance@novahealth.org",
    customerAddress: "75 Binney Street, Cambridge, MA 02142",
    billingPeriod: "2026-09-15 to 2026-10-14",
    issueDate: "2026-09-15",
    dueDate: "2026-09-30",
    items: [
      {
        description: "API Gateway & Microservices Platform (Monthly Pro)",
        quantity: 2,
        unitPrice: 2200,
        amount: 4400
      }
    ],
    subtotal: 4400,
    discount: 0,
    taxRate: 10,
    taxAmount: 440,
    totalAmount: 4840,
    status: "paid",
    paidAt: "2026-09-20T11:00:00Z",
    paymentMethod: "Stripe",
    createdAt: "2026-09-15T09:00:00Z"
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-003",
    subscriptionId: "sub-2",
    customerId: "cust-2",
    customerName: "NovaHealth Diagnostics (Marcus Vance)",
    customerEmail: "mvance@novahealth.org",
    customerAddress: "75 Binney Street, Cambridge, MA 02142",
    billingPeriod: "2026-10-15 to 2026-11-14",
    issueDate: "2026-10-15",
    dueDate: "2026-10-30",
    items: [
      {
        description: "API Gateway & Microservices Platform (Monthly Pro)",
        quantity: 2,
        unitPrice: 2200,
        amount: 4400
      }
    ],
    subtotal: 4400,
    discount: 0,
    taxRate: 10,
    taxAmount: 440,
    totalAmount: 4840,
    status: "overdue",
    paidAt: null,
    paymentMethod: null,
    createdAt: "2026-10-15T09:00:00Z"
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-004",
    subscriptionId: "sub-3",
    customerId: "cust-3",
    customerName: "HyperScale Logistics (Elena Rostova)",
    customerEmail: "erostova@hyperscale.eu",
    customerAddress: "30 St Mary Axe, City of London, London EC3A 8EP",
    billingPeriod: "2026-10-10 to 2026-11-09",
    issueDate: "2026-10-10",
    dueDate: "2026-11-05",
    items: [
      {
        description: "Brightloop AI Intelligence Engine (Monthly Pro)",
        quantity: 1,
        unitPrice: 2200,
        amount: 2200
      }
    ],
    subtotal: 2200,
    discount: 220,
    taxRate: 10,
    taxAmount: 198,
    totalAmount: 2178,
    status: "confirmed",
    paidAt: null,
    paymentMethod: null,
    createdAt: "2026-10-10T10:00:00Z"
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-005",
    subscriptionId: "sub-4",
    customerId: "cust-4",
    customerName: "Quantum Matrix AI (David Kim)",
    customerEmail: "dkim@quantummatrix.io",
    customerAddress: "400 Pine Street, Seattle, WA 98101",
    billingPeriod: "2026-10-19 to 2026-10-25",
    issueDate: "2026-10-19",
    dueDate: "2026-11-02",
    items: [
      {
        description: "24/7 Dedicated DevOps & Security Support (Weekly Sprint)",
        quantity: 1,
        unitPrice: 650,
        amount: 650
      }
    ],
    subtotal: 650,
    discount: 0,
    taxRate: 10,
    taxAmount: 65,
    totalAmount: 715,
    status: "confirmed",
    paidAt: null,
    paymentMethod: null,
    createdAt: "2026-10-19T08:15:00Z"
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: "pay-1",
    paymentNumber: "PAY-9001",
    invoiceId: "inv-1",
    invoiceNumber: "INV-2026-001",
    customerId: "cust-1",
    customerName: "Apex Global FinTech",
    amount: 21120,
    method: "Bank Transfer",
    date: "2026-01-26",
    status: "successful",
    transactionRef: "WIRE-ACH-88910482",
    notes: "Annual prepayment processed via Wire Transfer",
    createdAt: "2026-01-26T15:20:00Z"
  },
  {
    id: "pay-2",
    paymentNumber: "PAY-9002",
    invoiceId: "inv-2",
    invoiceNumber: "INV-2026-002",
    customerId: "cust-2",
    customerName: "NovaHealth Diagnostics",
    amount: 4840,
    method: "Stripe",
    date: "2026-09-20",
    status: "successful",
    transactionRef: "ch_3N8F99XqL01A",
    notes: "Corporate Visa Ending in 4242",
    createdAt: "2026-09-20T11:00:00Z"
  }
];

export const DEMO_USERS = [
  {
    id: "user-admin",
    name: "Vishnupriya",
    email: "admin@brightloop.io",
    role: "admin",
    title: "Chief Executive Officer & Admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    department: "Executive Suite"
  },
  {
    id: "user-staff",
    name: "Alex Miller",
    email: "staff@brightloop.io",
    role: "staff",
    title: "Billing Operations Specialist",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    department: "Customer Success & Billing"
  },
  {
    id: "user-cust",
    name: "Sarah Chen",
    email: "client@acmecorp.com",
    role: "customer",
    title: "VP of Engineering at Apex Global FinTech",
    customerId: "cust-1",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Apex Global FinTech"
  }
];
