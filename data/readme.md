# Data readme

The Stone Masonry Database is composed of one main Database Excel file and associated data files for each test.

## Data directory structure
```
Data
│───  Main Database.xls
│───  Database.bib
│
│─── Curves
│      │─── FD\_{TestUnit}_{AuthorYear}.csv
│      │─── FD\_{OtherTestUnit}_{OtherAuthorYear}.csv
│      └───...
│   
│─── Envelopes
│      │─── envelope\_{TestUnit}_{AuthorYear}.csv
│      │─── envelope\_{OtherTestUnit}_{OtherAuthorYear}.csv
│      └─── ...
│
│─── Images
│      │───{TestUnit}
│      │     │─ crackmap\_{TestUnit}_D{DriftPercentage1}_{AuthorYear}.png
│      │	 │─ crackmap\_{TestUnit}_D{DriftPercentage2}_{AuthorYear}.png
│      │     │─ ...
│      │     │─ photo\_{TestUnit}_D{DriftPercentage1}_{AuthorYear}.jpg
│      │     │─ photo\_{TestUnit}_{AuthorYear}_D{DriftPercentage2}_.jpg
│      │     └─ ...
│      │───{OtherTestUnit}
│      │     │─ crackmap\_{OtherTestUnit}_D{DriftPercentage1}_{AuthorYear}.png
│      │	 │─ crackmap\_{OtherTestUnit}_D{DriftPercentage2}_{AuthorYear}.png
│      │     │─ ...
│      │	 │─ photo\_{OtherTestUnit}_D{DriftPercentage1}_{AuthorYear}.jpg
│      │     │─ photo\_{OtherTestUnit}_{AuthorYear}_D{DriftPercentage2}_.jpg
│      │     └─ ...
│      └─   ...
└─   ...
```

## Main Database (Excel file)

*** Filename: The main DB Excel file name should match the `inputFilePath` variable described in `config.js`. ***

*** The database should be kept as an .XLS file (not .XLSX). ***
Variables are described in the tab "Fields_definition".

"References" tab should match the "Reference nb" column (from the "Database" tab).


## Datasets per test
### Filenaming conventions

For FD and Envelope files:
***Filename: {DataType}\_{TestUnitName}_{AuthorYear}.{FileType}***

For Photos and Crack maps:
***Filename: {DataType}\_{TestUnitName}\_D{DriftPercentage}\_{AuthorYear}.{FileType}***

with:

* DataType = Type of file:
	* FD (Force displacement curves) as a CSV, 
	* envelope (envelope curves) as a CSV, 
	* crackmap (Crack maps) as a PNG, 
	* photo (Photo of the crack) as a  JPG)
* TestUnitName = Test Unit Name with all punctuation and special characters removed
* DriftPercentage = Drift percentage at which the photo/crack map was taken
* AuthorYear = First Author's lastname (utf-8) concatenated with year of publication


### Force-Displacement and Envelope curves
***Filename: FD\_{TestUnitName}\_{AuthorYear}.csv***
***Filename: envelope\_{TestUnitName}\_{AuthorYear}.csv***

Each data file contains 4 lines of metadata:

* Line 1 : Test Unit
* Line 2 : Reference
* Line 3 : Headers
* Line 4 : Units

| Header          | Description                                        | Unit  | Data type | Mandatory  |
|----------------------|----------------------------------------------------|-------|-----------|---|
| top\_displacement    | top displacement         | [mm]   | float      | y  |
| horizontal\_force         | horizontal force                       | [kN] | float    |  y |
| drift | drift               | [%]   | float   |  y |


### Crack maps
***Filename: crackmap\_{TestUnitName}\_D{DriftPercentage}\_{AuthorYear}.{png}***

{DriftPercentage} will have the period replaced by the letter p (-1.50 -> -1p50)

### Photo
***Filename: photo\_{TestUnitName}\_D{DriftPercentage}\_{AuthorYear}.jpg***

{DriftPercentage} will have the period replaced by the letter p (-1.50 -> -1p50)