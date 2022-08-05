#!/bin/sh
if [ "$NODE_ENV" = "development" ]; 
then npm install
else npm install --only=production;
fi
