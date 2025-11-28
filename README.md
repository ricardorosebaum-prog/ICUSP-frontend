# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cbc8bd91-c4bc-465b-a8d0-4cecaf1b25fb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cbc8bd91-c4bc-465b-a8d0-4cecaf1b25fb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Setup After Cloning

When you clone this repository, you need to install dependencies:

```sh
npm install
```

Then start the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cbc8bd91-c4bc-465b-a8d0-4cecaf1b25fb) and click on Share -> Publish.

## Deploy to Render

This project can be deployed as a static site on Render. **Render automatically runs `npm install` before building**, so all dependencies will be installed.

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file is already configured. Simply:

1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) and create a new **Static Site**.
3. Connect your GitHub repository.
4. Render will automatically read `render.yaml` and use the configuration:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment variables from `render.yaml` will be applied.
5. Deploy! The site will be available at the Render-assigned URL.

### Option 2: Manual Configuration

If you prefer manual setup:

1. In the Render dashboard, create a new **Static Site**.
2. Connect your GitHub repo.
3. Set:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL` = `https://icuspbackend.onrender.com` (or your API URL)
4. Deploy.

### How it works

- Render automatically runs `npm install` to install all dependencies from `package.json`.
- Then it runs `npm run build` (which is `vite build`) to generate the `dist` folder.
- The `dist` folder is served as a static site.
- The frontend reads `VITE_API_BASE_URL` from the environment variable at build time.

### Environment Variables

The frontend reads the API base URL from `import.meta.env.VITE_API_BASE_URL`. For local development, you can create a `.env` file:

```
VITE_API_BASE_URL=https://icuspbackend.onrender.com
```

Or set it when running the build locally:
```sh
VITE_API_BASE_URL=https://icuspbackend.onrender.com npm run build
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
