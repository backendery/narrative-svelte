import adapterVercel from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
  compilerOptions: {
    runes: true,
  },
  kit: { adapter: adapterVercel(), alias: { $lib: 'src/lib' } },
  preprocess: vitePreprocess(),
}

export default config
