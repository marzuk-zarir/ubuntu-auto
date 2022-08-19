sudo apt udpate
sudo apt udpate
sudo apt install curl zsh

# omz
echo "Setting up zsh & oh-my-zsh...."
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
echo "exec zsh" >>~/.bashrc
source ~/.bashrc

# nvm
echo "Setting up node version manager...."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
echo -e '# nvm\nexport NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >>~/.zshrc
source ~/.zshrc

# nodejs
nvm install --lts
npm i -g zx
zx https://raw.githubusercontent.com/marzuk-zarir/ubuntu-auto/main/index.mjs
