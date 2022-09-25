import os
import bpy

# https://docs.blender.org/api/current/bpy.ops.sequencer.html

def clean_sequencer(sequence_context):
    bpy.ops.sequencer.select_all(sequence_context, action="SELECT")
    bpy.ops.sequencer.delete(sequence_context)

def find_sequence_editor():
    for area in bpy.context.window.screen.areas:
        if area.type == "SEQUENCE_EDITOR":
            return area
    return None

# add images to the blender sequence editor
def add_images_to_sequence_editor():
    sequence_editor = find_sequence_editor()
    sequence_editor_context = {
        "area": sequence_editor,
    }
    
    clean_sequencer(sequence_editor_context)
    
    input_dir = "/home/tlaloc/projects/protocodex/creation-generator/tmp/gsearchimages/"
    frame_length = 20

    filenames = os.listdir(input_dir)

    for i in range(10):
        # imge name is img + i padded with 0s to 3 digits
        image_name = "img" + str(i + 1).zfill(3) + ".jpg"

        bpy.ops.sequencer.image_strip_add(
            sequence_editor_context,
            directory=input_dir,
            files=[{
                "name": filenames[i]
            }],
            relative_path=True,
            show_multiview=False,
            frame_start=1 + frame_length * i,
            frame_end=20 + frame_length * i,
            channel=1,
            fit_method='FIT',
            set_view_transform=False
        )
    
def main():
    add_images_to_sequence_editor()


if __name__ == "__main__":
    main()