# SecondBrain — Frontend

Live at [secondbrain.notaditya.dev](https://secondbrain.notaditya.dev)

SecondBrain is a web application for saving, organizing, and querying personal links. This repository contains the frontend; the API lives in [secondbrain-be](https://github.com/git-push-aditya/secondbrain-be).

## Features

- Save links into collections, tagged and searchable
- Ask questions against your own saved content, answered from embeddings of the pages you saved
- Share a collection through a public link, or revoke it
- Pool links with other users in a shared community
- Responsive across mobile and desktop

## Tech stack

- React with TypeScript, built by Vite
- Tailwind CSS for styling
- React Router for routing
- TanStack Query for server state, caching, and pagination
- Recoil for client state
- Framer Motion and react-three-fiber for the landing page visuals

## Running locally

Requires Node 18 or newer.

```bash
npm install
npm run dev
```

The app expects a running backend. Point it at one with a `.env` file in the project root:

```
VITE_BASE_URL='http://localhost:2233'
```

This is read at build time, not at runtime, so a deployed build has the URL baked in — changing it means rebuilding.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server, exposed on the local network via `--host` |
| `npm run build` | Typecheck with `tsc -b`, then produce a production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |

## Contact

[adityadubey0034@gmail.com](mailto:adityadubey0034@gmail.com)
