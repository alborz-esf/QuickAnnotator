from PIL import Image
from skimage import measure
import numpy as np
import pandas as pd
from skimage.measure import regionprops_table

def read_images(api_img, api_mask, prop_table, mask_filter=150, resize=480):
    img = None
    mask = None
    img = Image.open(api_img)

    mask = Image.open(api_mask)

    img = img.convert('L')
    w, h = img.size
    resize_factor = max(w,h) / resize

    img = img.resize((int(w//resize_factor),int(h//resize_factor)))
    img = np.array(img)

    mask = mask.convert('L')
    mask = mask.resize((int(w//resize_factor),int(h//resize_factor)))
    mask = np.array(mask)
    mask = mask > mask_filter
    print(f'=============> images loaded')
    
    return make_prop(img, mask, prop_table)

def make_prop(img, mask, prop_table):
    
    labels = measure.label(mask)
    # props = measure.regionprops(labels, img)
    print(f'=============> props created')

    return make_table_of_features(labels, prop_table)

def make_table_of_features(labels, prop_table):

    props_pd = regionprops_table(labels, properties=prop_table)
               
    res_df = pd.DataFrame(props_pd)
    print(f'=============> table created')
    return res_df