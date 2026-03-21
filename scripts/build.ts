import { Glob } from "bun";
import bunPluginTailwind from "bun-plugin-tailwind";

Bun.build({
  entrypoints: [...new Glob("src/public/**/*").scanSync()],
  outdir: "public/",
  plugins: [bunPluginTailwind],
  naming: {
    asset: "[name].[ext]",
  },
});
