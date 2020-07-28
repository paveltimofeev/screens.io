
# DEPLOY LOG
sudo tail -f /var/log/eb-engine.log

# BUILD LOG
sudo tail -f /var/log/cfn-init.log
# container_commands OUTPUT LOG
sudo tail -f /var/log/cfn-init-cmd.log

# APP LOG
sudo tail -f /var/log/web.stdout.log
