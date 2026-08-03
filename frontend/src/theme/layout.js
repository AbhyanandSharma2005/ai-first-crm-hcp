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
   * Sidebar width - increased from 264 to 280 for better professionalism
   */
  drawerWidth: 280,

  /**
   * Header height - increased from 64 to 72 for more breathing room
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

/**
 * ============================================================
 * Main Content Container Sx
 * ============================================================
 * 
 * This is the CORRECT sx for the main content area.
 * The sidebar already occupies space via the Drawer component,
 * so we don't need to subtract it again with calc() or ml.
 */
export const mainContentSx = {
  flexGrow: 1,
  width: "100%",
  minWidth: 0,

  p: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
  },

  overflowX: "hidden",

  // The backgroundColor will be set by the theme
  // backgroundColor: theme.palette.background.default
};

export default layout;