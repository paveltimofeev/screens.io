#!/usr/bin/env bash

# INSTALL certbot
# https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html#letsencrypt
sudo wget -r --no-parent -A 'epel-release-*.rpm' http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
sudo rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
sudo yum-config-manager --enable epel*
sudo yum repolist all
sudo yum install -y certbot

# GET CERTS MANUALLY BY DNS TXT RECORD
# https://certbot.eff.org/lets-encrypt/centosrhel7-other
# https://dev.to/hzburki/configure-ssl-certificate-aws-elastic-beanstalk-single-instance-3hl8
sudo certbot certonly --manual -d beta.api.patico.pro --preferred-challenges dns
sudo aws s3 cp /etc/letsencrypt s3://vrtcerts/etc/letsencrypt --recursive


# MOUNT CERTS FROM S3 to nginx
# BY files: DIRECTIVE
# to /etc/nginx/fullchain.pem
# to /etc/nginx/privkey.pem


# EXTEND NGINX CONF by placing conf at .platform/nginx/conf.d/myconf.conf
# https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.html


# AUTO RENEWAL BY CRON AND GETTING RENEWAL KEYS BY aws s3 copy
#sudo aws s3 cp s3://vrtcerts/etc/letsencrypt /etc/letsencrypt --recursive
#sudo chown -R root /etc/letsencrypt
#sudo chmod -R 000400 /etc/letsencrypt
#sudo certbot renew -q

# Or:
# echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
