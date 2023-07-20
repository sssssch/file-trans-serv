#!/bin/bash

# Parse command line arguments
while getopts ":p:" opt; do
  case $opt in
    p)
      password=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Set the default admin password
if [ -z "$password" ]; then
  password="passw0rd"
fi

# Start the server with the admin password
node node.js -p $password