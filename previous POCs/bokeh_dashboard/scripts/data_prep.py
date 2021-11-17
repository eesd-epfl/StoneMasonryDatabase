import pandas as pd
from os.path import dirname, join


def data_source():
    # Get Data and prepare it for Bokeh:
    data = pd.read_excel(join(dirname('C:\\Users\\patri\\eesd-dashboard\\epfl_git\\eesd-dashboard\\bokeh_dashboard\\data'), 'data',
                              'Vanin et al. (2017) StoneMasonryDatabase.xls'))

    # Filter only columns of interest
    prep_data = data[['ID', 'Test unit name', 'Cyclic / Monotonic', 'Lab / In-situ',
                      'Stone masonry typology', 'H [mm]', 'L [mm]', 't [mm]', 'H0 [mm]', 'H0/H', 'Keff,+ [kN/mm]']]

    # Prepare a filter for only 'A' Typology:

    return prep_data
