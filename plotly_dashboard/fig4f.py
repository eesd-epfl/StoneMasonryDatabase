import pandas as pd
import dash
import dash_html_components as html
import plotly.graph_objs as go
import plotly.express as px
import dash_core_components as dcc
from flask import Flask
import read_data


def functionfigF(df):
    # Selecting only the columns of interest
    dfF = df[['ID', 'Stone masonry typology', 'H [mm]', 'σ0,tot /fc']].copy()

    # replacing spaces in column names with "_"
    dfF.columns = [column.replace(" ", "_") for column in dfF.columns]

    Nunits = dfF['H_[mm]'].count()
    Nbars = 7

    #Preparing a new dataframe to have each bar at the mid-point of the ticks, as shown in the PDF file. Only accepts 7 bars at the moment
    dffigF = pd.DataFrame(0, index=['A', 'B', 'C', 'D', 'E', 'E1'], columns=[0.05, 0.15, 0.25, 0.35, 0.45, 0.55])

    #Filling the new dataframe with the number of tests per typology per range of σ0,tot_/fc
    for bar in range(1, Nbars + 1):
        for index, row in dfF.iterrows():
            if (row['σ0,tot_/fc'] > (bar - 1) * 0.1 and row['σ0,tot_/fc'] <= bar * 0.1):
                if (row['Stone_masonry_typology'] == 'A'):
                    dffigF.iloc[0, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'B'):
                    dffigF.iloc[1, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'C'):
                    dffigF.iloc[2, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'D'):
                    dffigF.iloc[3, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'E'):
                    dffigF.iloc[4, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'E1'):
                    dffigF.iloc[5, bar - 1] += 1

    #Transposing dataframe and preparing array for the figure
    dffigF = dffigF.transpose()
    type = ['A', 'B', 'C', 'D', 'E', 'E1']

    #Figure layout
    fig = px.bar(
        dffigF,
        labels=dict(
            index="σ₀/f꜀",
            value="# Tests",
            variable="Type",
        ),
        template='simple_white'
    )
    fig.update_xaxes(
        dtick=0.1,
        ticks="inside")
    fig.update_yaxes(ticks="inside")
    fig.update_layout({'plot_bgcolor': 'rgba(0, 0, 0, 0)',
                       'paper_bgcolor': 'rgba(0, 0, 0, 0)',
                       'font': {'color': '#7f7f7f'},
                       'title': {
                           'text': "Fig F - Axial Stress Ratio",
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
# functionfigF(df).show()