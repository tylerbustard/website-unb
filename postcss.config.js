import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

// Tailwind creates declarations for arbitrary utilities with no source input.
// Preserve the root stylesheet source so Vite can resolve any CSS URLs without
// emitting its missing-`from` warning or guessing an importer.
const preserveGeneratedDeclarationSource = {
  postcssPlugin: "preserve-generated-declaration-source",
  Once(root) {
    if (!root.source?.input?.file) return;
    root.walkDecls((declaration) => {
      if (!declaration.source?.input?.file) declaration.source = root.source;
    });
  },
};

export default {
  plugins: [tailwindcss(), autoprefixer(), preserveGeneratedDeclarationSource],
};
