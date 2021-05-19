# Puff OS

Puff OS is a [web desktop](https://en.wikipedia.org/wiki/Web_desktop), made in a LAMP envrionment.

This is a hobby project (for now anyway) and WIP, so most of the apis and applications are still being worked on. It is a successor to my previous webtop called Titan, maybe I'll put the source for that on here too someday.

If you do actually run it, keep in mind it doesn't have user accounts (yet). Just click "Demo Mode" to get to the desktop and run applications, etc. It runs in a popup window that will go fullscreen once interacted with.

## Basic Applications
- Text Editor
- Camera
- Calculator
- About Device
- HTML Playground
- Process Manager
- Terminal
- Settings
- Template App
- UI Gallery
- Bug Reporter

 ## It can...
 - Monitor memory that it's using and warn the user to close apps not in use
 - Detect when apps are not responding and warn the user if the app is reported to be unresponsive a few times
 - Keep track of processes that are running
 - Logout: ask running apps to close and return to the login
 - Restart: ask running apps to close, refresh
 - Exit: ask running apps to close, exit fullscreen, close the popup window

Applications have access to apis to add menus to the menubar, create applets for the menubar and more. Apps are easy to make as the system puts your app together, you just need to make a css, js, html, and manifest file.

I've worked on web desktops in the past but never in a serious capacity like this, this time I'm considering security, letting it rely on a backend, etc. I didn't know previously that a web desktop was something people will actually use, so this is something I might host publically for fun at some point.

It has a UI inspired by modern UIs like iPad OS & macOS Big Sur, but also by old versions of OS X and the Ambience theme from GNOME 2 in Ubuntu as those are UIs I grew up admiring.

## Early development screenshots

I try my best to do these monthly or every few months when changes are significant enough.

May 19 screenshot
![Desktop Screenshot](https://i.imgur.com/mrQZCJF.png)

Feb. 12 screenshot
![Desktop Screenshot](https://i.imgur.com/N1d0660.jpg)

Jan. 29 screenshot
![Desktop Screenshot](https://i.imgur.com/MrC3A0Y.jpg)
