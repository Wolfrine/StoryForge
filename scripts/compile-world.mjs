import fs from 'node:fs';
import path from 'node:path';

const root = process.env.STORYWORLD_ROOT || 'storyworld/testbench';
const sourcePath = path.join(root, 'world.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const packagesRoot = path.join(root, source.packageDirectory);

const packages = fs
  .readdirSync(packagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const packagePath = path.join(packagesRoot, entry.name, 'package.json');
    if (!fs.existsSync(packagePath)) {
      throw new Error(`Missing package.json in ${path.join(packagesRoot, entry.name)}`);
    }
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
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

console.log(`Compiled StoryForge world: ${packages.length} packages from ${packagesRoot}`);
