import pandas as pd
from os.path import dirname, join
from os import listdir
from bokeh.plotting import show, figure

directory = r'C:\\Users\\patri\\eesd-dashboard\\epfl_git\\eesd-dashboard\\bokeh_dashboard\\data\\01_experimental_curves'


def curves():
    curve_dict = {}
    for ID, filename in enumerate(listdir(directory)):
        # Get the test unit name and data from the file:
        unit_name = pd.read_csv(join(dirname('C:\\Users\\patri\\eesd-dashboard\\epfl_git\\eesd-dashboard\\bokeh_dashboard\\data\\'),
                                     '01_experimental_curves', filename), header=None, nrows=1)[1][0]
        data = pd.read_csv(join(dirname('C:\\Users\\patri\\eesd-dashboard\\epfl_git\\eesd-dashboard\\bokeh_dashboard\\data\\'),
                                '01_experimental_curves', filename), header=2, skiprows=[3])

        # Create the curve data dictionary for each file
        curve = {
            'Test unit name': unit_name,
            'data': data
        }
        # Keep all the curve data into one big dictionary
        curve_dict[filename] = curve

    # Convert dictionary to Dataframe
    curve_dataframe = pd.DataFrame.from_dict(curve_dict, orient='index')

    # Example figures:
    # p = figure(width=400, height=400)
    # p.scatter(x=curve_dict['curve001.csv']['data']['top_displacement'],
    #           y=curve_dict['curve001.csv']['data']['horizontal_force'])

    return curve_dataframe
####
