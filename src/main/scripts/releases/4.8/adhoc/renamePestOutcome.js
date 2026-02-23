load('../../../utils/audit.js');
load('../../../utils/program.js');

const systemUserId = 'system';
const oldOutcomeName = '1.  Species and Landscapes (Short term): Managing Threats - Pest predator an competitor species have been controlled or are under active, long-term control programs';
const newOutcomeName = '1.  Species and Landscapes (Short term): Managing Threats - Pest predator and competitor species have been controlled or are under active, long-term control programs';
renameProgramOutcome('short', oldOutcomeName, newOutcomeName);
