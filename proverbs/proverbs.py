import os
import sys
import bpy
from pprint import pprint

# https://docs.blender.org/api/current/bpy.ops.sequencer.html
# $ ./run-proverbs.sh proverbs.blend

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
    
    # clear sequencer
    # clean_sequencer(sequence_editors[0])

    render = False
    output_path = "\\\\wsl$\Debian\home\enki\Projects\Protocodex\creation-generator\\blender\\render\\test"

    # interpret the arguments after --
    # check if -- is in sys.argv
    if "--" in sys.argv:
        for arg in sys.argv[sys.argv.index("--") + 1:]:
            if arg == "render":
                render = True
     
    bpy.context.scene.render.filepath = output_path
    
    line_index=0
    clip_length = 280
    background_color='#D8C695'
    start_frame = 0 # 1st 982
    add_background = True

    # Set number of frames 
    bpy.context.scene.frame_end = start_frame + clip_length


    
    # Add background
    if add_background:
      bpy.ops.sequencer.effect_strip_add(
        sequence_editors[0],
        type='COLOR', 
        frame_start=start_frame + 1,
        frame_end=start_frame + clip_length,
        channel=1,
        color=hex_to_rgb(background_color)
      )

    # read lines from a file
    with open('files/proverbs.txt') as f:
        lines = f.readlines()

        bpy.ops.sequencer.effect_strip_add(
          sequence_editors[0],
          type='TEXT',
          frame_start=start_frame + 1,
          frame_end=start_frame + clip_length,
          channel=2
        )


    if render:
        bpy.ops.render.render(animation=True)

if __name__ == "__main__":
    main()