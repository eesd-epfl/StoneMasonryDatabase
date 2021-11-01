import pandas as pd
import dash
import dash_html_components as html
import plotly.graph_objs as go
import plotly.express as px
import dash_core_components as dcc
from flask import Flask
import read_data


def functionfigB(df):
    # Selecting only the columns of interest
    df = df[['ID', 'Stone masonry typology', 'H [mm]']].copy()

    # replacing spaces in column names with "_"
    df.columns = [column.replace(" ", "_") for column in df.columns]

    Nunits = df['H_[mm]'].count()
    h_min = 750
    Nbars = 7

    #Preparing a dataFrame where the each bar will be on the mid-point between the ticks. Only handles 7 bars at the moment
    dfFigB = pd.DataFrame(0, index=['A', 'B', 'C', 'D', 'E', 'E1'],
                         columns=[0.875, 1.125, 1.375, 1.625, 1.875, 2.125, 2.375])

    #Creating the dataset for Fig B according to matlab file.
    for bar in range(1, Nbars + 1):
        for index, row in df.iterrows():
            if (row['H_[mm]'] > (bar - 1) * 250 + h_min and row['H_[mm]'] <= bar * 250 + h_min):
                if (row['Stone_masonry_typology'] == 'A'):
                    dfFigB.iloc[0, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'B'):
                    dfFigB.iloc[1, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'C'):
                    dfFigB.iloc[2, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'D'):
                    dfFigB.iloc[3, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'E'):
                    dfFigB.iloc[4, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'E1'):
                    dfFigB.iloc[5, bar - 1] += 1

    #Transposing dataframe and preparing array for the bar graph
    dfFigB = dfFigB.transpose()
    type = ['A', 'B', 'C', 'D', 'E', 'E1']

    #Bar graph layout
    fig = px.bar(
        dfFigB,
        labels=dict(
            index="Height [m]",
            value="# Tests",
            variable="Type",
        ),
        template='simple_white',
    )
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
                           'text': "Fig B - Height of Test Unit",
                           'y': 0.9,
                           'x': 0.5,
                           'xanchor': 'center',
                           'yanchor': 'top'
                            }
                       }
                      )
    return fig

#Uncomment if you want to run this script locally, and change the directory to your own
# df = pd.read_excel('C:/Users/patri/Documents/Vanin et al. (2017) StoneMasonryDatabase.xls', index_col=None)
# functionfigB(df).show()
