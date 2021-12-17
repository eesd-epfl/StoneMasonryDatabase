
// Relative path from root to data folder:
export const dataFolderPath = "data/"

export const config = {
    // Raw columns to take from Excel:
    excelColumns: ['ID','Reference','Reference nb','Test unit name', 'Cyclic / Monotonic', 'Lab / In-situ',
    'Stone masonry typology','Joints','Stone','H [mm]', 'L [mm]', 't [mm]', 'H0/H',
    'σ0,tot /fc','Failure type','Availability of F-Δ curve','Unretrofitted / Retrofitted',
    'Comment','dy,+ [%]','dy,- [%]','du,+ [%]','Vu,+ [kN]','du,- [%]','Vu,- [kN]',
    'Drift at which the photo was taken [%]','Drift at which the crack map was taken [%]','fc [MPa]'], 
    
    // Use this to rename the column headers to whatever you want:
    sortData(row){
        return {
            'ID': row['ID'],
            'Reference': row['Reference'],
            'Reference nb': row['Reference nb'],
            'Name': row['Test unit name'],
            'Cyclic': row['Cyclic / Monotonic'],
            'Lab': row['Lab / In-situ'],
            'Typ': row['Stone masonry typology'],
            'Mortar': row['Joints'],
            'H [mm]': row['H [mm]'],
            'L [mm]': row['L [mm]'],
            't [mm]': row['t [mm]'],
            'H0/H': row['H0/H'],
            'σ0,tot /fc': row['σ0,tot /fc'],
            'Failure': row['Failure type'],
            'F-Δ?': row['Availability of F-Δ curve'],
            'Fitting':row['Unretrofitted / Retrofitted'],
            'Comment':row['Comment'],
            'dy,+ [%]':row['dy,+ [%]'],
            'dy,- [%]':row['dy,- [%]'],
            'du,+ [%]':row['du,+ [%]'],
            'Vu,+ [kN]':row['Vu,+ [kN]'],
            'du,- [%]':row['du,- [%]'],
            'Vu,- [kN]':row['Vu,- [kN]'],
            'Photo drifts':row['Drift at which the photo was taken [%]'],
            'Crack map drifts':row['Drift at which the crack map was taken [%]'],
            'fc [MPa]':row['fc [MPa]']
        }
    },
    // Use this to show only the columns that you want (needs to correspond to the columns names from sortData function above):
    tableColumns: [
        // All the columns that shouldn't be displayed must be set to visible:false
        {title:'Reference nb', field:'Reference nb',visible :false},
        {title:'F-Δ?', field:'F-Δ?',visible :false},
        {title:'dy,+ [%]', field:'dy,+ [%]', visible:false},
        {title:'dy,- [%]', field:'dy,- [%]', visible:false},
        {title:'du,+ [%]', field:'du,+ [%]', visible:false},
        {title:'Vu,+ [kN]', field:'Vu,+ [kN]', visible:false},
        {title:'du,- [%]', field:'du,- [%]', visible:false},
        {title:'Vu,- [kN]', field:'Vu,- [kN]', visible:false},
        {title:'Photo drifts', field:'Photo drifts',visible:false},
        {title:'Crack map drifts', field:'Crack map drifts',visible:false},

        // All the others should be true:
        {title:"ID", field:"ID",visible :true},
        {title:'Typ', field:'Typ',visible :true},
        {title:'Reference', field:'Reference',visible :true},
        {title:'Name', field:'Name',visible :true},
        {title:'Cyclic', field:'Cyclic',visible :true},
        {title:'Lab', field:'Lab',visible :true},
        {title:'Mortar', field:'Mortar',visible :true},
        {title:'H [mm]', field:'H [mm]',visible :true},
        {title:'L [mm]', field:'L [mm]',visible :true},
        {title:'t [mm]', field:'t [mm]',visible :true},
        {title:'H<sub>0</sub>/H', field:'H0/H',visible :true},
        {title:'σ<sub>0,tot</sub> /f<sub>c</sub>', field:'σ0,tot /fc',visible :true},
        {title:'Failure', field:'Failure',visible :true},
        {title:'Fitting',field:'Fitting',visible:true},
        {title:'Comment', field:'Comment',visible :true},
    ],
    // Relative path to the Excel file, starting from root folder:
    inputFilePath: dataFolderPath+"Vanin et al. (2017) StoneMasonryDatabase.xls",

    //Relative path to Curves folder from the Data folder:
    curvesFolderPath: dataFolderPath+"Curves/",
    imagesFolderPath: dataFolderPath+"Images/",   
    envelopesFolderPath: dataFolderPath+"Envelopes/",   
    bibName: "Database.bib",
    fdColor: "rgb(253, 213, 37)",
    envColor: "rgb(192, 57, 43)",
    bilinColor:"rgb(125, 111, 181)",
}

export function setCurveColors(){
    //Choosing the color of the curves
    let cButtons = document.querySelectorAll("button[name=curveButton]");
    cButtons.forEach(button => {
        switch (button.id){
            case 'fd-button':
                button.style.backgroundColor = config.fdColor;
                break;
            case 'env-button':
                button.style.backgroundColor = config.envColor;
                break;
            case 'bil-button':
                button.style.backgroundColor = config.bilinColor;
                break;
        }
    })    
}