import pandas as pd
import requests
import json


# Simple code to read data from local file
# def data():
#     df = pd.read_excel('C:/Users/patri/Documents/Vanin et al. (2017) StoneMasonryDatabase.xls', index_col=None)
#     return df

# This function gets the files from zenodo and directly converts them to a dataframe, without downloading locally.
# !!! Files are sorted by Version, which should follow the format YYYY.MM.DD

def read_data():
    doi = '10.5281/zenodo.812145'
    url = 'https://doi.org/' + doi
    r = requests.get(url)
    recordID = r.url.split('/')[-1]
    recordID = recordID.strip()

    get_api_url = 'https://zenodo.org/api/records/'
    r = requests.get(get_api_url+recordID)
    js = json.loads(r.text)
    files = js['files']


    #While the database doesn't have a 'Version' Column, use this code:
    for f in files:
        if(f['key'].find('xls')!=-1):
            df = pd.read_excel(f['links']['self'])
            df['Version'] = '2020-01-27'

    #Uncomment this part when the excel files contain the 'Version' Column with date in format YYYY-MM-DD and delete above.
    # dataframes=[]
    # for f in files:
    #     if(f['key'].find('xls')!=-1):
    #         dataframes.append(pd.read_excel(f['links']['self']))
    # df = pd.concat(dataframes)
    # df.sort_values(by=['Version','ID'],ascending=True, inplace=True)
    return df


#read_data()