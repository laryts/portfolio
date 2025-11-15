# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### components/header.tsx

- **mobile_menu_toggled**: Fired when the user opens or closes the mobile navigation menu.
- **theme_toggled**: Fired when the user switches between light and dark mode.
- **navigation_link_clicked**: Fired when a user clicks on a navigation link in the header.

### components/language-switcher.tsx

- **language-switcher-toggled**: User toggles the language switcher dropdown open or closed.
- **language-changed**: User selects a new language from the language switcher.

### components/sections/contact.tsx

- **contact-form-submitted**: Fired when a user successfully submits the contact form.
- **contact-form-submission-failed**: Fired when the contact form submission fails after a user submits it.
- **resume-downloaded**: Fired when a user clicks the button to download the resume PDF.
- **contact-link-clicked**: Fired when a user clicks on a social or email link in the contact section.

### components/github-contributions-chart.tsx

- **github-contributions-loaded**: Fired when GitHub contributions are successfully fetched for a user.
- **github-contributions-load-failed**: Fired when fetching GitHub contributions fails.

### components/theme-provider.tsx

- **theme_changed**: Fired when the user changes the application's color theme (e.g., from light to dark).


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
