import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

/**
 * EmptyState - A comprehensive, reusable empty state component
 *
 * Features:
 * - Multiple variants (default, search, error, empty, loading, success)
 * - Customizable icon, title, description, and action button
 * - Full theme support (light/dark mode)
 * - Responsive design (mobile/tablet/desktop)
 * - Consistent with design system (spacing, typography, colors)
 * - Accessible (ARIA labels, semantic HTML)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Custom icon to display (optional, uses variant default)
 * @param {string} props.title - Main title text
 * @param {string} props.description - Descriptive text below title
 * @param {Object} props.action - Action button config { label, onClick, variant, icon, size }
 * @param {string} props.variant - Visual variant: 'default' | 'search' | 'empty' | 'error' | 'success' | 'loading'
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} props.alignment - Content alignment: 'center' | 'left'
 * @param {Object} props.sx - Additional sx styles
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.testId - Test ID for testing
 * @param {boolean} props.fullWidth - Whether to take full width of container
 * @param {React.ReactNode} props.children - Custom content (overrides default structure)
 * @param {boolean} props.showDivider - Show divider above content
 * @param {string} props.variantColor - Custom variant color override
 * @returns {JSX.Element}
 */
function EmptyState({
  icon,
  title = "No data available",
  description = "There's nothing to show here yet.",
  action,
  variant = "default",
  size = "md",
  alignment = "center",
  sx,
  className,
  testId = "empty-state",
  fullWidth = true,
  children,
  showDivider = false,
  variantColor,
}) {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isDark = mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Responsive sizing
  const sizeConfig = {
    sm: { iconSize: isMobile ? 32 : 40, titleSize: "h6", descSize: "body2", padding: isMobile ? 2 : 3, minHeight: 120 },
    md: { iconSize: isMobile ? 40 : 56, titleSize: "h5", descSize: "body1", padding: isMobile ? 3 : 4, minHeight: 160 },
    lg: { iconSize: isMobile ? 48 : 72, titleSize: "h4", descSize: "body1", padding: isMobile ? 4 : 5, minHeight: 200 },
    xl: { iconSize: isMobile ? 56 : 96, titleSize: "h3", descSize: "h6", padding: isMobile ? 5 : 6, minHeight: 280 },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Theme-aware colors
  const colors = {
    default: {
      iconColor: isDark ? "#64748B" : "#94A3B8",
      titleColor: isDark ? "#F1F5F9" : "#0F172A",
      descColor: isDark ? "#94A3B8" : "#64748B",
      bgColor: isDark ? "#1E293B" : "#FAFBFD",
      borderColor: isDark ? "#334155" : "#D9E1F2",
    },
    search: {
      iconColor: isDark ? "#60A5FA" : "#2855D9",
      titleColor: isDark ? "#F1F5F9" : "#0F172A",
      descColor: isDark ? "#94A3B8" : "#64748B",
      bgColor: isDark ? "#1A2A4A" : "#EEF4FF",
      borderColor: isDark ? "#2A3A5A" : "#D6E4FF",
    },
    empty: {
      iconColor: isDark ? "#64748B" : "#94A3B8",
      titleColor: isDark ? "#F1F5F9" : "#0F172A",
      descColor: isDark ? "#94A3B8" : "#64748B",
      bgColor: isDark ? "#1E293B" : "#FAFBFD",
      borderColor: isDark ? "#334155" : "#D9E1F2",
    },
    error: {
      iconColor: isDark ? "#F87171" : "#EF4444",
      titleColor: isDark ? "#F1F5F9" : "#0F172A",
      descColor: isDark ? "#FCA5A5" : "#EF4444",
      bgColor: isDark ? "#2A1A1A" : "#FFEBEE",
      borderColor: isDark ? "#4A1A1A" : "#FFCDD2",
    },
    success: {
      iconColor: isDark ? "#34D399" : "#10B981",
      titleColor: isDark ? "#F1F5F9" : "#0F172A",
      descColor: isDark ? "#6EE7B7" : "#10B981",
      bgColor: isDark ? "#1A2A1A" : "#ECFDF5",
      borderColor: isDark ? "#1A3A1A" : "#D1FAE5",
    },
    loading: {
      iconColor: isDark ? "#60A5FA" : "#2855D9",
      titleColor: isDark ? "#F1F5F9" : "#0F172A",
      descColor: isDark ? "#94A3B8" : "#64748B",
      bgColor: isDark ? "#1E293B" : "#FAFBFD",
      borderColor: isDark ? "#334155" : "#D9E1F2",
    },
  };

  const variantColors = variantColor ? { ...colors.default, iconColor: variantColor } : colors[variant] || colors.default;

  // Default icons per variant
  const defaultIcons = {
    default: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: config.iconSize, height: config.iconSize }}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
    search: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: config.iconSize, height: config.iconSize }}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
    empty: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: config.iconSize, height: config.iconSize }}
        aria-hidden="true"
      >
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    error: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: config.iconSize, height: config.iconSize }}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    success: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: config.iconSize, height: config.iconSize }}
        aria-hidden="true"
      >
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    loading: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ width: config.iconSize, height: config.iconSize, animation: "spin 1s linear infinite" }}
        aria-hidden="true"
      >
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
      </svg>
    ),
  };

  const DisplayIcon = icon || defaultIcons[variant] || defaultIcons.default;

  // Build action button if provided
  const ActionButton = action ? (
    <Button
      variant={action.variant || "contained"}
      size={action.size || (isMobile ? "small" : "medium")}
      onClick={action.onClick}
      startIcon={action.icon}
      endIcon={action.endIcon}
      disabled={action.disabled}
      sx={{
        mt: 2.5,
        borderRadius: 3,
        textTransform: "none",
        fontWeight: 700,
        px: 3,
        py: 1.25,
        ...action.sx,
      }}
      aria-label={action.ariaLabel || action.label}
    >
      {action.label}
    </Button>
  ) : null;

  // Custom content overrides default structure
  if (children) {
    return (
      <Box
        data-testid={testId}
        className={className}
        sx={{
          width: fullWidth ? "100%" : "auto",
          minHeight: config.minHeight,
          display: "flex",
          flexDirection: "column",
          alignItems: alignment === "center" ? "center" : "flex-start",
          justifyContent: "center",
          textAlign: alignment,
          p: config.padding,
          borderRadius: 3,
          border: `1px dashed ${variantColors.borderColor}`,
          bgcolor: variantColors.bgColor,
          ...sx,
        }}
        role="status"
        aria-live="polite"
      >
        {showDivider && <Divider sx={{ mb: 3, width: "100%", borderColor: variantColors.borderColor }} />}
        {children}
      </Box>
    );
  }

  return (
    <Paper
      data-testid={testId}
      className={className}
      elevation={0}
      sx={{
        width: fullWidth ? "100%" : "auto",
        minHeight: config.minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: alignment === "center" ? "center" : "flex-start",
        justifyContent: "center",
        textAlign: alignment,
        p: config.padding,
        borderRadius: 3,
        border: `1px dashed ${variantColors.borderColor}`,
        bgcolor: variantColors.bgColor,
        ...sx,
      }}
      role="status"
      aria-live="polite"
    >
      {showDivider && <Divider sx={{ mb: 3, width: "100%", borderColor: variantColors.borderColor }} />}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: alignment === "center" ? "center" : "flex-start",
          width: "100%",
          maxWidth: size === "xl" ? 480 : size === "lg" ? 400 : "100%",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            color: variantColors.iconColor,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: alignment === "center" ? "center" : "flex-start",
            width: "100%",
          }}
          aria-hidden="true"
        >
          {typeof DisplayIcon === "function" ? DisplayIcon() : DisplayIcon}
        </Box>

        {/* Title */}
        <Typography
          variant={config.titleSize}
          fontWeight={700}
          color={variantColors.titleColor}
          sx={{
            mb: 1,
            width: "100%",
            textAlign: alignment,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            variant={config.descSize}
            color={variantColors.descColor}
            sx={{
              width: "100%",
              textAlign: alignment,
              lineHeight: 1.6,
              maxWidth: "100%",
            }}
          >
            {description}
          </Typography>
        )}

        {/* Action Button */}
        {ActionButton && (
          <Box
            sx={{
              mt: 2.5,
              width: "100%",
              display: "flex",
              justifyContent: alignment === "center" ? "center" : "flex-start",
            }}
          >
            {ActionButton}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

// =============================================================================
// Pre-configured EmptyState Variants (Convenience Components)
// =============================================================================

/**
 * EmptyState.Search - For search with no results
 */
EmptyState.Search = function EmptyStateSearch({
  searchTerm,
  onClearSearch,
  onNewSearch,
  title = "No results found",
  description,
  ...props
}) {
  const defaultDescription = searchTerm
    ? `No matches found for "${searchTerm}". Try a different search term.`
    : "Enter a search term to find results.";

  return (
    <EmptyState
      variant="search"
      title={title}
      description={description || defaultDescription}
      action={onClearSearch ? { label: "Clear search", onClick: onClearSearch, variant: "outlined" } : onNewSearch ? { label: "New search", onClick: onNewSearch } : undefined}
      {...props}
    />
  );
};

/**
 * EmptyState.Empty - For empty lists/tables with no data
 */
EmptyState.Empty = function EmptyStateEmpty({
  title = "No data available",
  description = "There are no items to display yet.",
  action,
  ...props
}) {
  return (
    <EmptyState
      variant="empty"
      title={title}
      description={description}
      action={action}
      {...props}
    />
  );
};

/**
 * EmptyState.Error - For error states with retry action
 */
EmptyState.Error = function EmptyStateError({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try again",
  ...props
}) {
  return (
    <EmptyState
      variant="error"
      title={title}
      description={description}
      action={onRetry ? { label: retryLabel, onClick: onRetry, variant: "contained", color: "error" } : undefined}
      {...props}
    />
  );
};

/**
 * EmptyState.Loading - For loading states (skeleton alternative)
 */
EmptyState.Loading = function EmptyStateLoading({
  title = "Loading...",
  description = "Please wait while we fetch the data.",
  ...props
}) {
  return (
    <EmptyState
      variant="loading"
      title={title}
      description={description}
      {...props}
    />
  );
};

/**
 * EmptyState.Success - For success/completion states
 */
EmptyState.Success = function EmptyStateSuccess({
  title = "All done!",
  description = "There's nothing more to show right now.",
  action,
  ...props
}) {
  return (
    <EmptyState
      variant="success"
      title={title}
      description={description}
      action={action}
      {...props}
    />
  );
};

/**
 * EmptyState.NoData - For tables/lists with no data and optional CTA
 */
EmptyState.NoData = function EmptyStateNoData({
  title = "No records found",
  description = "Get started by adding your first item.",
  action,
  icon,
  size = "md",
  ...props
}) {
  return (
    <EmptyState
      variant="empty"
      icon={icon}
      title={title}
      description={description}
      action={action}
      size={size}
      {...props}
    />
  );
};

/**
 * EmptyState.NoResults - For filtered/search results with no matches
 */
EmptyState.NoResults = function EmptyStateNoResults({
  searchTerm,
  title = "No matching results",
  description,
  onClearFilters,
  clearLabel = "Clear filters",
  ...props
}) {
  const defaultDescription = searchTerm
    ? `No results match "${searchTerm}". Try adjusting your search or filters.`
    : "No results match your current filters.";

  return (
    <EmptyState
      variant="search"
      title={title}
      description={description || defaultDescription}
      action={onClearFilters ? { label: clearLabel, onClick: onClearFilters, variant: "outlined" } : undefined}
      {...props}
    />
  );
};

export default EmptyState;