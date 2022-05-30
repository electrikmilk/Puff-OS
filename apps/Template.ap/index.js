/*
Your apps JavaScript goes here...
*/

$(function () {
	// Do stuff before you show your app...
	app.log('I\'m ready!');
	// Tell the system the app is ready...
	Window.show();
	// Show basic dialog...
	Window.dialog.message(false, 'Hey there!', function () {
		app.log('Pressed OK!');
	});
	// Access default menubar menus...
	fileMenu.divider();
	fileMenu.add('My File Menu Item', function () {
		Window.dialog.message(false, 'You clicked the file menu item.', function () {
			app.log('Pressed OK!');
		});
	});
	App.onReady(function () {
		// Assign action to menubar menu...
		let myMenuBarMenu = new Menu('Example', 2);
		myMenuBarMenu.add('Example Item', function () {
			Window.dialog.message(false, 'You clicked the example menu item.', function () {
				app.log('Pressed OK!');
			});
		});
	});
});

// This will be called when the user clicks the close button on your app...
function close() {
	// Wrap up anything the app is doing...

	// Stop your app.
	Window.close();
}