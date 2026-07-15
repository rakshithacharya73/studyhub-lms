import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'studyhub-lms'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS === 'true' ? `/${repoName}/` : '/',
})
