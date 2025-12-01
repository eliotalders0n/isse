# Git Account Switcher

A simple bash script to quickly switch between multiple git accounts.

## Overview

This script helps you manage two git accounts:
- **Personal**: eliotalders0n (eliot.alderson20@gmail.com)
- **Work**: Pukuta-BH (pukuta@bongohive.co.zm)

## Installation

### Option 1: Use locally in any repository

1. Copy `git-switch.sh` to your repository
2. Make it executable:
   ```bash
   chmod +x git-switch.sh
   ```
3. Run it from your repository:
   ```bash
   ./git-switch.sh [option]
   ```

### Option 2: Install globally (recommended)

Make the script available from anywhere on your system:

```bash
sudo cp git-switch.sh /usr/local/bin/git-switch
sudo chmod +x /usr/local/bin/git-switch
```

Now you can run `git-switch` from any directory.

## Usage

### Check current account

```bash
./git-switch.sh current
```

Output:
```
Current Git Account:
  Name:  eliotalders0n
  Email: eliot.alderson20@gmail.com
```

### Switch to personal account (repository-specific)

```bash
./git-switch.sh personal
```

This sets the account for the current repository only. Other repositories remain unaffected.

### Switch to work account (repository-specific)

```bash
./git-switch.sh work
```

### Switch globally

To change the default account for all repositories:

```bash
./git-switch.sh personal --global
./git-switch.sh work --global
```

You can also use `-g` as shorthand:
```bash
./git-switch.sh work -g
```

### Show help

```bash
./git-switch.sh --help
```

## Examples

### Scenario 1: Working on a work project

```bash
cd ~/work/project
./git-switch.sh work
git commit -m "Fix bug"
git push
```

Commits will be authored by Pukuta-BH.

### Scenario 2: Working on a personal project

```bash
cd ~/personal/my-app
./git-switch.sh personal
git commit -m "Add feature"
git push
```

Commits will be authored by eliotalders0n.

### Scenario 3: Change default account globally

```bash
./git-switch.sh work --global
```

Now all new repositories will use the work account by default.

## How It Works

The script uses git's config system:

- **Repository-specific** (default): Uses `git config user.name` and `git config user.email`
  - Settings stored in `.git/config`
  - Only affects the current repository

- **Global** (with --global flag): Uses `git config --global user.name` and `git config --global user.email`
  - Settings stored in `~/.gitconfig`
  - Affects all repositories unless overridden locally

## Troubleshooting

### "Permission denied" error

Make sure the script is executable:
```bash
chmod +x git-switch.sh
```

### "Not a git repository" error

You can only set repository-specific settings inside a git repository. Either:
- Navigate to a git repository first, or
- Use the `--global` flag to set globally

### Check which account will be used for commits

```bash
./git-switch.sh current
```

Or manually:
```bash
git config user.name
git config user.email
```

## Accounts Configuration

Current configured accounts:

| Account | Name | Email | Use Case |
|---------|------|-------|----------|
| Personal | eliotalders0n | eliot.alderson20@gmail.com | Personal projects |
| Work | Pukuta-BH | pukuta@bongohive.co.zm | Work projects |

## Customization

To add more accounts or change existing ones, edit the `git-switch.sh` file and modify the `set_personal()` or `set_work()` functions, or add new functions following the same pattern.

## License

Free to use and modify.
