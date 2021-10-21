import pandas as pd
import numpy as np

from bokeh.io import curdoc, output_file, show
from bokeh.layouts import column, row, widgetbox, layout, gridplot
from bokeh.models import CheckboxGroup, CustomJS, TableColumn, DataTable, ColumnDataSource, Panel, Tabs, \
    Paragraph, Dropdown, Slider
from bokeh.plotting import show, output_file, save, figure
from bokeh.client import push_session

# If running locally
# from scripts.curves import curves
# from scripts.data_prep import data_source

# If running web app
from curves import curves
from data_prep import data_source

# 1 - Importing data source and preparing data:
data = data_source()

# DataColumnSource for interactivity between plots and widgets
source = ColumnDataSource(data)
original_source = ColumnDataSource(data)

# Get curves dataframe from curves.py
curves_dataframe = curves()


# 2 - Creating each element of the page:
# 2.1 - Interactive Data table
columns = [TableColumn(field="ID", title="ID"),
           TableColumn(field="Test unit name", title="Test unit name"),
           TableColumn(field="Cyclic / Monotonic", title="Cyclic / Monotonic"),
           TableColumn(field="Lab / In-situ", title="Lab / In-situ"),
           TableColumn(field="Stone masonry typology", title="Stone masonry typology"),
           TableColumn(field="H [mm]", title="H [mm]"),
           TableColumn(field="L [mm]", title="L [mm]"),
           TableColumn(field="t [mm]", title="t [mm]"),
           TableColumn(field="H0 [mm]", title="H0 [mm]"),
           TableColumn(field="H0/H", title="H0/H"),
           TableColumn(field="Keff,+ [kN/mm]", title="Keff,+ [kN/mm]")
           ]

data_table = DataTable(source=source, columns=columns, width=600, height=600)


# 2.2 -  Initial paragraph
p = Paragraph(text="""The paper Vanin et al. (2017) "Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature" contains a database of quasi-static cyclic tests on stone masonry walls. This database is maintained and updated as new test results become available. This web application allows to display graphs, which show the important parameters and their distribution within the database for the updated versions of the database. These plots reproduce subplots of Figure 4 in the paper.

Please cite the paper and database as follows:
Paper: Vanin F., Zaganelli D., Penna A., Beyer K. (2017). Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature. Bull Earthquake Eng 15, 5435–5479 (2017). https://doi.org/10.1007/s10518-017-0188-5
Database: Vanin F., Zaganelli D., Penna A., Beyer K. (2017). Data set to "Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature". Accessed on xx.xx.20xx http://doi.org/10.5281/zenodo.812145

""", width=1200, height=200)

# 2.3 - Checkbox
# Get Stone Masonry Typology list:
labels = np.sort(data['Stone masonry typology'].unique()).tolist()  # + ['ALL']

# Create Checkbox widget
checkbox = CheckboxGroup(labels=labels, active=[0], default_size=200)

# Add Custom JS callbacks for interactivity - NOT WORKING #TODO
source_code = """
var inds = cb_obj.selected['Stone masonry typology'].indices;

checkbox.active = inds;

checkbox.change.emit()
"""

checkbox_code = """
source.selected['Stone masonry typology'].indices = cb_obj.active;
"""

source.js_on_change('selected', CustomJS(args=dict(checkbox=checkbox), code=source_code))
checkbox.js_on_change('active', CustomJS(args=dict(table=data_table, source=source), code=checkbox_code))
########################################################################################################################

# 2.4 - Sliders
# Create all the sliders:
stiffness_slider = Slider(start=data['Keff,+ [kN/mm]'].min(), end=data['Keff,+ [kN/mm]'].max(),
                          value=data['Keff,+ [kN/mm]'].max(), step=1, title='Stiffness')

strength_slider = Slider(start=0, end=10, value=1, step=10, title='strength')  # strength = fc

drift_slider = Slider(start=0, end=10, value=1, step=10, title='drift')

# Create interactivity for the first slider as an example: - NOT WORKING #TODO
# Widget Callback code:
widget_callback_code = """
var filtered_data = filtered_source.get('data');
var original_data = original_source.get('data');

var strength_slider = strength_slider.get('value');

// now construct the new data object based on the filtered values
for (var key in original_data) {
    filtered_data[key] = [];
    for (var i = 0; i < original_data[key].length; ++i) {
        if (original_data["Keff,+ [kN/mm]"][i] >= strength_slider) {
            filtered_data[key].push(original_data[key][i]);
        }
    }
}
source.data = filtered_data
target_obj.change.emit();
target_obj.trigger('change')
"""

# Dictionary with all the required data for callback:
arg_dct = dict(
    filtered_source=source,
    original_source=original_source,
    strength_slider=strength_slider,
    target_obj=data_table
)
generic_callback = CustomJS(args=arg_dct, code=widget_callback_code)

# Slider interactivity on change:
strength_slider.js_on_change('value', generic_callback)


# 2.5 - Multi scatter plots

# First merge curves dataframe to main file dataframe
final_data = pd.merge(data, curves_dataframe, on='Test unit name', how='inner')

# Make an array with all the plots
scatter_plots = []
for i in enumerate(final_data['Test unit name']):
    # print(final_data['data'][i[0]])
    if type(final_data['data'][i[0]]) == 'float':
        x = 1
        # print('no join on Test unit name :' + str(i[1]))
    else:
        x = final_data['data'][i[0]]['top_displacement']
        y = final_data['data'][i[0]]['horizontal_force']
        scatter_plots.append(figure())
        scatter_plots[i[0]].scatter(x=x, y=y)

# 3 Making the page layout
# Putting elements into a column/row layout
first_column = column(children=[checkbox, stiffness_slider, strength_slider, drift_slider])
scatter_grid = gridplot(scatter_plots, ncols=3, height=200, width=200)
main_row = row(first_column, data_table, scatter_grid)

# Putting each page into a tab:
# First tab - Overview DB
menu = [('Version 1, version_1')]
dropdown = Dropdown(label='Select Version', menu=menu)
page1 = layout(children=[dropdown])

# Second tab - Browse DB tests
page2 = layout(children=[row(p), main_row])

tab1 = Panel(child=page1, title="Browse DB tests")
tab2 = Panel(child=page2, title="Overview DB")

tabs = Tabs(tabs=[tab1, tab2])

show(tabs)

# # To run Bokeh as a webapp:
# curdoc().add_root(column(tabs))
# session = push_session(curdoc())
# session.show()
