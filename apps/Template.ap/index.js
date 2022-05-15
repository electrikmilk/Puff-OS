/*
Your apps JavaScript goes here...
*/

$(function () {
	// Do stuff before you show your app...
	app.log("I'm ready!");
	// Tell the system the app is ready...
	Window.show();
	// Show basic dialog...
	Window.dialog.message(false, "Hey there!", function () {
		app.log("Pressed OK!");
	});
	// Assign action to menubar menu defined in manifest.json...
	Window.menu("menuitem", function () {
		Window.dialog.message(false, "You clicked the menu item.", function () {
			app.log("Pressed OK!");
		});
	});
});

// This will be called when the user clicks the close button on your app...
function close() {
	// Wrap up anything the app is doing...

	// Stop your app.
	Window.close();
}