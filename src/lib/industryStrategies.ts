/**
 * Dynamic Industry-Specific Strategy Generator
 * Generates contextual execution options based on business profile
 */

import { BusinessProfile } from '@/types';

export interface ExecutionOption {
  id: string;
  title: string;
  description: string;
  projectedRevenue: number;
  riskDelta: number;
  burnoutDelta: number;
  timelineDays: number;
  cost: number;
  category: 'marketing' | 'operations' | 'growth' | 'partnerships' | 'technology';
}

// Industry-specific strategy templates
const industryStrategies: Record<string, (profile: BusinessProfile, parentPath: string) => ExecutionOption[]> = {
  // Food & Beverage
  'food': generateFoodStrategies,
  'food & beverage': generateFoodStrategies,
  'restaurant': generateFoodStrategies,
  'cafe': generateFoodStrategies,
  'cloud kitchen': generateFoodStrategies,
  'catering': generateFoodStrategies,

  // Retail & E-commerce
  'retail': generateRetailStrategies,
  'e-commerce': generateEcommerceStrategies,
  'ecommerce': generateEcommerceStrategies,
  'd2c': generateD2CStrategies,
  'd2c fashion': generateD2CStrategies,
  'd2c clothing': generateD2CStrategies,

  // SaaS & Technology
  'saas': generateSaaSStrategies,
  'saas b2b': generateSaaSStrategies,
  'software': generateSaaSStrategies,
  'technology': generateTechStrategies,
  'it services': generateTechStrategies,
  'fintech': generateFintechStrategies,

  // Healthcare
  'healthcare': generateHealthcareStrategies,
  'medical': generateHealthcareStrategies,
  'pharma': generatePharmaStrategies,
  'pharmacy': generatePharmaStrategies,

  // Education
  'education': generateEducationStrategies,
  'edtech': generateEdtechStrategies,
  'coaching': generateCoachingStrategies,

  // Manufacturing & Logistics
  'manufacturing': generateManufacturingStrategies,
  'logistics': generateLogisticsStrategies,
  'supply chain': generateLogisticsStrategies,

  // Services
  'consulting': generateConsultingStrategies,
  'professional services': generateConsultingStrategies,
  'agency': generateAgencyStrategies,
  'marketing agency': generateAgencyStrategies,

  // Kirana & Grocery
  'kirana': generateKiranaStrategies,
  'grocery': generateKiranaStrategies,
  'supermarket': generateRetailStrategies,

  // Real Estate
  'real estate': generateRealEstateStrategies,
  'property': generateRealEstateStrategies,

  // Fitness & Wellness
  'fitness': generateFitnessStrategies,
  'gym': generateFitnessStrategies,
  'wellness': generateWellnessStrategies,
  'spa': generateWellnessStrategies,
};

