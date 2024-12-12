#!/bin/sh
while true; do
    read -p "Do you wish to copy over the working copies to source? " yn
    case $yn in
        [Yy]* ) cp -R platforms/browser/www/index.html platforms/browser/www/css platforms/browser/www/img platforms/browser/www/js www/; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done