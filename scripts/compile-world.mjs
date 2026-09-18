import fs from 'node:fs';
import path from 'node:path';

const root = process.env.STORYWORLD_ROOT || 'storyworld/testbench';
const sourcePath = path.join(root, 'world.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const packagesRoot = path.join(root, source.packageDirectory);
const assetOutputRoot = path.join('public', 'storyworld');

function isExternalAsset(src) {
  return /^(?:https?:|data:|blob:|\/)/i.test(src);
}

function normalizeWebPath(value) {
  return value.split(path.sep).join('/');
}

function copyFileIntoRuntime(pkgId, packageDir, mediaSrc) {
  const sourceAsset = path.resolve(packageDir, mediaSrc);
  const packageRoot = path.resolve(packageDir);

  if (!sourceAsset.startsWith(packageRoot + path.sep)) {
    throw new Error(`${pkgId}: media path escapes its package directory: ${mediaSrc}`);
  }

  if (!fs.existsSync(sourceAsset) || !fs.statSync(sourceAsset).isFile()) {
    throw new Error(`${pkgId}: media file does not exist: ${mediaSrc}`);
  }

  const outputRelative = normalizeWebPath(mediaSrc);
  const outputAsset = path.join(assetOutputRoot, pkgId, ...mediaSrc.split(/[\\/]/));

  fs.mkdirSync(path.dirname(outputAsset), { recursive: true });
  fs.copyFileSync(sourceAsset, outputAsset);

  return `/storyworld/${pkgId}/${outputRelative}`;
}

fs.rmSync(assetOutputRoot, { recursive: true, force: true });

const packages = fs
  .readdirSync(packagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const packageDir = path.join(packagesRoot, entry.name);
    const packagePath = path.join(packageDir, 'package.json');

    if (!fs.existsSync(packagePath)) {
      throw new Error(`Missing package.json in ${packageDir}`);
    }

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const compiledPackage = structuredClone(pkg);

    compiledPackage.media = (compiledPackage.media ?? []).map((asset) => {
      if (isExternalAsset(asset.src)) return asset;

      return {
        ...asset,
        src: copyFileIntoRuntime(compiledPackage.id, packageDir, asset.src)
      };
    });

    return compiledPackage;
  })
  .sort((a, b) => a.id.localeCompare(b.id));

const runtime = {
  schemaVersion: source.schemaVersion,
  id: source.id,
  title: source.title,
  subtitle: source.subtitle,
  theme: source.theme,
  entryPolicy: source.entryPolicy,
  packages
};

fs.mkdirSync('src/generated', { recursive: true });
fs.writeFileSync('src/generated/world.json', JSON.stringify(runtime, null, 2) + '\n');

console.log(
  `Compiled StoryForge world: ${packages.length} packages from ${packagesRoot}; local assets copied to ${assetOutputRoot}`
);
