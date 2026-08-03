/**
 * ============================================================
 * Global Layout Configuration
 * AI-First CRM HCP
 * ============================================================
 *
 * This file centralizes spacing, widths, border radius,
 * and responsive layout values used across the application.
 *
 * Any page can import these constants to keep a
 * consistent production-ready UI.
 */

export const layout = {
  /**
   * Sidebar width
   */
  drawerWidth: 280,

  /**
   * Header height
   */
  headerHeight: 72,

  /**
   * Main page container
   */
  page: {
    width: "100%",
    maxWidth: "100%",

    paddingX: {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 5,
      xl: 6,
    },

    paddingY: {
      xs: 2,
      sm: 3,
      md: 4,
    },
  },

  /**
   * Grid spacing
   */
  gridSpacing: {
    xs: 2,
    sm: 3,
    md: 3,
    lg: 4,
  },

  /**
   * Vertical spacing between sections
   */
  sectionSpacing: 4,

  /**
   * Card Defaults
   */
  card: {
    radius: 4,

    padding: {
      xs: 2,
      sm: 3,
      md: 3.5,
      lg: 4,
    },

    shadow: 2,

    hoverShadow: 8,

    minHeight: {
      metrics: 170,
      analytics: 450,
      search: 380,
      history: 450,
    },
  },

  /**
   * Hero Banner
   */
  hero: {
    radius: 5,

    paddingX: {
      xs: 3,
      md: 5,
    },

    paddingY: {
      xs: 4,
      md: 5,
    },
  },

  /**
   * Dashboard Charts
   */
  chart: {
    height: 360,
  },

  /**
   * Tables
   */
  table: {
    minHeight: 420,
  },

  /**
   * Buttons
   */
  button: {
    borderRadius: 3,
    height: 44,
  },

  /**
   * Animation
   */
  animation: {
    transition: "all .25s ease",
    hoverTransform: "translateY(-4px)",
  },
};

/**
 * ============================================================
 * Shared sx helpers
 * ============================================================
 */

export const commonCardSx = {
  borderRadius: layout.card.radius,

  boxShadow: layout.card.shadow,

  transition: layout.animation.transition,

  "&:hover": {
    transform: layout.animation.hoverTransform,
    boxShadow: layout.card.hoverShadow,
  },
};

export const pageContainerSx = {
  width: layout.page.width,

  maxWidth: layout.page.maxWidth,

  px: layout.page.paddingX,

  py: layout.page.paddingY,
};

export const sectionSpacingSx = {
  mb: layout.sectionSpacing,
};

export default layout;