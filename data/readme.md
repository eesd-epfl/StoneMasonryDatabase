# Data readme

The Stone Masonry Database is composed of one main Database Excel file and associated data files for each test.

## Data directory structure
```
Data
│	 Main Database .xls
│   
└─── Curves
│   │   FD\_{TestUnit}_{AuthorYear}.csv
│   │   FD\_{OtherTestUnit}_{OtherAuthorYear}.csv
│   │   bilinearisation\_{TestUnit}_{AuthorYear}.csv
│   │   bilinearisation_{OtherTestUnit}_{OtherAuthorYear}.csv
│   │   ...
│   
└─── Images
│   │   crackmap\_{TestUnit}_{AuthorYear}.csv
│   │   crackmap\_{OtherTestUnit}_{OtherAuthorYear}.csv
│   │   photo\_{TestUnit}_{AuthorYear}.jpg
│   │   photo\_{OtherTestUnit}_{OtherAuthorYear}.jpg
│   │   ...

```

## Main Database (Excel file)

**Filename: The main DB Excel file name should match the `inputFilePath` variable described in `config.js`. **

Variables are described in the tab "Fields_definition".

"References" tab should match the "Reference nb" column (from the "Database" tab).


## Datasets per test
### Filenaming conventions
***Filename: {DataContents}\_{TestUnitName}_{AuthorYear}.{FileType}***

with:

* DataContents = Data contents within:
	* FD (Force displacement curves) in CSV, 
	* Bilinearisation (Bilinearisation curves) in CSV, 
	* crackmap (Crack maps) in JPEG or SVG, 
	* photo (Photo of the crack) in JPEG)
* TestUnitName = Test Unit Name with all punctuation removed
* AuthorYear = First Author's lastname (utf-8) concatenated with year of publication.


### Force-Displacement curves
***Filename: FD\_{TestUnitName}_{AuthorYear}.csv***

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

### Bilinearisation curves
***Filename: FD\_{TestUnitName}_{AuthorYear}.csv***

Same structure as Force-displacement curves.

### Crack maps
***Filename: crackmap\_{TestUnitName}_{AuthorYear}.{jpg/svg}***

### Photo
***Filename: photo\_{TestUnitName}_{AuthorYear}.jpg***