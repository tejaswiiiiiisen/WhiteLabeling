export interface TenantBrandingConfig {
  organizationId?: string;
  companyName: string;
  legalName?: string;
  tagline?: string;
  subdomain?: string;
  customDomain?: string;
  logoUrl?: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
  loginBannerUrl?: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  sidebarBg?: string;
  textColor?: string;
  fontFamily?: string;
  metaTitle?: string;
  metaDescription?: string;
  supportEmail?: string;
  supportPhone?: string;
  copyrightText?: string;
  isWhitelabelActive?: boolean;
  customCss?: string;
}

export interface WhitelabelContextType {
  branding: TenantBrandingConfig;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
  updateBranding: (updated: Partial<TenantBrandingConfig>) => Promise<boolean>;
  uploadAsset: (file: File, assetType: 'logo' | 'darkLogo' | 'favicon' | 'loginBanner') => Promise<string | null>;
}
