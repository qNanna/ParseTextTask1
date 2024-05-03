import { parser } from './src/parseFile';
import { database } from './src/database';
import { importData } from './src/import';

async function main() {
    await database.init();

    const nestedObject = await parser.readDumpFile();    
    return await importData(nestedObject);
}

main()
    .catch(console.error)
    .finally(() => console.info('End.'));