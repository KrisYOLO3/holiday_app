# Holiday Explorer
Holiday Explorer is a sleek React application that allows users to discover public holidays across different countries. It dynamically fetches global country data and filters upcoming holidays for the current year using the OpenHolidays API

# Features

Dynamic Country Selection: Fetches a real-time list of countries and allows users to switch between them via a searchable dropdown.

Next Holiday Spotlight: Automatically calculates and highlights the very next upcoming holiday based on the current date.

Annual Holiday List: Displays a comprehensive, formatted list of all public holidays for the selected country for the current calendar year.

Smart Data Fetching:

Uses AbortController to prevent memory leaks and handle "race conditions" during rapid country switching.

Implements Loading states for better User Experience.

Localized Date Formatting: Utilizes the Intl.DateTimeFormat API for clean, readable date presentation.

# Tech Stack
Framework: React (Functional Components, Hooks)

Language: TypeScript (Custom Types for API responses)

API: OpenHolidays API

State Management: React useState & useEffect

Async Logic: Async/Await with fetch and cleanup functions