// Default generic strategies
function generateGenericStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000; // in lakhs

  return [
    {
      id: `${parentPath}-digital-marketing`,
      title: 'Digital Marketing Campaign',
      description: `Launch targeted ads on Google & Meta for ${profile.location} market`,
      projectedRevenue: Math.round(30 + baseRevenue * 5),
      riskDelta: 25,
      burnoutDelta: 15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.15),
      category: 'marketing',
    },
    {
      id: `${parentPath}-referral-program`,
      title: 'Customer Referral Program',
      description: 'Incentivize existing customers to bring new business',
      projectedRevenue: Math.round(20 + baseRevenue * 3),
      riskDelta: 10,
      burnoutDelta: 5,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.05),
      category: 'growth',
    },
    {
      id: `${parentPath}-process-automation`,
      title: 'Process Automation',
      description: 'Automate repetitive tasks to improve team efficiency',
      projectedRevenue: Math.round(15 + baseRevenue * 2),
      riskDelta: 15,
      burnoutDelta: -20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.2),
      category: 'operations',
    },
    {
      id: `${parentPath}-strategic-partnerships`,
      title: 'Strategic Partnerships',
      description: `Partner with complementary businesses in ${profile.location}`,
      projectedRevenue: Math.round(40 + baseRevenue * 4),
      riskDelta: 30,
      burnoutDelta: 10,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.1),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-team-expansion`,
      title: 'Strategic Hiring',
      description: `Hire ${Math.ceil(profile.teamSize * 0.2)} key roles to support growth`,
      projectedRevenue: Math.round(25 + baseRevenue * 6),
      riskDelta: 35,
      burnoutDelta: -15,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.3),
      category: 'operations',
    },
  ];
}

function generateFoodStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-delivery-expansion`,
      title: 'Delivery Platform Expansion',
      description: 'Expand presence on Swiggy, Zomato, and direct WhatsApp ordering',
      projectedRevenue: Math.round(45 + baseRevenue * 8),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 21,
      cost: Math.round(profile.mrr * 0.1),
      category: 'growth',
    },
    {
      id: `${parentPath}-menu-optimization`,
      title: 'Menu Engineering & Pricing',
      description: 'Optimize menu items for profitability and reduce food waste',
      projectedRevenue: Math.round(25 + baseRevenue * 4),
      riskDelta: 15,
      burnoutDelta: 5,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.02),
      category: 'operations',
    },
    {
      id: `${parentPath}-festival-catering`,
      title: 'Festival Catering Packages',
      description: 'Launch special packages for upcoming festivals and corporate events',
      projectedRevenue: Math.round(60 + baseRevenue * 10),
      riskDelta: 25,
      burnoutDelta: 25,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.08),
      category: 'marketing',
    },
    {
      id: `${parentPath}-loyalty-program`,
      title: 'Customer Loyalty Program',
      description: 'Launch points-based rewards for repeat customers',
      projectedRevenue: Math.round(30 + baseRevenue * 5),
      riskDelta: 10,
      burnoutDelta: 5,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.05),
      category: 'growth',
    },
    {
      id: `${parentPath}-kitchen-optimization`,
      title: 'Kitchen Operations Optimization',
      description: 'Implement batch cooking and inventory management systems',
      projectedRevenue: Math.round(20 + baseRevenue * 3),
      riskDelta: 10,
      burnoutDelta: -15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.06),
      category: 'operations',
    },
  ];
}

function generateRetailStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-omnichannel`,
      title: 'Omnichannel Integration',
      description: 'Connect offline store with online presence for seamless shopping',
      projectedRevenue: Math.round(50 + baseRevenue * 8),
      riskDelta: 30,
      burnoutDelta: 20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.15),
      category: 'technology',
    },
    {
      id: `${parentPath}-inventory-optimization`,
      title: 'Smart Inventory Management',
      description: 'AI-powered demand forecasting to reduce stockouts and overstock',
      projectedRevenue: Math.round(25 + baseRevenue * 4),
      riskDelta: 15,
      burnoutDelta: -10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.08),
      category: 'operations',
    },
    {
      id: `${parentPath}-local-influencers`,
      title: 'Local Influencer Campaigns',
      description: `Partner with ${profile.location} micro-influencers for store visibility`,
      projectedRevenue: Math.round(35 + baseRevenue * 6),
      riskDelta: 20,
      burnoutDelta: 10,
      timelineDays: 21,
      cost: Math.round(profile.mrr * 0.1),
      category: 'marketing',
    },
    {
      id: `${parentPath}-store-experience`,
      title: 'In-Store Experience Enhancement',
      description: 'Improve store layout, signage, and customer service training',
      projectedRevenue: Math.round(20 + baseRevenue * 3),
      riskDelta: 10,
      burnoutDelta: 15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.12),
      category: 'operations',
    },
    {
      id: `${parentPath}-whatsapp-commerce`,
      title: 'WhatsApp Commerce Setup',
      description: 'Enable ordering and customer support via WhatsApp Business',
      projectedRevenue: Math.round(30 + baseRevenue * 5),
      riskDelta: 10,
      burnoutDelta: 5,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.03),
      category: 'technology',
    },
  ];
}

function generateEcommerceStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-marketplace-expansion`,
      title: 'Marketplace Expansion',
      description: 'Expand to Amazon, Flipkart, and Meesho for wider reach',
      projectedRevenue: Math.round(55 + baseRevenue * 10),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.1),
      category: 'growth',
    },
    {
      id: `${parentPath}-conversion-optimization`,
      title: 'Conversion Rate Optimization',
      description: 'A/B test checkout flow, product pages, and pricing',
      projectedRevenue: Math.round(30 + baseRevenue * 5),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 21,
      cost: Math.round(profile.mrr * 0.05),
      category: 'technology',
    },
    {
      id: `${parentPath}-retargeting`,
      title: 'Retargeting Campaigns',
      description: 'Re-engage cart abandoners and past customers',
      projectedRevenue: Math.round(40 + baseRevenue * 7),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.08),
      category: 'marketing',
    },
    {
      id: `${parentPath}-logistics-optimization`,
      title: 'Logistics & Fulfillment',
      description: 'Partner with Delhivery/Shiprocket for faster, cheaper delivery',
      projectedRevenue: Math.round(25 + baseRevenue * 4),
      riskDelta: 20,
      burnoutDelta: -15,
      timelineDays: 21,
      cost: Math.round(profile.mrr * 0.06),
      category: 'operations',
    },
    {
      id: `${parentPath}-seo-content`,
      title: 'SEO & Content Marketing',
      description: 'Improve organic visibility with product descriptions and blog',
      projectedRevenue: Math.round(20 + baseRevenue * 4),
      riskDelta: 10,
      burnoutDelta: 15,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.04),
      category: 'marketing',
    },
  ];
}

