const mongoose = require('mongoose');

const ElementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['heading', 'paragraph', 'button', 'image', 'icon', 'card', 'badge', 'navLinks', 'accordion', 'form', 'container'],
      required: true,
    },
    content: { type: String, default: '' },
    props: { type: mongoose.Schema.Types.Mixed, default: {} },
    styles: { type: mongoose.Schema.Types.Mixed, default: {} },
    hidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['navbar', 'hero', 'features', 'services', 'cards', 'testimonials', 'pricing', 'faq', 'cta', 'footer', 'custom'],
      required: true,
    },
    name: { type: String, default: 'Section' },
    hidden: { type: Boolean, default: false },
    styles: { type: mongoose.Schema.Types.Mixed, default: {} },
    elements: [ElementSchema],
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    pageId: { type: String, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    sections: [SectionSchema],
  },
  { _id: false }
);

const ClonedWebsiteSchema = new mongoose.Schema(
  {
    tenantId: { type: String, default: 'default', index: true },
    name: { type: String, required: true, trim: true },
    sourceUrl: { type: String, default: '', trim: true },
    subdomain: { type: String, unique: true, sparse: true, trim: true },
    customDomain: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['draft', 'imported', 'published', 'archived'],
      default: 'draft',
    },
    theme: {
      primaryColor: { type: String, default: '#3B82F6' },
      secondaryColor: { type: String, default: '#1D4ED8' },
      accentColor: { type: String, default: '#10B981' },
      backgroundColor: { type: String, default: '#090D16' },
      textColor: { type: String, default: '#F8FAFC' },
      fontFamily: { type: String, default: 'Inter' },
      borderRadius: { type: String, default: '12px' },
    },
    pages: [PageSchema],
    publishedAt: { type: Date },
    publishedHtml: { type: String, default: '' },
    importStats: {
      elementsCount: { type: Number, default: 0 },
      sectionsCount: { type: Number, default: 0 },
      pagesCount: { type: Number, default: 1 },
      colorsDetected: [String],
      fontsDetected: [String],
      importedAt: { type: Date, default: Date.now },
    },
    similarityReport: {
      overallScore: { type: Number, default: 95 },
      layoutScore: { type: Number, default: 94 },
      typographyScore: { type: Number, default: 96 },
      colorScore: { type: Number, default: 98 },
      interactiveScore: { type: Number, default: 92 },
      discrepancies: [String],
      limitations: [String],
      testedAt: { type: Date, default: Date.now },
    },
    discoveredPages: [
      {
        pageId: String,
        name: String,
        path: String,
        selected: { type: Boolean, default: true },
      },
    ],
    versionHistory: [
      {
        versionNumber: { type: Number, default: 1 },
        savedAt: { type: Date, default: Date.now },
        summary: String,
      },
    ],
    securityAudit: {
      checkedAt: { type: Date, default: Date.now },
      isSsl: { type: Boolean, default: true },
      ssrfPassed: { type: Boolean, default: true },
      sanitized: { type: Boolean, default: true },
      clientIp: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.ClonedWebsite || mongoose.model('ClonedWebsite', ClonedWebsiteSchema);
