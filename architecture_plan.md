Charis Consult: Architecture & Management Plan (Synchronized)

This document is synchronized with the existing src/ directory structure and the 001_initial_schema.sql migration.

1. Technical Baseline

Root Directory: src/

Database: Supabase (Schema 001 implemented)

Auth: Supabase SSR with Middleware role-gating.

Roles: admin, agent, client.

2. Directory Structure (Actual)

src/app/(site): Public pages (Real Estate, Travels, Construction).

src/app/(auth): Login/Register flows.

src/app/(admin)/admin: Full business management (Properties, Agents, Travel Apps).

src/app/dashboard: Client portal.

src/app/agent: Agent portal (Inventory & Bio).

src/lib/supabase: Server, Client, and Middleware helpers.

3. Database Schema Reference

The system utilizes the following tables from 001_initial_schema.sql:

profiles: Core user data & roles.

agent_profiles: Verification status & onboarding details.

properties: Real estate inventory.

travel_applications: Visa & mobility tracking.

application_stage_history: Timeline tracking for travel clients.

4. Admin Management Goals (UI-Based)

To ensure the owner can manage everything without code:

Admin Properties: /admin/properties - List/Create/Edit all listings.

Admin Travel: /admin/travel - Manage visas and update stage history.

Admin Agents: /admin/agents - Verify and approve new sign-ups.

5. Implementation Rules

Always use await createClient() from src/lib/supabase/server.ts for data fetching.

Use Server Actions for all form submissions to maintain security.

Follow the "Brighter/Lighter" design (bg-slate-50, rounded-xl) across all portals.