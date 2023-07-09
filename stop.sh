#!/usr/bin/env bash
set -e

########################################
# Check if local session exists
########################################
local_check() {
  echo 'Checking for "Keecash Backend Microservices" session'

  tmux has-session -t KEECASH
}

########################################
# Stop local session services
########################################
local_stop() {
  echo 'Stopping "Keecash Backend Microservices" session services'

  # REST API services
  tmux send-keys -t KEECASH:api.0 C-c
  tmux send-keys -t KEECASH:api.1 C-c
  tmux send-keys -t KEECASH:api.2 C-c

  # Kafka services
  tmux send-keys -t KEECASH:kafka.0 C-c
  tmux send-keys -t KEECASH:kafka.1 C-c

  sleep 3
}

########################################
# Destroy session
########################################
local_destroy() {
  echo 'Destroying "Keecash Backend Microservices" session'

  tmux kill-session -t KEECASH
}


########################################
# MAIN
########################################
local_check && local_stop && local_destroy
