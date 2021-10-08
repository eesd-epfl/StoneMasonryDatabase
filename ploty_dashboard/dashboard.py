#import all dependencies
import os
import dash
import dash_html_components as html
import plotly.express as px
import plotly.graph_objs as go
import dash_core_components as dcc
import pandas as pd
import math
from flask import Flask
from dash.dependencies import Input, Output

#Import other python files
import read_data
import fig4a
import fig4b
import fig4c
import fig4f
import fig4h
import fig4i


#Initialising the web app and design
external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app=dash.Dash(__name__, external_stylesheets=external_stylesheets)
server = app.server


#Handling the different versions and dropdown bar
df = read_data.read_data()
versions = df['Version'].unique() #returns an array of all the version dates, ascending.
version_dict = {}
for i in range(0,len(versions)):
    int = (i+1)
    int= str(int)
    version_dict[i] = {'label': 'Version '+ int, 'value': versions[i]}

#Create a dictionary that will have dropdown bar data
options = [value for key, value in version_dict.items()]


#Calling all figures from different Python files with initial Version of database:
current_df = df[df['Version']==versions[0]]
figA = fig4a.functionfigA(current_df)
figB = fig4b.functionfigB(current_df)
figC = fig4c.functionfigC(current_df)
figF = fig4f.functionfigF(current_df)
figH = fig4h.functionfigH(current_df)
figI = fig4i.functionfigI(current_df)


#Write the web page separations, graphs and text:
app.layout = html.Div()
app.layout = html.Div(children=[
    #This part is the title and initial paragraph
    html.Div(className='header',
             children=[
                 html.H1(['Database of quasi-static cyclic tests on stone masonry walls'], style={'textAlign': 'center'}),
                 html.P([
                     '''The paper Vanin et al. (2017) "Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature" contains a database of quasi-static cyclic tests on stone masonry walls. This database is maintained and updated as new test results become available. This web application allows to display graphs, which show the important parameters and their distribution within the database for the updated versions of the database. These plots reproduce subplots of Figure 4 in the paper.''',
                     html.Br(),
                     html.Br(),
                     '''Please cite the paper and database as follows:''',
                     html.Br(),
                     '''Paper: Vanin F., Zaganelli D., Penna A., Beyer K. (2017). Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature. Bull Earthquake Eng 15, 5435–5479 (2017). https://doi.org/10.1007/s10518-017-0188-5''',
                     html.Br(),
                     '''Database: Vanin F., Zaganelli D., Penna A., Beyer K. (2017). Data set to "Estimates for the stiffness, strength and drift capacity of stone masonry walls based on 123 quasi-static cyclic tests reported in the literature". Accessed on xx.xx.20xx  http://doi.org/10.5281/zenodo.812145''']),
                 html.Br(),
                 html.Br(),
                 html.P('''Select which version of the database to view.''')]
             )
    ,
    #This part consists of the dropdown bar on the left side and all the figures on the right.
    html.Div(className='row',
             children=[
                 html.Div(className='four columns div-user-controls', children=[
                     html.Div(className='div-for-DropDown',
                              children=[
                                  dcc.Dropdown(id='versionSelector',
                                               options=options,
                                               value=versions[0],
                                               className='versionSelector')
                                  ])
                 ])])
    ,
    html.Div(className='eight columns div-for-charts bg-grey',children=[
        #Figure A
        dcc.Graph(
            id='figA',
            figure=figA
            ),
        #Figure B
        dcc.Graph(
            id='figB',
            figure=figB
            )
        ,
        #Figure C
        dcc.Graph(
            id='figC',
            figure=figC
            ),
        dcc.Graph(
        id='figF',
        figure=figF
        )
             ,
        dcc.Graph(
            id='figH',
            figure=figH
            ),
        dcc.Graph(
            id='figI',
            figure=figI
            )
         ])
])

#Section to handle dropdown bar. Re-creates every figure with new version
@app.callback(
    dash.dependencies.Output('figA','figure'),
    dash.dependencies.Output('figB', 'figure'),
    dash.dependencies.Output('figC','figure'),
    dash.dependencies.Output('figF','figure'),
    dash.dependencies.Output('figH','figure'),
    dash.dependencies.Output('figI','figure'),
    [dash.dependencies.Input('versionSelector', 'value')])

def update_graphs(version_value):
    current_df = df[df['Version'] == version_value]
    return fig4a.functionfigA(current_df),\
           fig4b.functionfigB(current_df),\
           fig4c.functionfigC(current_df),\
           fig4f.functionfigF(current_df),\
           fig4h.functionfigH(current_df),\
           fig4i.functionfigI(current_df)

if __name__ =='__main__':
    app.run_server(debug=True)


