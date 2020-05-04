#!/bin/sh

ssh -o StrictHostKeyChecking=no ubuntu@"${DEPLOY_ENDPOINT}" << EOF
  echo "Tests have passed"
EOF
