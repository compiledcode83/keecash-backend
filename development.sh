#!/usr/bin/env bash
set -e

########################################
# Create local session
########################################
local_create() {
    echo 'Creating "Keecash Backend Microservices" session'

    # REST API
    tmux new-session -d -s KEECASH -n api
    tmux select-layout -t KEECASH:api even-vertical
    tmux split-window -d -t KEECASH:api.0
    tmux select-layout -t KEECASH:api even-vertical
    tmux split-window -d -t KEECASH:api.1
    tmux select-layout -t KEECASH:api even-vertical

    # Kafka
    tmux new-window -d -t KEECASH -n kafka
    tmux select-layout -t KEECASH:kafka even-vertical
    tmux split-window -d -t KEECASH:kafka.0
    tmux select-layout -t KEECASH:kafka even-vertical
}

########################################
# Start local session services
########################################
local_start() {
    echo 'Starting "Keecash Backend Microservices" session services'

    # REST API: Keecash Main API Service
    tmux send-keys -t KEECASH:api.0 'npm run api:start:dev --port=3000' C-m
    # REST API: Webhook API Handler
    tmux send-keys -t KEECASH:api.1 'npm run webhook:start:dev --port=3001' C-m
    # REST API: Admin Panel API Service
    tmux send-keys -t KEECASH:api.2 'npm run admin:start:dev --port=3002' C-m

    # Kafka: Kafka Event Producer Service
    tmux send-keys -t KEECASH:kafka.0 'npm run producer:start:dev --port=3003'  C-m
    # Kafka: Kafka Event Consumer Service
    tmux send-keys -t KEECASH:kafka.1 'npm run consumer:start:dev' C-m

    sleep 1
}

########################################
# Attach to local session
########################################
local_attach() {
  echo 'Attaching to "Keecash Backend Microservices" session'

  tmux attach-session -t KEECASH
}

########################################
# MAIN
########################################
./stop.sh || true
local_create && local_start && local_attach
