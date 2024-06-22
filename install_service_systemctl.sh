#!/bin/sh
# chmod +x install_service_systemctl.sh
export MY_SCRIPT_PATH=$(pwd)/
export MY_NODE_PATH=$(which node)
export MY_NAME=$(basename "`pwd`")

rm -rf /etc/systemd/system/${MY_NAME}.service
cat > /etc/systemd/system/${MY_NAME}.service <<EOF
[Unit]
Description=${MY_NAME}
Requires=network.target
After=network.target

[Service]
Restart=on-failure
ExecStart=${MY_NODE_PATH} ${MY_SCRIPT_PATH}/index.js
Type=forking

[Install]
WantedBy=multi-user.target
EOF
systemctl enable ${MY_NAME}
