
import pandas as pd
import dash
import dash_html_components as html
import plotly.graph_objs as go
import plotly.express as px
import dash_core_components as dcc
from flask import Flask
import read_data



def functionfigC(df):
    # Selecting only the columns of interest in a new dataframe
    dfC = df[['ID', 'Stone masonry typology','H0 [mm]', 'H [mm]','L [mm]']].copy()

    # Setting constants for the figure.
    Nunits = dfC['H [mm]'].count()
    HL_min = 0.25
    Nbars = 7

    # Adding the Ho/L calculation to each row:
    H0L = dfC['H0 [mm]'] / dfC['L [mm]']
    dfC['H0L'] = H0L

    # replacing spaces in column names with "_"
    dfC.columns = [column.replace(" ", "_") for column in dfC.columns]

    #Preparing a new dataframe to have each bar at the mid-point of the ticks, as shown in the PDF file. Only accepts 7 bars at the moment
    dfFigC = pd.DataFrame(0, index=['A', 'B', 'C', 'D', 'E', 'E1'],
                          columns=[0.375, 0.625, 0.875, 1.125, 1.375, 1.625, 1.875])

    #Filling the new dataframe with the number of tests per typology per range of H0/L
    for bar in range(1, Nbars + 1):
        for index, row in dfC.iterrows():
            if (row['H0L'] > (bar - 1) * 0.25 + HL_min and row['H0L'] <= bar * 0.25 + HL_min):
                if (row['Stone_masonry_typology'] == 'A'):
                    dfFigC.iloc[0, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'B'):
                    dfFigC.iloc[1, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'C'):
                    dfFigC.iloc[2, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'D'):
                    dfFigC.iloc[3, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'E'):
                    dfFigC.iloc[4, bar - 1] += 1
                elif (row['Stone_masonry_typology'] == 'E1'):
                    dfFigC.iloc[5, bar - 1] += 1

    #Transposing dataframe and preparing array for the figure
    dfFigC = dfFigC.transpose()
    type = ['A', 'B', 'C', 'D', 'E', 'E1']

    #Figure layout
    figC = px.bar(
        dfFigC,
        labels=dict(
            index="H₀/L",
            value="# Tests",
            variable="Type",
        ),
        template='simple_white'
    )
    figC.update_xaxes(
        dtick=0.25,
        ticks="inside",
        range=[0.2,2])
    figC.update_yaxes(
        ticks="inside",
        range=[0, 60],
        showgrid=False)
    figC.update_layout({'plot_bgcolor': 'rgba(0, 0, 0, 0)',
                       'paper_bgcolor': 'rgba(0, 0, 0, 0)',
                       'font': {'color': '#7f7f7f'},
                       'title': {
                           'text': "Fig C - Shear Span Ratio",
                           'y': 0.9,
                           'x': 0.5,
                           'xanchor': 'center',
                           'yanchor': 'top'
                       }
                       },
                      )
    return figC

#Uncomment if you want to run this script locally, and change the directory to your own
# df = pd.read_excel('C:/Users/patri/Documents/Vanin et al. (2017) StoneMasonryDatabase.xls', index_col=None)
# functionfigC(df).show()