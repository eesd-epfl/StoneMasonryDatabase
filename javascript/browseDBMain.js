import { tooltip } from './widgets.js';
import { setCurveColors } from './config.js';
import { allTabs } from './crossTabFunctions.js';

function app(){
    allTabs(1,"");
    // Add tooltip interaction to title:
    tooltip();
    setCurveColors();    
}
app();
