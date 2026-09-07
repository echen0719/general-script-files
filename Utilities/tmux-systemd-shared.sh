#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "This script must be run with root."
  exit 1
fi

# &> to prevent error output
if [ -n "$1" ] && id "$1" &> /dev/null; then
    targetUser="$1"
else
    targetUser="$(logname)" # logname over id because root can mess with stuff
fi

targetHome="$(getent passwd "$targetUser" | cut -d: -f6)" # found on SO
tmuxScriptLocation="/usr/local/bin/tmux-start.sh"
tmuxServiceLocation="/etc/systemd/system/tmux.service"

# checks if already exists; if not, create session for home directory
cat > "$tmuxScriptLocation" <<EOF
#!/bin/bash

/usr/bin/tmux has-session -t shared 2>/dev/null || /usr/bin/tmux new-session -d -s shared -c "$targetHome"
EOF

chmod 755 "$tmuxScriptLocation"

cat > "$tmuxServiceLocation" <<EOF
[Unit]
Description=Start Tmux with Sharing
After=network.target

[Service]
Type=oneshot
User=$targetUser
Group=$targetUser
ExecStart=$tmuxScriptLocation
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now tmux.service