import {defineConfig,globalIgnores} from 'eslint/config';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
export default defineConfig([
 ...tseslint.configs.recommended,
 {files:['**/*.{ts,tsx}'],plugins:{'react-hooks':hooks,'jsx-a11y':a11y},rules:{'react-hooks/rules-of-hooks':'error','react-hooks/exhaustive-deps':'error',...a11y.configs.recommended.rules}},
 globalIgnores(['node_modules/**','.next/**','out/**','dist/**','public/**','references/**','next-env.d.ts'])
]);
