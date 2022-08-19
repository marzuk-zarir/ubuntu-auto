#!/usr/bin/env zx

await $`sed -i 's/plugins=(git.*/plugins=(git zsh-syntax-highlighting zsh-autosuggestions)/' .zshrc`
