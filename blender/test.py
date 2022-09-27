import os
import sys
import bpy
import cv2
import numpy as np

# https://docs.blender.org/api/current/bpy.ops.sequencer.html
# use --debug-wm to see more info
# $ blender blender/save-videos-to-vid-editor.blend --python blender/test.py --background -- render

# on wsl2, run 
# $ ./win-create.sh --bg render

def clean_sequencer(sequence_context):
    bpy.ops.sequencer.select_all(sequence_context, action="SELECT")
    bpy.ops.sequencer.delete(sequence_context)

def find_sequence_editors():
    editors = []
    for area in bpy.context.window.screen.areas:
        if area.type == "SEQUENCE_EDITOR":
            editors.append({
                "area" : area
            })
    return editors

# convert hex color to array of 3 floats between 0 and 1
def hex_to_rgb(hex):
    hex = hex.lstrip('#')
    hlen = len(hex)
    return tuple(int(hex[i:i+hlen//3], 16)/256 for i in range(0, hlen, hlen//3))

# add images to the blender sequence editor
def main():
    sequence_editors = find_sequence_editors()
    
    clean_sequencer(sequence_editors[0])

    render = False
    output_path = "/home/tlaloc/projects/protocodex/creation-generator/blender/render/test"
    input_dir = "/home/tlaloc/projects/protocodex/creation-generator/tmp/gsearchimages/"

    # interpret the arguments after --
    # check if -- is in sys.argv
    if "--" in sys.argv:
        for arg in sys.argv[sys.argv.index("--") + 1:]:
            if arg == "is_wsl":
                print("is wsl!")
                output_path = "\\\\wsl$\Debian\home\enki\Projects\Protocodex\creation-generator\\blender\\render\\test"
                input_dir = "\\\\wsl$\Debian\home\enki\Projects\Protocodex\creation-generator\\tmp\\gsearchimages"
            if arg == "render":
                render = True
     
    bpy.context.scene.render.filepath = output_path
    
    filenames = os.listdir(input_dir)
    
    frames_per_image = 20
    transform_amount = 0.9
    image_amount = 10
    # image_amount = len(filenames)
    background_color='#000000'
    titled = False 

    # Set number of frames 
    bpy.context.scene.frame_end = image_amount * frames_per_image
    
    # Add background
    bpy.ops.sequencer.effect_strip_add(
        sequence_editors[0],
        type='COLOR', 
        frame_start=1,
        frame_end=image_amount * frames_per_image,
        channel=1,
        color=hex_to_rgb(background_color)
    )

    for i in range(image_amount):
        bpy.ops.sequencer.image_strip_add(
            sequence_editors[0],
            directory=input_dir,
            files=[{
                "name": filenames[i]
            }],
            relative_path=True,
            show_multiview=False,
            frame_start=frames_per_image * i,
            frame_end=frames_per_image + frames_per_image * i,
            channel=2,
            fit_method='FIT',
            set_view_transform=False
        )
    

    for i in range(image_amount):
        sequence = bpy.context.scene.sequence_editor.sequences[i]

        # if sequence type is color or effect, skip
        if sequence.type == "COLOR" or sequence.type == "EFFECT":
            continue
        
        if titled:
            transform_amount = 0.8
            sequence.transform.offset_y = 60
                    
        sequence.transform.scale_x = transform_amount * sequence.transform.scale_x
        sequence.transform.scale_y = transform_amount * sequence.transform.scale_y

    if render:
        bpy.ops.render.render(animation=True)

if __name__ == "__main__":
    main()