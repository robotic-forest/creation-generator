import os
import sys
import bpy

# https://docs.blender.org/api/current/bpy.ops.sequencer.html
# use --debug-wm to see more info
# $ blender save-videos-to-vid-editor.blend --python test.py --background -- butts

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
def add_images_to_sequence_editor():
    sequence_editors = find_sequence_editors()
    
    clean_sequencer(sequence_editors[0])

    print(sys.argv)

    # interpret the arguments after --
    for arg in sys.argv[sys.argv.index("--") + 1:]:
        print(arg)
    
    input_dir = "/home/tlaloc/projects/protocodex/creation-generator/tmp/gsearchimages/"
    filenames = os.listdir(input_dir)
    
    frames_per_image = 20
    transform_amount = 0.9
    image_amount = 2
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
            frame_start=1 + frames_per_image * i,
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
        
    
def main():
    add_images_to_sequence_editor()

    bpy.ops.render.render(animation=True)


if __name__ == "__main__":
    main()