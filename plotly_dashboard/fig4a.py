import os
import dash
import dash_html_components as html
import plotly.express as px
import plotly.graph_objs as go
import dash_core_components as dcc
import pandas as pd
import math
from flask import Flask
import read_data

def functionfigA(df):
    # Selecting only the columns of interest
    df = df[['ID', 'Stone masonry typology', 'Lab / In-situ', 'H [mm]']].copy()

    # replacing spaces in column names with "_"
    df.columns = [column.replace(" ", "_") for column in df.columns]

    Nunits = df['H_[mm]'].count()
    h_min = 750
    Nbars = 7

    dfFigA = pd.DataFrame(0, index=['Lab', 'In-Situ'],
                          columns=['A', 'B', 'C', 'D', 'E', 'E1'])

    #Creating the dataset for Fig A according to matlab file.
    for index, row in df.iterrows():
        if (row['Lab_/_In-situ'].find('Lab') != -1):
            if (row['Stone_masonry_typology'] == 'A'):
                dfFigA.iloc[0, 0] += 1
            elif (row['Stone_masonry_typology'] == 'B'):
                dfFigA.iloc[0, 1] += 1
            elif (row['Stone_masonry_typology'] == 'C'):
                dfFigA.iloc[0, 2] += 1
            elif (row['Stone_masonry_typology'] == 'D'):
                dfFigA.iloc[0, 3] += 1
            elif (row['Stone_masonry_typology'] == 'E'):
                dfFigA.iloc[0, 4] += 1
            elif (row['Stone_masonry_typology'] == 'E1'):
                dfFigA.iloc[0, 5] += 1
        else:
            if (row['Stone_masonry_typology'] == 'A'):
                dfFigA.iloc[1, 0] += 1
            elif (row['Stone_masonry_typology'] == 'B'):
                dfFigA.iloc[1, 1] += 1
            elif (row['Stone_masonry_typology'] == 'C'):
                dfFigA.iloc[1, 2] += 1
            elif (row['Stone_masonry_typology'] == 'D'):
                dfFigA.iloc[1, 3] += 1
            elif (row['Stone_masonry_typology'] == 'E'):
                dfFigA.iloc[1, 4] += 1
            elif (row['Stone_masonry_typology'] == 'E1'):
                dfFigA.iloc[1, 5] += 1

    #Transposing dataframe and adding a type column
    dfFigA = dfFigA.transpose()
    dfFigA['Type'] = ['A', 'B', 'C', 'D', 'E', 'E1']

    #Figure layout
    fig = px.bar(
        dfFigA,
        x=['A', 'B', 'C', 'D', 'E', 'E1'],
        y=dfFigA.Lab,
        color=dfFigA.Type,
        labels=dict(
            index=" ",
            value="# Tests",
            variable="Lab - Masonry Type"
        ),
        template='simple_white')

    #Adding a second bar graph that will have In-Situ data
    fig.add_trace(go.Bar(x=['A', 'B', 'C', 'D', 'E', 'E1'], y=dfFigA['In-Situ'], name='In-Situ'))

    #Figure layout details
    fig.update_xaxes(
        dtick=0.25,
        ticks="inside")
    fig.update_yaxes(
        ticks="inside",
        range=[0,60],
        showgrid=False)
    fig.update_layout({'plot_bgcolor': 'rgba(0, 0, 0, 0)',
                       'paper_bgcolor': 'rgba(0, 0, 0, 0)',
                       'font':{'color':'#7f7f7f'},
                       'title': {
                           'text': "Fig A - Masonry typology & Type of test",
                           'y': 0.9,
                           'x': 0.5,
                           'xanchor': 'center',
                           'yanchor': 'top'
                       },
                       'xaxis':{
                           "title": " ",
                       },
                       'yaxis':{
                           "title": "# Tests"
                       }
                       }
                      )
    #Make the bar graphs stack on each other
    fig.update_layout(barmode='stack')
    return fig

#Uncomment if you want to run this script locally, and change the directory to your own
# df = pd.read_excel('C:/Users/patri/Documents/Vanin et al. (2017) StoneMasonryDatabase.xls', index_col=None)
# functionfigA(df).show()