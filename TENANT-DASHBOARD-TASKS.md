# Tenant Dashboard Creation Tasks

**Goal:** Create the Tenant Dashboard page (`src/pages/tenant/TenantDashboard.jsx`) with key functionalities and apply the new brand theme.

---

## Phase 1: Initial Setup & Layout

1.  **Create Directory:**
    *   **Action:** Create the directory `src/pages/tenant/`.
    *   **Action:** Create the directory `src/components/tenant/` for sub-components.

2.  **Create `TenantDashboard.jsx`:**
    *   **Action:** Create the file `src/pages/tenant/TenantDashboard.jsx`.
    *   **Details:**
        *   Import `React` and necessary hooks.
        *   Import `DashboardLayout` from `src/components/layouts/`.
        *   Set up the basic component structure wrapped in `DashboardLayout`.
        *   Apply theme background colors to the main content area.
        *   Add a placeholder heading (e.g., "Tenant Dashboard").

3.  **Add Routing:**
    *   **Action:** Modify `src/App.js`.
    *   **Details:**
        *   Add a `Route` within the `PrivateRoute` section for the path `/tenant/dashboard` (or adjust if paths are different).
        *   Ensure this route renders the `TenantDashboard` component.
        *   Verify role-based redirection logic directs logged-in tenants to this route.

---

## Phase 2: Core Content Sections

1.  **Lease & Rent Information Card:**
    *   **Action:** Create a new component `src/components/tenant/LeaseInfoCard.jsx`.
    *   **Details:**
        *   Display mock data for: Next Rent Due Date, Rent Amount, Lease End Date.
        *   Use appropriate icons (e.g., Calendar, Dollar Sign).
        *   Apply theme colors for card background, text, icons (`StatCard` component from landlord dashboard could be adapted or reused).
    *   **Action:** Import and render `LeaseInfoCard` in `TenantDashboard.jsx`.

2.  **Maintenance Requests Section:**
    *   **Action:** Add state for mock maintenance requests in `TenantDashboard.jsx` (similar to landlord/preview data).
    *   **Action:** Create `src/components/tenant/TenantMaintenanceRequestCard.jsx`.
        *   **Details:** Display request description, status, submitted date. Adapt styles from `MaintenanceRequestCard` using theme colors. Include a "View Details" button (using `<Button variant="outline">`).
    *   **Action:** Render the list of `TenantMaintenanceRequestCard` components in `TenantDashboard.jsx`.
    *   **Action:** Add a "Submit New Request" button (`<Button variant="primary">`) below the list.

3.  **Quick Links / Actions:**
    *   **Action:** Add a section in `TenantDashboard.jsx` for common tenant actions.
    *   **Details:** Include placeholder links/buttons (e.g., "Contact Landlord", "View Lease Document", "Payment History") using the `<Button variant="ghost">` or `<a>` tags styled appropriately.

---

## Phase 3: Styling & Polish

1.  **Apply Theme Consistently:**
    *   **Action:** Review all created components (`TenantDashboard.jsx`, `LeaseInfoCard.jsx`, `TenantMaintenanceRequestCard.jsx`).
    *   **Details:** Ensure all backgrounds, text, borders, icons, buttons, and interactive states use the semantic colors from `tailwind.config.js` and respect dark mode.

2.  **Layout & Responsiveness:**
    *   **Action:** Arrange sections within `TenantDashboard.jsx` using Grid or Flexbox.
    *   **Details:** Ensure the layout adapts well to different screen sizes.

3.  **Accessibility:**
    *   **Action:** Review semantic structure, focus order, and contrast.
    *   **Details:** Add ARIA attributes where necessary (e.g., labelling sections).

---

**Notes:**
- Mock data is sufficient for now. Integration with backend data comes later.
- Focus on structure, basic functionality, and applying the new theme. 