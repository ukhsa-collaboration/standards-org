#!/bin/bash

####################################################################################
# This is a test script which confirms the dev docker image works correctly with a #
# basic docs configuration. This script assumes the server is already running and  #
# available on localhost:8080 though it will do a check first and wait in case the #
# server is still starting up when this script is executed.                        #
#                                                                                  #
# There is only one "test" run which just confirms the text in the index.md file   #
# in the docs folder next to this script is found on the /testing/ index page.     #
#                                                                                  #
# This script can be run locally but is designed to be run as part of the github   #
# actions test workflow.                                                           #
####################################################################################

# try to reach the server 10 times with a 1 second sleep between each try
MAX_RETRIES=10
until curl -sf -o /dev/null "http://localhost:8080/"
do
  ((MAX_RETRIES--))
  echo "Waiting for docs server to become available..."
  sleep 1
  if [ "$MAX_RETRIES" -eq 0 ]; then
    # fall through to the next check below for one last check and a consistent error
    # message if it still fails
    break
  fi
done

# read the contents of the testing index page and store it
if ! CURL_OUTPUT=$(curl -fs http://localhost:8080/testing/);
then
  echo "Failure: Curl failed to get the testing page"
  exit 1
fi

# check to see if the text we expect is present on the index page
MATCHES=$(echo "$CURL_OUTPUT" | grep -c "This is the index page for testing")
if [ "$MATCHES" -eq 1 ]; then
  echo "Success: Found text"
  exit 0
else
  echo "Failure: Text not found"
  exit 1
fi
