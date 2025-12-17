/**
 * React Query 키 상수 관리
 * 계층적 구조로 관리하여 타입 안정성과 일관성 유지
 */

export const queryKeys = {
  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    stats: (campaignIds: string[]) =>
      ["dashboard", "stats", campaignIds] as const,
    clickCounts: (campaignIds: string[]) =>
      ["dashboard", "clickCounts", campaignIds] as const,
  },

  // Campaigns
  campaigns: {
    all: ["campaigns"] as const,
    lists: () => ["campaigns", "list"] as const,
    list: (filters: {
      q?: string;
      c1?: string;
      c2?: string;
    }, userId?: string | null) => ["campaigns", "list", filters, userId] as const,
    details: () => ["campaigns", "detail"] as const,
    detail: (id: string) => ["campaigns", "detail", id] as const,
    stats: (id: string) => ["campaigns", id, "stats"] as const,
    creators: (id: string) => ["campaigns", id, "creators"] as const,
  },

  // Creator Campaigns
  creatorCampaigns: {
    all: ["creatorCampaigns"] as const,
    myCampaigns: () => ["creatorCampaigns", "my"] as const,
    clickCounts: (creatorId: string) =>
      ["creatorCampaigns", "clicks", creatorId] as const,
  },

  // Shop
  shop: {
    all: ["shop"] as const,
    myShop: (creatorId: string) => ["shop", "my", creatorId] as const,
  },

  // Categories
  categories: {
    all: () => ["categories", "all"] as const,
    list: () => ["categories", "list"] as const,
  },

  // Applications
  applications: {
    all: ["applications"] as const,
    pending: (advertiserId: string) =>
      ["applications", "pending", advertiserId] as const,
    myApplications: (creatorId: string) =>
      ["applications", "my", creatorId] as const,
  },

  // Advertiser
  advertiser: {
    all: ["advertiser"] as const,
    campaigns: (advertiserId: string) =>
      ["advertiser", "campaigns", advertiserId] as const,
    applications: (advertiserId: string) =>
      ["advertiser", "applications", advertiserId] as const,
  },

  // Auth
  auth: {
    user: () => ["auth", "user"] as const,
    profile: () => ["auth", "profile"] as const,
  },
} as const;

