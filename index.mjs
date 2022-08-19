#!/usr/bin/env zx

const packages = await fs.readFile('./package-list.txt', 'utf-8')
const cwd = process.cwd()

await sleep(1000)
await $`clear`

echo(chalk.blue.bold('Welcome to Ubuntu Auto\n'))
echo('Following packages will be install:')
packages.split('\n').forEach((p) => echo(chalk.green('- ' + p)))

// question
const permission = (await question('Are you sure want to continue? (y/n)')).trim().toLowerCase()

if (permission === 'y' || permission === 'yes') {
    await $`sudo apt update`
    await $`sudo apt upgrade`
    sleep(1000)

    // init tmp dir
    await $`rm -rf /tmp/ubuntu-auto`
    await $`mkdir /tmp/ubuntu-auto`
    await $`cd /tmp/ubuntu-auto`
    sleep(1000)

    // omz plugins
    echo('Installing omz plugins....')
    await $`git clone https://github.com/zsh-users/zsh-syntax-highlighting.git \${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`
    await $`git clone https://github.com/zsh-users/zsh-autosuggestions \${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
    await $`sed -i 's/plugins=(git.*/plugins=(git zsh-syntax-highlighting zsh-autosuggestions)/' ~/.zshrc`
    await sleep(1000)

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
    await sleep(1000)

    // gnome extension
    echo('Installing and configuring gnome extensions setup....')
    await $`sudo apt install gnome-shell-extensions chrome-gnome-shell`
    await sleep(1000)

    // google chrome
    echo('Installing google chrome....')
    await $`wget --show-progress https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb`
    await $`sudo dpkg -i google-chrome-stable_current_amd64.deb`
    await sleep(1000)

    // vscode
    echo('Installing visual studio code....')
    await $`wget -O vscode.deb --show-progress https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64`
    await $`sudo dpkg -i vscode.deb`
    await sleep(1000)

    // insomnia
    echo('Installing insomnia....')
    await $`echo "deb [trusted=yes arch=amd64] https://download.konghq.com/insomnia-ubuntu/ default all" | sudo tee -a /etc/apt/sources.list.d/insomnia.list`
    await $`sudo apt update`
    await $`sudo apt install insomnia`
    await sleep(1000)

    // fonts
    echo('Installing Roboto, JetBrainsMono, IBM plex font....')
    await $`mkdir ~/.fonts`

    await $`wget -O roboto.zip --show-progress https://fonts.google.com/download?family=Roboto`
    await $`unzip roboto.zip`
    await $`cp ./*.ttf ~/.fonts`

    await $`wget -O jetbrains-mono.zip --show-progress https://download.jetbrains.com/fonts/JetBrainsMono-2.242.zip`
    await $`unzip jetbrains-mono.zip`
    await $`cp ./fonts/variable/* ~/.fonts`

    await $`wget -O ibm-plex.zip --show-progress https://github.com/IBM/plex/releases/download/v6.1.0/TrueType.zip`
    await $`unzip ibm-plex.zip`
    await $`cp ./TrueType/IBM-Plex-Mono/*.ttf ~/.fonts`
    await $`cp ./TrueType/IBM-Plex-Sans/*.ttf ~/.fonts`
    await $`cp ./TrueType/IBM-Plex-Serif/*.ttf ~/.fonts`
    await sleep(1000)

    // clean up temp dir
    echo('Cleaning directories...')
    await $`cd ${cwd}`
    await $`rm -rf /tmp/ubuntu-auto`
    await sleep(1000)

    echo('Installation completed...\n')
    echo(chalk.green('Please reboot your pc\n'))
} else {
    await sleep(1000)
    echo(chalk.red("You can't proceed"))
}
