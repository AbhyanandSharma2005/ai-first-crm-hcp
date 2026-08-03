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
 * IMPORTANT: Sidebar.jsx uses MUI <Drawer variant="permanent">.
 * That variant renders TWO things:
 *   1. A root element that sits normally in the flex flow and
 *      reserves `drawerWidth` of space (this is what pushes
 *      siblings over) — controlled via `width` + `flexShrink: 0`
 *      on the Drawer root.
 *   2. The visible `.MuiDrawer-paper`, which is separately
 *      styled with `position: fixed` so it stays pinned while
 *      scrolling.
 *
 * Because the Drawer root ALREADY reserves `drawerWidth` in the
 * flex layout, `main` (as a flex sibling in Layout.jsx) only
 * needs `flexGrow: 1` to correctly fill the remaining space.
 *
 * Previously this object also added `ml: drawerWidth` and
 * `width: calc(100% - drawerWidth)` on top of that — which
 * double-subtracted the sidebar width and pushed content off
 * to the right, where it got silently clipped by the parent
 * Box's `overflow: hidden` in Layout.jsx. That's what caused
 * the "narrow column with a big empty gutter" bug.
 *
 * Do NOT reintroduce `ml` or a `calc(100% - drawerWidth)` width
 * here — flexGrow + width: "100%" is correct given the sibling
 * Drawer already reserves its own space.
 */
export const mainContentSx = {
  flexGrow: 1,
  minHeight: "100vh",
  minWidth: 0,

  // Content takes full width of whatever space remains
  // after the Sidebar's flex-reserved width.
  width: "100%",

  // Padding for content
  p: {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
  },

  overflowX: "hidden",
  overflowY: "auto",

  // The backgroundColor will be set by the theme
  // backgroundColor: theme.palette.background.default
};

export default layout;