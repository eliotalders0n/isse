#!/bin/bash

# Git Account Switcher
# Switch between eliotalders0n (personal) and Pukuta-BH (work)

show_current() {
    echo "Current Git Account:"
    echo "  Name:  $(git config user.name)"
    echo "  Email: $(git config user.email)"
}

show_usage() {
    echo "Usage: ./git-switch.sh [option]"
    echo ""
    echo "Options:"
    echo "  personal     Switch to eliotalders0n account"
    echo "  work         Switch to Pukuta-BH account"
    echo "  current      Show current account"
    echo "  -g, --global Use with personal/work to set globally"
    echo ""
    echo "Examples:"
    echo "  ./git-switch.sh personal          # Set for current repo only"
    echo "  ./git-switch.sh work --global     # Set globally"
    echo "  ./git-switch.sh current           # Show current account"
}

set_personal() {
    local scope=$1
    if [ "$scope" == "--global" ] || [ "$scope" == "-g" ]; then
        git config --global user.name "eliotalders0n"
        git config --global user.email "eliot.alderson20@gmail.com"
        echo "✓ Switched to eliotalders0n (GLOBAL)"
    else
        git config user.name "eliotalders0n"
        git config user.email "eliot.alderson20@gmail.com"
        echo "✓ Switched to eliotalders0n (LOCAL - this repo only)"
    fi
    show_current
}

set_work() {
    local scope=$1
    if [ "$scope" == "--global" ] || [ "$scope" == "-g" ]; then
        git config --global user.name "Pukuta-BH"
        git config --global user.email "pukuta@bongohive.co.zm"
        echo "✓ Switched to Pukuta-BH (GLOBAL)"
    else
        git config user.name "Pukuta-BH"
        git config user.email "pukuta@bongohive.co.zm"
        echo "✓ Switched to Pukuta-BH (LOCAL - this repo only)"
    fi
    show_current
}

# Main script logic
case "$1" in
    personal)
        set_personal "$2"
        ;;
    work)
        set_work "$2"
        ;;
    current)
        show_current
        ;;
    -h|--help|"")
        show_usage
        ;;
    *)
        echo "Error: Unknown option '$1'"
        echo ""
        show_usage
        exit 1
        ;;
esac