function generateD2CStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-influencer-collab`,
      title: 'Influencer Collaboration',
      description: 'Partner with fashion/lifestyle influencers for brand awareness',
      projectedRevenue: Math.round(50 + baseRevenue * 9),
      riskDelta: 25,
      burnoutDelta: 15,
      timelineDays: 21,
      cost: Math.round(profile.mrr * 0.12),
      category: 'marketing',
    },
    {
      id: `${parentPath}-subscription-model`,
      title: 'Subscription Box Launch',
      description: 'Launch monthly subscription for predictable recurring revenue',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 35,
      burnoutDelta: 20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.15),
      category: 'growth',
    },
    {
      id: `${parentPath}-community-building`,
      title: 'Brand Community Building',
      description: 'Create exclusive community for customers with early access perks',
      projectedRevenue: Math.round(25 + baseRevenue * 5),
      riskDelta: 10,
      burnoutDelta: 10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.04),
      category: 'marketing',
    },
    {
      id: `${parentPath}-quick-commerce`,
      title: 'Quick Commerce Listing',
      description: 'List on Blinkit/Zepto for instant delivery in metros',
      projectedRevenue: Math.round(40 + baseRevenue * 7),
      riskDelta: 20,
      burnoutDelta: 10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.08),
      category: 'growth',
    },
    {
      id: `${parentPath}-ugc-campaign`,
      title: 'User Generated Content',
      description: 'Incentivize customers to share product photos/reviews',
      projectedRevenue: Math.round(30 + baseRevenue * 5),
      riskDelta: 10,
      burnoutDelta: 5,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.03),
      category: 'marketing',
    },
  ];
}

function generateSaaSStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-product-led-growth`,
      title: 'Product-Led Growth',
      description: 'Launch freemium tier to expand user base and upsell',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.2),
      category: 'growth',
    },
    {
      id: `${parentPath}-ca-network`,
      title: 'CA/Professional Referral Network',
      description: 'Partner with CAs and consultants for enterprise referrals',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 20,
      burnoutDelta: 10,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.08),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-integration-marketplace`,
      title: 'Integration Marketplace',
      description: 'Build integrations with Tally, Zoho, and WhatsApp',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.25),
      category: 'technology',
    },
    {
      id: `${parentPath}-customer-success`,
      title: 'Customer Success Team',
      description: 'Reduce churn with proactive customer success',
      projectedRevenue: Math.round(35 + baseRevenue * 6),
      riskDelta: 15,
      burnoutDelta: -10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.15),
      category: 'operations',
    },
    {
      id: `${parentPath}-seo-thought-leadership`,
      title: 'Thought Leadership Content',
      description: 'Create whitepapers and webinars for inbound leads',
      projectedRevenue: Math.round(30 + baseRevenue * 5),
      riskDelta: 10,
      burnoutDelta: 15,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.06),
      category: 'marketing',
    },
  ];
}

function generateTechStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-product-expansion`,
      title: 'Product Line Expansion',
      description: 'Add complementary features based on customer feedback',
      projectedRevenue: Math.round(55 + baseRevenue * 10),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.3),
      category: 'technology',
    },
    {
      id: `${parentPath}-enterprise-sales`,
      title: 'Enterprise Sales Team',
      description: 'Build dedicated team for large account acquisition',
      projectedRevenue: Math.round(70 + baseRevenue * 15),
      riskDelta: 40,
      burnoutDelta: 20,
      timelineDays: 120,
      cost: Math.round(profile.mrr * 0.35),
      category: 'growth',
    },
    {
      id: `${parentPath}-api-platform`,
      title: 'API Platform Launch',
      description: 'Enable third-party developers to build on your platform',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.2),
      category: 'technology',
    },
    {
      id: `${parentPath}-offshore-team`,
      title: 'Offshore Team Setup',
      description: 'Build offshore development team for cost efficiency',
      projectedRevenue: Math.round(25 + baseRevenue * 5),
      riskDelta: 30,
      burnoutDelta: 15,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.15),
      category: 'operations',
    },
    {
      id: `${parentPath}-startup-program`,
      title: 'Startup Partner Program',
      description: 'Offer discounts to startups for volume and referrals',
      projectedRevenue: Math.round(35 + baseRevenue * 6),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.05),
      category: 'partnerships',
    },
  ];
}

function generateFintechStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-embedded-finance`,
      title: 'Embedded Finance Partnerships',
      description: 'Integrate with e-commerce platforms for embedded payments',
      projectedRevenue: Math.round(70 + baseRevenue * 15),
      riskDelta: 35,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.25),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-compliance-automation`,
      title: 'Compliance Automation',
      description: 'Automate KYC/AML processes for faster onboarding',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 20,
      burnoutDelta: -15,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.15),
      category: 'technology',
    },
    {
      id: `${parentPath}-api-banking`,
      title: 'API Banking Integration',
      description: 'Connect with banks for seamless fund transfers',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 120,
      cost: Math.round(profile.mrr * 0.3),
      category: 'technology',
    },
    {
      id: `${parentPath}-msme-lending`,
      title: 'MSME Lending Program',
      description: 'Launch credit products for underserved MSMEs',
      projectedRevenue: Math.round(80 + baseRevenue * 20),
      riskDelta: 45,
      burnoutDelta: 30,
      timelineDays: 180,
      cost: Math.round(profile.mrr * 0.4),
      category: 'growth',
    },
    {
      id: `${parentPath}-gig-worker-services`,
      title: 'Gig Worker Financial Services',
      description: 'Target gig economy workers with micro-loans and savings',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 35,
      burnoutDelta: 25,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.2),
      category: 'growth',
    },
  ];
}

function generateHealthcareStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-telemedicine`,
      title: 'Telemedicine Platform',
      description: 'Launch video consultations for wider patient reach',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 25,
      burnoutDelta: 15,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.2),
      category: 'technology',
    },
    {
      id: `${parentPath}-corporate-wellness`,
      title: 'Corporate Wellness Programs',
      description: 'Partner with companies for employee health checkups',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 20,
      burnoutDelta: 20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.1),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-health-camps`,
      title: 'Community Health Camps',
      description: 'Organize free health camps for brand awareness',
      projectedRevenue: Math.round(30 + baseRevenue * 5),
      riskDelta: 15,
      burnoutDelta: 25,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.08),
      category: 'marketing',
    },
    {
      id: `${parentPath}-insurance-tie-ups`,
      title: 'Insurance Tie-ups',
      description: 'Partner with health insurers for empanelment',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.05),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-patient-app`,
      title: 'Patient Engagement App',
      description: 'Build app for appointments, records, and follow-ups',
      projectedRevenue: Math.round(35 + baseRevenue * 6),
      riskDelta: 25,
      burnoutDelta: -10,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.25),
      category: 'technology',
    },
  ];
}

function generatePharmaStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-online-pharmacy`,
      title: 'Online Pharmacy Expansion',
      description: 'Launch e-pharmacy with home delivery',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 30,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.2),
      category: 'growth',
    },
    {
      id: `${parentPath}-generic-push`,
      title: 'Generic Medicines Push',
      description: 'Promote affordable generics for higher margins',
      projectedRevenue: Math.round(40 + baseRevenue * 7),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.05),
      category: 'operations',
    },
    {
      id: `${parentPath}-doctor-network`,
      title: 'Doctor Referral Network',
      description: 'Build relationships with local doctors for prescriptions',
      projectedRevenue: Math.round(45 + baseRevenue * 9),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.08),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-subscription-meds`,
      title: 'Subscription Medicine Service',
      description: 'Auto-refill subscriptions for chronic patients',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 20,
      burnoutDelta: 10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.1),
      category: 'growth',
    },
    {
      id: `${parentPath}-inventory-ai`,
      title: 'AI Inventory Management',
      description: 'Predict demand and reduce medicine expiry waste',
      projectedRevenue: Math.round(25 + baseRevenue * 4),
      riskDelta: 15,
      burnoutDelta: -10,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.12),
      category: 'technology',
    },
  ];
}

function generateEducationStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-online-courses`,
      title: 'Online Course Platform',
      description: 'Launch recorded and live online courses',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 25,
      burnoutDelta: 25,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.2),
      category: 'growth',
    },
    {
      id: `${parentPath}-school-partnerships`,
      title: 'School Partnerships',
      description: 'Partner with schools for supplementary programs',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.1),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-franchising`,
      title: 'Franchise Model',
      description: 'Expand through franchises in tier-2/3 cities',
      projectedRevenue: Math.round(70 + baseRevenue * 15),
      riskDelta: 35,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.15),
      category: 'growth',
    },
    {
      id: `${parentPath}-test-prep`,
      title: 'Test Prep Programs',
      description: 'Launch specialized programs for competitive exams',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.12),
      category: 'growth',
    },
    {
      id: `${parentPath}-parent-engagement`,
      title: 'Parent Engagement App',
      description: 'Build app for progress tracking and communication',
      projectedRevenue: Math.round(25 + baseRevenue * 5),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.15),
      category: 'technology',
    },
  ];
}

function generateEdtechStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-b2b-institutional`,
      title: 'B2B Institutional Sales',
      description: 'Sell to schools and colleges for bulk licensing',
      projectedRevenue: Math.round(70 + baseRevenue * 15),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.15),
      category: 'growth',
    },
    {
      id: `${parentPath}-vernacular-content`,
      title: 'Vernacular Content',
      description: 'Launch content in Hindi and regional languages',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 20,
      burnoutDelta: 25,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.2),
      category: 'growth',
    },
    {
      id: `${parentPath}-gamification`,
      title: 'Gamification Features',
      description: 'Add points, badges, and leaderboards for engagement',
      projectedRevenue: Math.round(35 + baseRevenue * 7),
      riskDelta: 15,
      burnoutDelta: 15,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.12),
      category: 'technology',
    },
    {
      id: `${parentPath}-ai-tutoring`,
      title: 'AI Tutoring Assistant',
      description: 'Build AI-powered doubt solving and personalized learning',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 30,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.3),
      category: 'technology',
    },
    {
      id: `${parentPath}-placement-partnerships`,
      title: 'Placement Partnerships',
      description: 'Partner with companies for job placement guarantees',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 25,
      burnoutDelta: 15,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.1),
      category: 'partnerships',
    },
  ];
}

function generateCoachingStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-hybrid-model`,
      title: 'Hybrid Online-Offline Model',
      description: 'Combine in-person classes with online resources',
      projectedRevenue: Math.round(45 + baseRevenue * 9),
      riskDelta: 20,
      burnoutDelta: 20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.15),
      category: 'technology',
    },
    {
      id: `${parentPath}-test-series`,
      title: 'Mock Test Series',
      description: 'Launch subscription test series with detailed analytics',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 15,
      burnoutDelta: 15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.08),
      category: 'growth',
    },
    {
      id: `${parentPath}-faculty-expansion`,
      title: 'Star Faculty Hiring',
      description: 'Hire renowned faculty for premium batches',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.25),
      category: 'operations',
    },
    {
      id: `${parentPath}-center-expansion`,
      title: 'New Center Launch',
      description: `Open new center in nearby ${profile.location} area`,
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 35,
      burnoutDelta: 30,
      timelineDays: 120,
      cost: Math.round(profile.mrr * 0.4),
      category: 'growth',
    },
    {
      id: `${parentPath}-study-material`,
      title: 'Premium Study Material',
      description: 'Create and sell proprietary study material',
      projectedRevenue: Math.round(30 + baseRevenue * 6),
      riskDelta: 15,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.1),
      category: 'operations',
    },
  ];
}

function generateManufacturingStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-automation`,
      title: 'Production Automation',
      description: 'Implement automated machinery for higher output',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 35,
      burnoutDelta: -20,
      timelineDays: 120,
      cost: Math.round(profile.mrr * 0.5),
      category: 'technology',
    },
    {
      id: `${parentPath}-export-market`,
      title: 'Export Market Entry',
      description: 'Enter international markets with competitive pricing',
      projectedRevenue: Math.round(70 + baseRevenue * 15),
      riskDelta: 40,
      burnoutDelta: 25,
      timelineDays: 180,
      cost: Math.round(profile.mrr * 0.3),
      category: 'growth',
    },
    {
      id: `${parentPath}-supplier-consolidation`,
      title: 'Supplier Consolidation',
      description: 'Negotiate bulk deals with fewer suppliers',
      projectedRevenue: Math.round(25 + baseRevenue * 5),
      riskDelta: 20,
      burnoutDelta: 10,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.05),
      category: 'operations',
    },
    {
      id: `${parentPath}-quality-certification`,
      title: 'ISO/Quality Certification',
      description: 'Get certifications for premium market access',
      projectedRevenue: Math.round(35 + baseRevenue * 7),
      riskDelta: 15,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.15),
      category: 'operations',
    },
    {
      id: `${parentPath}-oem-partnerships`,
      title: 'OEM Partnerships',
      description: 'Become OEM supplier for larger brands',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 25,
      burnoutDelta: 15,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.1),
      category: 'partnerships',
    },
  ];
}

function generateLogisticsStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-fleet-expansion`,
      title: 'Fleet Expansion',
      description: 'Add vehicles to increase delivery capacity',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.4),
      category: 'operations',
    },
    {
      id: `${parentPath}-route-optimization`,
      title: 'AI Route Optimization',
      description: 'Implement software for efficient route planning',
      projectedRevenue: Math.round(30 + baseRevenue * 6),
      riskDelta: 15,
      burnoutDelta: -15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.1),
      category: 'technology',
    },
    {
      id: `${parentPath}-ecom-contracts`,
      title: 'E-commerce Contracts',
      description: 'Partner with D2C brands for last-mile delivery',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.08),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-cold-chain`,
      title: 'Cold Chain Capability',
      description: 'Add refrigerated vehicles for food/pharma',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 35,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.35),
      category: 'operations',
    },
    {
      id: `${parentPath}-warehouse-network`,
      title: 'Warehouse Network',
      description: 'Set up micro-warehouses in key locations',
      projectedRevenue: Math.round(45 + baseRevenue * 9),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.3),
      category: 'operations',
    },
  ];
}

function generateConsultingStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-retainer-model`,
      title: 'Retainer-Based Pricing',
      description: 'Convert project clients to monthly retainers',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 20,
      burnoutDelta: -15,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.05),
      category: 'growth',
    },
    {
      id: `${parentPath}-thought-leadership`,
      title: 'Thought Leadership',
      description: 'Publish research, speak at events, build authority',
      projectedRevenue: Math.round(35 + baseRevenue * 7),
      riskDelta: 15,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.08),
      category: 'marketing',
    },
    {
      id: `${parentPath}-productized-services`,
      title: 'Productized Services',
      description: 'Package common engagements as fixed-price products',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 20,
      burnoutDelta: -10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.1),
      category: 'operations',
    },
    {
      id: `${parentPath}-associate-network`,
      title: 'Associate Network',
      description: 'Build network of freelancers for scalable delivery',
      projectedRevenue: Math.round(45 + baseRevenue * 9),
      riskDelta: 25,
      burnoutDelta: -20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.06),
      category: 'operations',
    },
    {
      id: `${parentPath}-industry-focus`,
      title: 'Industry Specialization',
      description: 'Focus on 2-3 industries for deep expertise',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 25,
      burnoutDelta: 15,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.1),
      category: 'growth',
    },
  ];
}

function generateAgencyStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-performance-marketing`,
      title: 'Performance Marketing Focus',
      description: 'Shift to ROI-based performance campaigns',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.1),
      category: 'growth',
    },
    {
      id: `${parentPath}-white-label`,
      title: 'White Label Services',
      description: 'Offer services to other agencies as white label',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.05),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-saas-tools`,
      title: 'SaaS Tool Development',
      description: 'Build proprietary tools for recurring revenue',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 35,
      burnoutDelta: 30,
      timelineDays: 120,
      cost: Math.round(profile.mrr * 0.3),
      category: 'technology',
    },
    {
      id: `${parentPath}-startup-focus`,
      title: 'Startup Niche Focus',
      description: 'Specialize in funded startups for higher budgets',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.08),
      category: 'growth',
    },
    {
      id: `${parentPath}-content-studio`,
      title: 'In-House Content Studio',
      description: 'Build video/photo production capability',
      projectedRevenue: Math.round(45 + baseRevenue * 9),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.2),
      category: 'operations',
    },
  ];
}

function generateKiranaStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-whatsapp-ordering`,
      title: 'WhatsApp Order & Delivery',
      description: 'Set up WhatsApp Business for easy ordering and delivery',
      projectedRevenue: Math.round(35 + baseRevenue * 7),
      riskDelta: 10,
      burnoutDelta: 10,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.02),
      category: 'technology',
    },
    {
      id: `${parentPath}-inventory-app`,
      title: 'Digital Inventory Management',
      description: 'Use Khatabook/similar app for stock tracking',
      projectedRevenue: Math.round(20 + baseRevenue * 4),
      riskDelta: 10,
      burnoutDelta: -15,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.01),
      category: 'operations',
    },
    {
      id: `${parentPath}-private-label`,
      title: 'Private Label Products',
      description: 'Launch own brand for staples like atta, rice',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.15),
      category: 'growth',
    },
    {
      id: `${parentPath}-home-delivery`,
      title: 'Home Delivery Expansion',
      description: 'Hire delivery boys for wider radius coverage',
      projectedRevenue: Math.round(30 + baseRevenue * 6),
      riskDelta: 15,
      burnoutDelta: 15,
      timelineDays: 21,
      cost: Math.round(profile.mrr * 0.08),
      category: 'operations',
    },
    {
      id: `${parentPath}-bulk-buying`,
      title: 'Bulk Buying Club',
      description: 'Create group buying for better wholesale rates',
      projectedRevenue: Math.round(25 + baseRevenue * 5),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.03),
      category: 'partnerships',
    },
  ];
}

function generateRealEstateStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-virtual-tours`,
      title: 'Virtual Property Tours',
      description: 'Offer 3D virtual tours for remote buyers',
      projectedRevenue: Math.round(45 + baseRevenue * 9),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.1),
      category: 'technology',
    },
    {
      id: `${parentPath}-nri-focus`,
      title: 'NRI Customer Focus',
      description: 'Target NRIs with dedicated sales team',
      projectedRevenue: Math.round(70 + baseRevenue * 15),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.15),
      category: 'growth',
    },
    {
      id: `${parentPath}-channel-partners`,
      title: 'Channel Partner Network',
      description: 'Build network of brokers and agents',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.08),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-home-loans`,
      title: 'Home Loan DSA',
      description: 'Become DSA for banks to earn commissions',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.02),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-property-management`,
      title: 'Property Management Services',
      description: 'Manage rentals for passive income stream',
      projectedRevenue: Math.round(35 + baseRevenue * 7),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.05),
      category: 'growth',
    },
  ];
}

function generateFitnessStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-membership-tiers`,
      title: 'Tiered Membership Plans',
      description: 'Launch bronze/silver/gold memberships',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.03),
      category: 'growth',
    },
    {
      id: `${parentPath}-corporate-wellness`,
      title: 'Corporate Wellness Programs',
      description: 'Partner with companies for employee fitness',
      projectedRevenue: Math.round(60 + baseRevenue * 12),
      riskDelta: 20,
      burnoutDelta: 20,
      timelineDays: 45,
      cost: Math.round(profile.mrr * 0.08),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-personal-training`,
      title: 'Personal Training Packages',
      description: 'Upsell 1-on-1 training for premium pricing',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 15,
      burnoutDelta: 25,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.05),
      category: 'growth',
    },
    {
      id: `${parentPath}-online-fitness`,
      title: 'Online Fitness Classes',
      description: 'Launch virtual classes for wider reach',
      projectedRevenue: Math.round(35 + baseRevenue * 7),
      riskDelta: 20,
      burnoutDelta: 15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.1),
      category: 'technology',
    },
    {
      id: `${parentPath}-nutrition-services`,
      title: 'Nutrition Consulting',
      description: 'Add dietitian services for holistic fitness',
      projectedRevenue: Math.round(30 + baseRevenue * 6),
      riskDelta: 15,
      burnoutDelta: 15,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.08),
      category: 'growth',
    },
  ];
}

function generateWellnessStrategies(profile: BusinessProfile, parentPath: string): ExecutionOption[] {
  const baseRevenue = profile.mrr / 100000;

  return [
    {
      id: `${parentPath}-package-deals`,
      title: 'Wellness Package Deals',
      description: 'Create bundled services for higher value',
      projectedRevenue: Math.round(45 + baseRevenue * 9),
      riskDelta: 15,
      burnoutDelta: 10,
      timelineDays: 14,
      cost: Math.round(profile.mrr * 0.03),
      category: 'growth',
    },
    {
      id: `${parentPath}-hotel-partnerships`,
      title: 'Hotel & Resort Partnerships',
      description: 'Partner with hotels for spa services',
      projectedRevenue: Math.round(55 + baseRevenue * 11),
      riskDelta: 20,
      burnoutDelta: 20,
      timelineDays: 60,
      cost: Math.round(profile.mrr * 0.1),
      category: 'partnerships',
    },
    {
      id: `${parentPath}-product-line`,
      title: 'Wellness Product Line',
      description: 'Launch own line of oils, creams, and products',
      projectedRevenue: Math.round(40 + baseRevenue * 8),
      riskDelta: 30,
      burnoutDelta: 25,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.2),
      category: 'growth',
    },
    {
      id: `${parentPath}-membership-model`,
      title: 'Membership Model',
      description: 'Convert walk-ins to monthly members',
      projectedRevenue: Math.round(50 + baseRevenue * 10),
      riskDelta: 15,
      burnoutDelta: 5,
      timelineDays: 30,
      cost: Math.round(profile.mrr * 0.05),
      category: 'growth',
    },
    {
      id: `${parentPath}-therapist-training`,
      title: 'Therapist Training Academy',
      description: 'Train and certify new therapists for fees',
      projectedRevenue: Math.round(35 + baseRevenue * 7),
      riskDelta: 25,
      burnoutDelta: 20,
      timelineDays: 90,
      cost: Math.round(profile.mrr * 0.15),
      category: 'growth',
    },
  ];
}

/**
 * Main function to generate industry-specific execution options
 */
export function generateExecutionOptions(
  profile: BusinessProfile | null,
  parentPath: string
): ExecutionOption[] {
  if (!profile) {
    return generateGenericStrategies({
      id: 'default',
      name: 'Default Business',
      industry: 'generic',
      mrr: 100000,
      customers: 50,
      location: 'India',
      teamSize: 5,
      foundedDate: new Date(),
      growthTarget: 30,
      riskTolerance: 'medium',
      vibeMode: 'balanced'
    }, parentPath);
  }

  const industry = profile.industry.toLowerCase().trim();

  // Find matching strategy generator
  for (const [key, generator] of Object.entries(industryStrategies)) {
    if (industry.includes(key) || key.includes(industry)) {
      return generator(profile, parentPath);
    }
  }

  // Default to generic strategies
  return generateGenericStrategies(profile, parentPath);
}

/**
 * Get industry-specific decision path names
 */
export function getIndustryPaths(industry: string): { conservative: string; balanced: string; aggressive: string } {
  const lowercaseIndustry = industry.toLowerCase();

  const industryPaths: Record<string, { conservative: string; balanced: string; aggressive: string }> = {
    'food': {
      conservative: 'Operational Excellence',
      balanced: 'Market Expansion',
      aggressive: 'Multi-Location Growth',
    },
    'restaurant': {
      conservative: 'Menu Optimization',
      balanced: 'Delivery Expansion',
      aggressive: 'Franchise Model',
    },
    'saas': {
      conservative: 'Customer Retention Focus',
      balanced: 'Product-Led Growth',
      aggressive: 'Enterprise Sales Push',
    },
    'retail': {
      conservative: 'Store Optimization',
      balanced: 'Omnichannel Strategy',
      aggressive: 'Multi-Store Expansion',
    },
    'ecommerce': {
      conservative: 'Conversion Optimization',
      balanced: 'Marketplace Expansion',
      aggressive: 'D2C Brand Building',
    },
    'healthcare': {
      conservative: 'Service Quality Focus',
      balanced: 'Digital Health Integration',
      aggressive: 'Multi-Specialty Expansion',
    },
    'education': {
      conservative: 'Student Success Focus',
      balanced: 'Hybrid Learning Model',
      aggressive: 'Franchise/Multi-Center',
    },
    'fintech': {
      conservative: 'Compliance First',
      balanced: 'Product Diversification',
      aggressive: 'Market Domination',
    },
    'kirana': {
      conservative: 'Customer Loyalty',
      balanced: 'Digital Integration',
      aggressive: 'Chain Store Model',
    },
    'manufacturing': {
      conservative: 'Quality Certification',
      balanced: 'Automation Upgrade',
      aggressive: 'Export Market Entry',
    },
    'logistics': {
      conservative: 'Route Optimization',
      balanced: 'Fleet Expansion',
      aggressive: 'National Network Build',
    },
  };

  for (const [key, paths] of Object.entries(industryPaths)) {
    if (lowercaseIndustry.includes(key)) {
      return paths;
    }
  }

  // Default paths
  return {
    conservative: 'Conservative Path',
    balanced: 'Balanced Growth',
    aggressive: 'Aggressive Scaling',
  };
}
