# New UI for Audiobookshelf

This is a custom dark, modern UI for Audiobookshelf running at `new.rhonda.onl`.

## Features

- Dark modern theme
- Clean, simple interface
- Mobile-friendly responsive design
- Direct API integration with Audiobookshelf backend

## Structure

- `index.html` - Main HTML structure
- `styles.css` - Dark modern styling
- `api.js` - Audiobookshelf API client
- `app.js` - Main application logic

## Development

The UI is served by nginx in the `new-ui` container. To make changes:

1. Edit files in `./ui/` directory
2. Changes are live immediately (volume mount)
3. No rebuild needed for static file changes

## API Integration

The UI calls the Audiobookshelf API at `rhonda.onl/api/*`. Since both are served through the same Caddy proxy, there are no CORS issues.

## Removing This UI

If you want to remove this UI:

1. Remove the `new-ui` service from `docker-compose.prod.yml`
2. Remove the `new.rhonda.onl` block from `Caddyfile`
3. Restart: `docker compose -f docker-compose.prod.yml up -d`
4. Delete the `ui/` directory if desired

