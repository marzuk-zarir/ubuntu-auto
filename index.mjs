#!/usr/bin/env zx

const packages = await fs.readFile('./package-list.txt', 'utf-8')

await sleep(1000)
await $`clear`

echo(chalk.blue.bold('Welcome to Ubuntu Auto\n'))
echo('Following packages will be install:')
packages.split('\n').forEach((p) => echo(chalk.green('- ' + p)))

await $`sudo apt update`
await $`sudo apt upgrade`
sleep(1000)

// essential packages
echo('Installing essential packages....')
await $`sudo apt install ubuntu-restricted-extras build-essentials unzip net-tools`
await sleep(1000)

// git
const gitName = await question('What will be your git user name?')
const gitEmail = await question('What will be your git user email?')

echo('Installing and configuring git....')
await $`sudo apt install git`
await $`git config --global user.name "${gitName.trim()}"`
await $`git config --global user.email "${gitEmail.toLowerCase().trim()}"`
echo('You can edit git username and useremail from ~/.gitconfig')
await sleep(1000)

// yarn
echo('Installing yarn and json-server....')
await $`npm i -g yarn json-server`
echo('Yarn version: ' + (await $`yarn -v`))
echo('Json server: ' + (await $`json-server -v`))
await sleep(1000)

// ufw
echo('Installing and configuring ufw....')
await $`sudo apt install ufw`
await $`sudo ufw allow 80/tcp`
await $`sudo ufw allow 443/tcp`
await $`sudo ufw allow 22/tcp`
await $`sudo ufw enable`
await $`sudo ufw status`
await sleep(1000)

// docker
// ref: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04
echo('Installing and configuring docker....')
await $`sudo apt update`
await $`sudo apt upgrade`
await $`sudo apt install ca-certificates gnupg lsb-release`
await $`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
await $`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"`
await $`sudo apt update`
await $`apt-cache policy docker-ce`
await $`sudo apt install docker-ce`
await $`sudo systemctl status docker`
await $`sudo usermod -aG docker ${$.env.USER}` // docker without sudo
await $`su - ${$.env.USER}`
await $`groups`
await sleep(1000)

// docker-compose
echo('Installing docker compose version 2.9.0....')
await $`sudo curl -L "https://github.com/docker/compose/releases/download/2.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
await $`sudo chmod +x /usr/local/bin/docker-compose`
await $`sudo docker-compose --version`
await sleep(100)

// gnome extension
echo('Installing and configuring gnome extensions setup....')
await $`sudo apt install gnome-shell-extensions chrome-gnome-shell`
await sleep(100)

// google chrome
echo('Installing google chrome....')
await $`wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb`
await $`sudo dpkg -i google-chrome-stable_current_amd64.deb`
await $`rm -rf google-chrome-stable_current_amd64.deb`
await sleep(100)

// vscode
echo('Installing visual studio code....')
await $`wget https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64 -o vscode.deb`
await $`sudo dpkg -i vscode.deb`
await $`rm -rf vscode.deb`
await sleep(100)

// insomnia
echo('Installing insomnia....')
await $`echo "deb [trusted=yes arch=amd64] https://download.konghq.com/insomnia-ubuntu/ default all" | sudo tee -a /etc/apt/sources.list.d/insomnia.list`
await $`sudo apt update`
await $`sudo apt install insomnia`
await sleep(100)

echo('Installing Roboto, JetBrainsMono font....')
await $`mkdir ~/.fonts`

await $`wget https://fonts.google.com/download?family=Roboto -O roboto.zip`
await $`unzip roboto.zip`
await $`cp ./Robot0/*.ttf ~/.fonts`

await $`wget https://download.jetbrains.com/fonts/JetBrainsMono-2.242.zip -O jetbrains-mono.zip`
await $`unzip jetbrains-mono.zip`
await $`cp ./jetbrains-mono/fonts/variable/* ~/.fonts`

await sleep(100)

echo('Installation completed...')
echo(chalk.green('Please reboot your pc'))
