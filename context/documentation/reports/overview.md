# Reports Feature Overview

## Purpose

This document captures feature-level documentation for the reports work currently being planned.

## Goal

Build a reports experience where:

- the marketplace is chosen from the subheader dropdown
- available report tabs are driven by the report-config API
- no report tab is selected by default
- selecting a tab updates the URL
- sharing the URL reopens the same report for a logged-in user on the same account

## Proposed URL Contract

- Reports picker: `/reports/power-bi/:marketplace`
- Selected report: `/reports/:marketplace/view/:reportConfigId`

## Planned Behavior

- Marketplace changes should update the route
- Report tabs should only show active configs available for the selected marketplace
- When no tab is selected, the page should show a prompt instead of a report
- When a valid report-config id is selected, the matching Power BI report should load

## Dependencies

- account-aware report-config API
- marketplace subheader pattern
- existing Power BI report rendering behavior

## Current State

- Planning only
- Waiting for review before implementation
