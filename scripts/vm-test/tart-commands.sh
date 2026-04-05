#!/bin/bash
# Quick reference: Tart commands for the coherence-test VM.
# Run these from the HOST machine (not inside the VM).
set -e

CMD="${1:-help}"

case "$CMD" in
    run)
        echo "Starting VM with GUI..."
        tart run coherence-test
        ;;
    run-headless)
        echo "Starting VM headless..."
        tart run coherence-test --no-graphics &
        sleep 5
        echo "VM IP: $(tart ip coherence-test)"
        echo "SSH:   ssh admin@$(tart ip coherence-test)"
        ;;
    ssh)
        IP=$(tart ip coherence-test 2>/dev/null)
        if [ -z "$IP" ]; then
            echo "VM not running. Start it first: $0 run-headless"
            exit 1
        fi
        echo "Connecting to $IP..."
        ssh -o StrictHostKeyChecking=no admin@"$IP"
        ;;
    stop)
        echo "Stopping VM..."
        tart stop coherence-test
        ;;
    snapshot-create)
        NAME="${2:-clean-slate}"
        echo "Creating snapshot '$NAME'..."
        tart stop coherence-test 2>/dev/null || true
        tart snapshot create coherence-test "$NAME"
        echo "Done. Restore with: $0 snapshot-restore $NAME"
        ;;
    snapshot-restore)
        NAME="${2:-clean-slate}"
        echo "Restoring snapshot '$NAME'..."
        tart stop coherence-test 2>/dev/null || true
        tart snapshot restore coherence-test "$NAME"
        echo "Done. Start with: $0 run"
        ;;
    snapshot-list)
        tart snapshot list coherence-test
        ;;
    ip)
        tart ip coherence-test
        ;;
    copy-scripts)
        IP=$(tart ip coherence-test 2>/dev/null)
        if [ -z "$IP" ]; then
            echo "VM not running. Start it first: $0 run-headless"
            exit 1
        fi
        SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
        echo "Copying test scripts to VM..."
        scp -o StrictHostKeyChecking=no "$SCRIPT_DIR/reset.sh" "$SCRIPT_DIR/setup-vm.sh" "$SCRIPT_DIR/verify.sh" admin@"$IP":~/
        echo "Done. SSH in and run: bash ~/setup-vm.sh"
        ;;
    help|*)
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  run              Start VM with GUI"
        echo "  run-headless     Start VM headless (background)"
        echo "  ssh              SSH into running VM"
        echo "  stop             Stop the VM"
        echo "  snapshot-create [name]   Create snapshot (default: clean-slate)"
        echo "  snapshot-restore [name]  Restore snapshot (default: clean-slate)"
        echo "  snapshot-list    List snapshots"
        echo "  ip               Show VM IP address"
        echo "  copy-scripts     Copy test scripts into the VM"
        echo ""
        echo "Typical workflow:"
        echo "  1. $0 run              # First time: GUI setup"
        echo "  2. $0 copy-scripts     # Copy scripts into VM"
        echo "  3. $0 snapshot-create   # Save clean state"
        echo "  4. $0 snapshot-restore  # Reset before each test"
        echo "  5. $0 run-headless      # Start for testing"
        echo "  6. $0 ssh               # SSH in and test"
        ;;
esac
