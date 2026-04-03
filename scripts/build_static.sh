set -e
mkdir -p public/vendor
cp -r src/public/vendor public
cp src/public/icon.png public/icon.png
if [[ -v WATCH ]]; then
  bun build src/public/wordlerds.ts --outdir public/ --watch
else
  bun build src/public/wordlerds.ts --outdir public/
fi