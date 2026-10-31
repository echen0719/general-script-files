#!/bin/bash
# found on reddit
# https://github.com/vastworks/just-right/blob/main/sizer_engine.py

usage() {
    echo -e "Usage: $0 [-t] [-w] [-h]"
    echo -e "-t\t\tWindow name (inclusive)" # what is this ugly thing
    echo -e "-w\t\tSet to defined width (e.g. 1600)"
    echo -e "-h\t\tSet to defined height (e.g. 900)"
    echo -e "--help\t\tTo show this menu"
    exit 1
}

for arg in "$@"; do
    if [[ "$arg" == "--help" ]]; then
        usage
    fi
done

# i think i am in love with getopts
while getopts ":t:w:h:" opt; do
    if [[ "${opt}" = "t" ]]; then
        term="$OPTARG"
    elif [[ "${opt}" = "w" ]] && [[ "$OPTARG" =~ ^[0-9]+$ ]]; then
        width="$OPTARG"
    elif [[ "${opt}" = "h" ]] && [[ "$OPTARG" =~ ^[0-9]+$ ]]; then
        height="$OPTARG"
    else
        echo -e "Woah there buddy! Wrong arguments..."
        exit 1
    fi
done

if [[ -z "$term" ]] || [[ -z "$width" ]] || [[ -z "$height" ]]; then
    read -p "Window name to resize: " term
    read -p "To what width (e.g. 1600)?: " width
    read -p "To what height (e.g. 900)?: " height
fi

script="$HOME/.$(openssl rand -hex 32).js"

# https://develop.kde.org/docs/plasma/kwin/api/#kwinwindow
cat > "$script" <<EOF
const term = "$term".toLowerCase();

for (const window of workspace.stackingOrder) {
    if (window.caption.toLowerCase().includes(term.toLowerCase())) {
        const geometry = Object.assign({}, window.frameGeometry); // temp
        geometry.width = $width;
        geometry.height = $height;

        window.frameGeometry = geometry;
    }
}
EOF

qdbus=$(which qdbus6)
ID=$("$qdbus" org.kde.KWin /Scripting org.kde.kwin.Scripting.loadScript "$script")
"$qdbus" org.kde.KWin /Scripting org.kde.kwin.Scripting.start

rm -f "$script"
echo "Resized $term to $width x $height"