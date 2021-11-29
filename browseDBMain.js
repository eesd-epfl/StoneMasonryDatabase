import { tooltip } from './javascript/browseDBTable.js';
import { allTabs } from './javascript/crossTabFunctions.js';

function app(){
    allTabs(1,"");
    // Add tooltip interaction to title:
    tooltip();
}
app();
