import fs from 'fs';
import path from 'path';

function checkCaseSensitiveImports(dir) {
  let issues = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'uploads' && file.name !== '.git') {
      issues = issues.concat(checkCaseSensitiveImports(fullPath));
    } else if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const importRegex = /(?:import\s+[^'"]*from\s+['"]([^'"]+)['"])|(?:require\(['"]([^'"]+)['"]\)|(?:import\(['"]([^'"]+)['"]\)))/g;
      const staticImportRegex = /(?:import\s+['"]([^'"]+)['"])/g; // for import './style.css'
      
      let match;
      
      const checkPath = (importPath) => {
        if (!importPath || !importPath.startsWith('.')) return;

        const targetPath = path.resolve(path.dirname(fullPath), importPath);
        const dirname = path.dirname(targetPath);
        const basename = path.basename(targetPath);
        
        if (fs.existsSync(dirname)) {
          const dirFiles = fs.readdirSync(dirname);
          
          let actualFileExists = false;
          let suggestedFile = '';

          const exts = ['', '.js', '.jsx', '.css', '.json', '/index.js', '/index.jsx'];

          for(const df of dirFiles) {
            for(const ext of exts) {
              if (df === basename + ext || (df === basename && ext === '')) {
                actualFileExists = true;
                break;
              }
              if (df.toLowerCase() === (basename + ext).toLowerCase() || (df.toLowerCase() === basename.toLowerCase() && ext === '')) {
                suggestedFile = df;
              }
            }
            if(actualFileExists) break;
          }

          if (!actualFileExists && suggestedFile) {
            issues.push({ 
              file: fullPath, 
              importStr: importPath, 
              expected: suggestedFile 
            });
          }
        }
      };

      while ((match = importRegex.exec(content)) !== null) {
        checkPath(match[1] || match[2] || match[3]);
      }
      while ((match = staticImportRegex.exec(content)) !== null) {
        checkPath(match[1]);
      }
    }
  }
  return issues;
}

const issues = checkCaseSensitiveImports(path.join(process.cwd(), process.argv[2] || '.'));
console.log(JSON.stringify(issues, null, 2));

