import * as fs from 'fs/promises';
import { join } from 'path';

class Parser {
    async readDumpFile(fileName = '/tmp/dump.txt') {
        const path = join(process.cwd(), fileName);
        const file = await fs.readFile(path, 'utf-8');

        return this.parseTextToJson(file);
    }

    parseTextToJson(text: string) {
        const lines = text.split('\n').filter(line => line);
        
        return this.parseRecursively(lines);
    }

    parseRecursively(lines: string[], spaces = 0) {
        let data: any = {};
        for (const [idx, line] of lines.entries()) {
            const indentLevel: number = line.length - line.trimStart().length;
            const [key, value] = line.split(':', 2).map(item => item.trim());
    
            if (indentLevel === spaces) {
                if (value) data[key] = value;
                else {
                    const nested = this.parseRecursively(lines.slice(idx + 1), indentLevel + 2);
                    Array.isArray(data[key]) ? data[key].push(nested) : data[key] = [nested];
                }
            }
    
            if (indentLevel < spaces) break;
        }
    
        return data;
    }
}

export const parser = new Parser();