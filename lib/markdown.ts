import fs from 'node:fs';
import path from 'node:path';
import { remark } from 'remark';
import html from 'remark-html';

export async function getMarkdownData(filePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const processedContent = await remark().use(html).process(fileContents);

  return processedContent.toString();
}
