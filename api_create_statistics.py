import plotly
import plotly.express as px
import plotly.graph_objects as go
from skimage import measure
from PIL import Image
import os
import numpy as np
import pandas as pd
from tkinter import filedialog
import sys
from skimage.measure import regionprops_table

def read_images(api_img, api_mask):
    img = None
    mask = None

    img = api_img

    mask = api_mask

    img = img.convert('L')
    w, h = img.size
    resize_factor = max(w,h)/480
    img = img.resize((int(w//resize_factor),int(h//resize_factor)))
    img = np.array(img)

    mask = mask.convert('L')
    mask = mask.resize((int(w//resize_factor),int(h//resize_factor)))
    mask = np.array(mask)
    mask = mask > 150
    print(f'=============> images loaded')
    
    make_prop(img, mask)

def make_prop(img, mask):
    
    labels = measure.label(mask)
    props = measure.regionprops(labels, img)
    print(f'=============> props created')

    make_table_of_features(labels)

def make_table_of_features(labels):

    props_pd = regionprops_table(labels, properties=('centroid',
                                                'orientation',
                                                'axis_major_length',
                                                'axis_minor_length', 'eccentricity', 'perimeter', 'area'))
                                            
    res_df = pd.DataFrame(props_pd)
    res_df.to_csv('output.csv', index=False)
    print(f'=============> table created')