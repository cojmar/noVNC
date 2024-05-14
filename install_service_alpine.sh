#!/bin/sh
# chmod +x install_service_alpine.sh
export MY_SCRIPT_PATH=$(pwd)/server
export MY_NODE_PATH=$(which node)
export MY_NAME="noVNC"

rc-update del ${MY_NAME}
rm -rf /etc/init.d/${MY_NAME}
cat > /etc/init.d/${MY_NAME} <<EOF
#!/sbin/openrc-run
depend() {
    need net
}
command=${MY_NODE_PATH}
command_args=${MY_SCRIPT_PATH}/index.js
command_background=true
pidfile=/run/${MY_NAME}.pid
stop() { 
  cat /run/${MY_NAME}.pid | xargs -I% kill -INT -%
}
EOF
chmod +x /etc/init.d/${MY_NAME}
rc-update add ${MY_NAME}
service ${MY_NAME} stop
service ${MY_NAME} start