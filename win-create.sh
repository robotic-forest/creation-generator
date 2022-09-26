if [ "$1" == "--bg" ]; then
    exec /mnt/c/Users/sasno/Programs/Blender\ Launcher/Builds/stable/blender-3.3.0+lts.0759f671ce1f/blender.exe blender/save-videos-to-vid-editor.blend --background --python blender/test.py -- is_wsl $2 $3 $4 $5 $6 $7 $8 $9
else
    exec /mnt/c/Users/sasno/Programs/Blender\ Launcher/Builds/stable/blender-3.3.0+lts.0759f671ce1f/blender.exe blender/save-videos-to-vid-editor.blend --python blender/test.py -- is_wsl $1 $2 $3 $4 $5 $6 $7 $8 $9
fi
