
export function checkBoxHandling(){
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    let enabledSettings = [];

    //Iterate through all checkboxes:
    checkboxes.forEach(function(checkbox){
        //add event Listeners to all checkboxes
        checkbox.addEventListener('change',function(){
            //get all the active checkboxes and create a Tabulator filter:
            enabledSettings = 
                Array.from(checkboxes).filter(i => i.checked).map(i => i.value);
                table.setFilter('Stone masonry typology','in',enabledSettings);
            });
        });
};