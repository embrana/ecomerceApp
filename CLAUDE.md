# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Run dev server: `npm run start` (webpack-dev-server on port 3000)
- Production build: `npm run build`

## Lint Commands
- Run ESLint: `npx eslint src/**/*.js`
- Python style check: `pycodestyle src/`

## Code Style Guidelines
- JavaScript: Use semicolons, no trailing commas, React prop types required
- Python: Ignore E501 (line length) and E302 (expected 2 blank lines)
- React components: Capitalize component names, use .js extension
- Imports: Group React/libraries first, then local imports
- Error handling: Use try/catch blocks for async operations

## Repository Structure
- `/src/api`: Backend Python API with Flask
- `/src/front/js`: Frontend React components and pages
- `/migrations`: Database migrations with Alembic