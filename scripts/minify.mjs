// Minifica CSS y JS del build (_site) en sitio, tras Eleventy.
// Se ejecuta como "postbuild" (npm run build → eleventy → este script).
import { transform } from 'esbuild';
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = '_site';

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const run = async () => {
  let files;
  try {
    files = await walk(ROOT);
  } catch {
    console.error('[minify] no existe', ROOT);
    return;
  }
  let savedBytes = 0;
  let count = 0;
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    const loader = ext === '.css' ? 'css' : ext === '.js' ? 'js' : null;
    if (!loader) continue;
    const src = await readFile(f, 'utf8');
    try {
      const { code } = await transform(src, { loader, minify: true, legalComments: 'none' });
      if (code.length < src.length) {
        savedBytes += src.length - code.length;
        await writeFile(f, code);
        count++;
      }
    } catch (e) {
      console.warn('[minify] omitido (error):', f, e.message);
    }
  }
  console.log(`[minify] ${count} archivos · ${(savedBytes / 1024).toFixed(1)} KiB ahorrados`);
};

run();
