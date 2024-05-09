from PIL import Image
from PIL import  ImageDraw, ImageFont
from skimage import measure
import numpy as np
import pandas as pd
from skimage.measure import regionprops_table

def read_images(api_img, api_mask, mask_filter=150):
    img = None
    mask = None
    img = Image.open(api_img)

    mask = Image.open(api_mask)

    img = img.convert('L')
    img = np.array(img)

    mask = mask.convert('L')
    mask = np.array(mask)
    mask = mask > mask_filter
    print(f'=============> images loaded')
    
    return img, mask

def make_prop(img, mask):
    
    labels = measure.label(mask)
    print(f'=============> props created')
    return labels

def make_table_of_features(labels, prop_table):

    props_pd = regionprops_table(labels, properties=prop_table)
               
    res_df = pd.DataFrame(props_pd)
    print(f'=============> table created')
    return res_df

def calculate_statistics(api_img, api_mask, prop_table, mask_filter=150):
    
    img, mask = read_images(api_img, api_mask, mask_filter)
    labels =  make_prop(img, mask)
    return make_table_of_features(labels, prop_table)

def set_image_labels(api_img, api_mask, project_name, image_name, mask_filter=150):
    
    img, mask = read_images(api_img, api_mask, mask_filter)
    labels =  make_prop(img, mask)
    props_pd = make_table_of_features(labels, ('label','centroid'))
    label_img = Image.open(api_mask)
    label_font = ImageFont.truetype('arial.ttf', 80)
    img_draw = ImageDraw.Draw(label_img)

    for index, row in props_pd.iterrows():
        img_draw.text((row['centroid-1'], row['centroid-0']), str(int(row['label'])), font=label_font, fill=(255, 0, 0))
    
    img_label_name = f"./projects/{project_name}/"+ image_name.replace(".png", "_label.png")
    label_img.save(img_label_name, "PNG")
    print("=============> label image created")
    return img_label_name
    
 