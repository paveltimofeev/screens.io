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


# ATTACH TO NGINX
# extend nginx conf by .platform/nginx/conf.d/myconf.conf
# https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.html
...


# AUTO RENEWAL BY CRON AND GETTING RENEWAL KEYS BY aws s3 copy
...
