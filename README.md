# FERemote Panel

Web panel for ForgeEssential powered servers using FERemote API

## Installation

 1. Clone source
 2. Make sure the `var` directory is writable by the webserver
 3. Run `composer install` (Get composer from https://getcomposer.org/download/)
 4. Set the `web` directory as document root
 5. (Optionally) Configure settings via `config/config.json`
 6. Use `/remote` command as a player on your MC server to get your personal login data

## Configuration (config.json)

Address and port default to `localhost:27020`.

If username and passkey are left empty, anonymous access is used by default (recommended).
If you specify a username and a passkey, be sure to **only use a virtual user with restricted permissions.**

### Setting up a virtual user

Using a virtual user allows to view data from the web panel without logging in.
This can be useful if you want some data (like currently logged in players) to be public.
Please remember that this will allow anyone to write chat messages or run some simple commands on your server,
if no further configuration is performed.

To create a virtual user, simply run the command `/remote setkey <username> <passkey>`.
It is recommended to use a username with characters in it, that are normally not allowed in usernames (for example `$remote`).

After that you can simply configure the permissions of that virtual user with `/p user <username>`.
By default this user will be in the `_GUESTS_` group like a normaly player and will be able to access the same features as other guests via remote.
This is why it is recommended to configure some permissions first (see [Permissions](#permissions)).

For example to prevent anonymous users of the panel to send chat messages, use  
`/p user <username> deny fe.remote.chat.send`

### Permissions

* Send chat messages  
  `fe.remote.chat.send`
* Show player list  
  base: `fe.remote.player.query`  
  location: `fe.remote.player.query.location`  
  health, etc.: `fe.remote.player.query.detail`
