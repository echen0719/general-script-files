echo "This script file adds tab autocomplete for file extensions."
read -p "What programming language? " language

if [ "$language" == "java" ]; then
echo "_java_complete_java_files() {" >> ~/.bashrc
echo "    COMPREPLY=($(compgen -f -X '!*.java' -- "${COMP_WORDS[COMP_CWORD]}"))" >> ~/.bashrc
echo "}" >> ~/.bashrc
echo "complete -F _java_complete_java_files java" >> ~/.bashrc
fi
