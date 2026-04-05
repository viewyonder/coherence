#!/bin/bash
# One-time setup script for the Tart VM.
# Run this inside the VM after first boot to install dependencies.
set -e

echo "=== Setting up Coherence test VM ==="

# Install Homebrew if not present
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Install Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    brew install node
fi

# Install Claude Code
if ! command -v claude &> /dev/null; then
    echo "Installing Claude Code..."
    npm install -g @anthropic-ai/claude-code
fi

# Configure git (minimal)
git config --global user.name "Coherence Test"
git config --global user.email "test@coherence.dev"
git config --global init.defaultBranch main

# Enable SSH (Remote Login)
echo ""
echo "Enabling Remote Login for SSH access..."
sudo systemsetup -setremotelogin on 2>/dev/null || echo "  (Enable manually: System Settings > General > Sharing > Remote Login)"

# Copy reset script to home
cp "$(dirname "$0")/reset.sh" ~/reset.sh
chmod +x ~/reset.sh

echo ""
echo "=== Setup complete ==="
echo "Next steps:"
echo "  1. Run 'claude' to authenticate (one-time)"
echo "  2. Stop the VM and create a snapshot: tart snapshot create coherence-test clean-slate"
echo "  3. For each test cycle, restore with: tart snapshot restore coherence-test clean-slate"
