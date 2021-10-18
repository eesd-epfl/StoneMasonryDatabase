import pandas as pd
import numpy as np
from os.path import dirname, join
from bokeh.io import curdoc, output_file, show
from bokeh.layouts import column, row, widgetbox, layout
from bokeh.models import CheckboxGroup, CustomJS, TableColumn, DataTable, ColumnDataSource, Panel, Tabs, \
    Paragraph, Dropdown, Slider
from bokeh.plotting import show, output_file, save, figure
from bokeh.client import push_session

# If running locally
# from scripts.test import curves

# If running web app
from test import curves

# Get Data and prepare it for Bokeh:
data = pd.read_excel(join(dirname('C:\\Users\\patri\\eesd-dashboard\\epfl_git\\bokeh_dashboard\\data'), 'data',
                          'Vanin et al. (2017) StoneMasonryDatabase.xls'))

# Filter only columns of interest
prep_data = data[['ID', 'Test unit name', 'Cyclic / Monotonic', 'Lab / In-situ',
                  'Stone masonry typology', 'H [mm]', 'L [mm]', 't [mm]', 'H0 [mm]', 'H0/H', 'Keff,+ [kN/mm]']]

# Prepare a filter for only 'A' Typology:
# prep_data.iloc('Test unit name') ='A'


source = ColumnDataSource(prep_data)
original_source = ColumnDataSource(prep_data)

# Get Stone Masonry Typology list:
data = data['Stone masonry typology'].unique()
labels = np.sort(data).tolist()  # + ['ALL']

# Make Interactive Data Table:
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

data_table = DataTable(source=source, columns=columns)

#######################################################################################################################
# Callback functions to handle later #TODO
# requires (source, original_source, country_select_obj, year_select_obj, target_object)
callback_code = """
var data = source.data;
var original_data = original_source.data;
var new_source= []
active_typologies = [typology_checkbox_obj.labels[i] for i in typology_checkbox_obj.active]
id = source.data['ID']
for (var i=0; i < id.length; i++) {
    for (item in active_typologies){
        if(item==data['Stone masonry typology'][i]){
            new_source[i]=data[i]
        }
    }
}
source.change.emit();
target_obj.change.emit();
target_obj.trigger('change');
"""

# combined_callback_code = """
# var data = source.data;
# var original_data = original_source.data;
# var typology = typology_checkbox_obj.value;
# console.log("Typology: " + typology);
# for (var key in original_data) {
#
#     data[key] = [];
#     for (var i = 0; i < original_data['Stone masonry typology'].length; ++i) {
#         if ((typology === "ALL" || original_data['Stone masonry typology'][i] === typology)) {
#             data[key].push(original_data[key][i]);
#         }
#     }
# }
# source.change.emit();
# target_obj.change.emit();
# target_obj.trigger('change')
# """

# now define the callback objects now that the filter widgets exist
# checkbox_callback = CustomJS(
#     args=dict(source=source,
#               original_source=original_source,
#               typology_checkbox_obj=typology_checkbox,
#               target_obj=data_table,
#               ),
#     code=callback_code
# )
# Connect callback to filter widget
# typology_checkbox.on_change('active', checkbox_callback)
# show(typology_checkbox)
#######################################################################################################################
################################## 3rd part - Multi figures ###########################################################

# Get curves dataframe from test.py
curves_dataframe = curves()

# Merge curves dataframe to main file dataframe
final_data = pd.merge(prep_data, curves_dataframe, on='Test unit name', how='inner')

# Create sample plot from final dataframe:
x = final_data['data'][0]['top_displacement']
y = final_data['data'][0]['horizontal_force']

scatter = figure(width=200, height=200)
scatter.scatter(x=x, y=y)

# Code to make all the scatter plots:

# print(final_data['data'][56])

scatter_plots = []
for i in enumerate(final_data['Test unit name']):
    # print(final_data['data'][i[0]])
    if type(final_data['data'][i[0]]) == 'float':
        x = 1
        # print('no join on Test unit name :' + str(i[1]))
    else:
        # print(final_data['data'][i[0]]['top_displacement'])
        x = final_data['data'][i[0]]['top_displacement']
        y = final_data['data'][i[0]]['horizontal_force']
        scatter_plots.append(figure(width=200, height=200))
        scatter_plots[i[0]].scatter(x=x, y=y)

# scatter_layout = layout(children=scatter_plots)

# Paragraph for testing:
p = Paragraph(text="""The paper Vanin et al. (2017) "Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature" contains a database of quasi-static cyclic tests on stone masonry walls. This database is maintained and updated as new test results become available. This web application allows to display graphs, which show the important parameters and their distribution within the database for the updated versions of the database. These plots reproduce subplots of Figure 4 in the paper.

Please cite the paper and database as follows:
Paper: Vanin F., Zaganelli D., Penna A., Beyer K. (2017). Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature. Bull Earthquake Eng 15, 5435–5479 (2017). https://doi.org/10.1007/s10518-017-0188-5
Database: Vanin F., Zaganelli D., Penna A., Beyer K. (2017). Data set to "Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature". Accessed on xx.xx.20xx http://doi.org/10.5281/zenodo.812145

""", width=800, height=200)

# Create CheckBox:
checkbox = CheckboxGroup(labels=labels, active=[0], default_size=200)

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

# Create all the sliders:
stiffness_slider = Slider(start=final_data['Keff,+ [kN/mm]'].min(), end=final_data['Keff,+ [kN/mm]'].max(),
                          value=final_data['Keff,+ [kN/mm]'].max(), step=1, title='Stiffness')

strength_slider = Slider(start=0, end=10, value=1, step=10, title='strength')  # strength = fc

drift_slider = Slider(start=0, end=10, value=1, step=10, title='drift')  #
# Making the interface:
page2 = layout(children=[
    row(p),
    [[checkbox, stiffness_slider, strength_slider, drift_slider], data_table, scatter_plots]
])

menu = [('Version 1, version_1')]
dropdown = Dropdown(label='Select Version', menu=menu)
page1 = layout(children=[dropdown])

tab1 = Panel(child=page2, title="Browse DB tests")
tab2 = Panel(child=page1, title="Overview DB")

tabs = Tabs(tabs=[tab1, tab2])

show(tabs)

# # To run Bokeh as a webapp:
# curdoc().add_root(column(tabs))
# session = push_session(curdoc())
# session.show()
